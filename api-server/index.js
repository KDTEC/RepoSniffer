const express = require("express")
const {generateSlug} = require("random-word-slugs")
const {ECSClient, RunTaskCommand} = require('@aws-sdk/client-ecs')
// we are using the socket server to subscribe to the logs
const { Server } = require("socket.io")
const Redis = require("ioredis")
const cors = require('cors');
require('dotenv').config();

const app = express()
const PORT = 9000
const SOCKET_SERVER_PORT = 9001

const subscriber = new Redis(process.env.REDIS_URL)
app.use(cors());
const io = new Server({cors: '*'})

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

io.listen(SOCKET_SERVER_PORT, () => {
    console.log(`Socket server listening at port: ${SOCKET_SERVER_PORT}`)
})

const ecsClient = new ECSClient({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const config = {
    CLUSTER: 'arn:aws:ecs:us-east-2:779723065339:cluster/builder-cluster',
    TASK: 'arn:aws:ecs:us-east-2:779723065339:task-definition/builder-task'
}

app.use(express.json())

// as we will hit the endpoint 'http://localhost:9000/project' and give gitURL in request body, it will spin up a container and give us the deployed url
app.post('/project', async (req, res) => {
    const {gitURL, slug} = req.body
    const projectSlug = slug? slug: generateSlug()

    // spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-0e89e400df6a3f33d', 'subnet-0e59379feeab83f8a', 'subnet-0e23c78bb31ed7564'],
                securityGroups: ['sg-08177cccc85245ace']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        {
                            name: 'GIT_REPOSITORY_URL',
                            value: gitURL
                        },
                        {
                            name: 'PROJECT_ID',
                            value: projectSlug 
                        }
                    ]
                }
            ]
        }
    })
    await ecsClient.send(command);
    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } })
})

async function initRedisSubscribe() {
    console.log('Subscribed to logs....')
    // subscribe to all the logs starting with 'logs:'
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })
}

initRedisSubscribe()

app.listen(PORT, () => {
    console.log(`API-server running at port: ${PORT}`)
})
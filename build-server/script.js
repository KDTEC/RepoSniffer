require('dotenv').config();
const { exec } = require('child_process')
const path = require('path')
// builtin file system module
const fs = require('fs')
// put object comand is used to put objects in S3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
var mime = require('mime-types')
// all the logs will be pubsub (pushed) on redis
const Redis = require("ioredis")

const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const publisher = new Redis(process.env.REDIS_URL)

const PROJECT_ID = process.env.PROJECT_ID

const publishLogs = (log) => {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({log}))
}
const init = async () => {
    console.log("Executing script.js")
    publishLogs("Build started...")
    const outDirPath = path.join(__dirname, 'output')

     // creating a process to run the exec
     const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    //  this is display the logs generated upon running the process
     p.stdout.on('data', (data) => {
        console.log(data.toString())
        publishLogs(data.toString())
     })

     p.stdout.on('error', (error) => {
        console.log('Error: ', error.toString())
        publishLogs(`Error: ${error.toString()}`)
     })

     p.on('close', async () => {
        console.log("Build complete!")
        publishLogs("Build Complete...")
        const distFolderPath = path.join(__dirname, "output", "dist")
        // recursive-> true will let us read the contents inside the folders as well
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

        publishLogs("Starting to upload...")
        for( const file of distFolderContents ) {
            const filePath = path.join(distFolderPath,file)
            // here we will check if the content of the dist folder is not a folder as S3 mai we only give the file path and not the folder
            if(fs.lstatSync(filePath).isDirectory()) {
                continue;
            }

            console.log("Uploading: ", filePath)
            // now we have to store the file in the S3 bucket
            const command = new PutObjectCommand({
                Bucket: 'deployerzz',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                // this determines the file type like .html, .css, etc
                // we will evaluate this dynamically
                ContentType: mime.lookup(filePath)
            })

            // this will initiate the object uploading process on s3 buckets
            await s3Client.send(command)
            publishLogs(`uploaded ${file}`)

            console.log("Uploaded: ", filePath)
        }
        console.log("Done...")
        publishLogs("Done....")
     })
}

init()
const express = require("express")
const httpProxy = require("http-proxy")

const app = express()

const PORT = 8000
const BASE_PATH = 'https://deployerzz.s3.us-east-2.amazonaws.com/__outputs'

const proxy = httpProxy.createProxy()


// suppose the request is p3.localhost:8000/index.html
// hostname = p3.localhost
// subdomain = p3
app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    const resolvesTo = `${BASE_PATH}/${subdomain}`

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true })

})

// The proxyReq event listener ensures that the proxy request path is correctly modified before sending it to the target server.
// In this case, if the request URL is '/' (root path), it appends 'index.html' to the request path.
proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})

app.listen(PORT, () => {
    console.log(`Reverse proxy running at port: ${PORT}`)
})



// cliff notes:

// -> A reverse proxy is a type of proxy server that sits between clients and one or more origin servers. 
// -> a reverse proxy handles requests from clients and forwards them to the appropriate backend servers. It then takes the responses from those servers and sends them back to the clients.
// -> It can act as a load balancer.
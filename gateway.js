const express = require('express')
const axios = require('axios');
const crypto = require('crypto');

const app = express()
const port = 3000

async function handleVersionOne(req, res, requestId, webhookMessage, webhookTarget, version) {
    console.log(`[${requestId}] Version is ${version}`)
    const discordRequest = {
        content: webhookMessage,
    };
    return await axios.post(`https://discordapp.com/api/webhooks/${webhookTarget}`, discordRequest)
        .then(response => {
            res.status(200);
            res.contentType("application/json");
            console.log(`[${requestId}] Proxy done.`);
            res.send(JSON.stringify({"result": 'ok'}));
        }).catch(error => {
            console.log(`[${requestId}] Error: ${error.message}`)
            res.status(200);
            res.send(JSON.stringify(error));
        })
}

async function handleProxyRequest(req, res) {
    const requestId = crypto.randomUUID();
    try {
        console.log(`[${requestId}] Receiving proxy request from ${req.socket.remoteAddress}`)
        const webhookTarget = req.query.webhook;
        const webhookMessage = req.query.message;
        const version = req.query.twVersion;
        if (!webhookTarget) {
            console.log(`[${requestId}] Query parameter "webhook" not provided.`)
            res.status(400)
            res.contentType("application/json")
            res.send(JSON.stringify({error: 'Query parameter "webhook" not provided.'}));
            return;
        }
        if (!webhookMessage) {
            console.log(`[${requestId}] Query parameter "message" not provided.`)
            res.status(400)
            res.contentType("application/json")
            res.send(JSON.stringify({error: 'Query parameter "message" not provided.'}));
            return;
        }
        return handleVersionOne(req, res, requestId, webhookMessage, webhookTarget, version);
    } catch (e) {
        console.error('Failed to proxy request', e);
    }

}

app.get('/proxy-request', async (req, res) => {
    return handleProxyRequest(req, res)
})

app.listen(port, () => {
    console.log(`Discord Gateway started on port ${port}`)
})

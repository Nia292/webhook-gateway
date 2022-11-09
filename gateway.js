const express = require('express')
const axios = require('axios');
const crypto = require('crypto');

const app = express()
const port = 3000

app.get('/proxy-request', async (req, res) => {
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] Receiving proxy request from ${req.hostname}`)
    const webhookTarget = req.query.webhook;
    const webhookMessage = req.query.message;
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
    console.log(`[${requestId}] Message is ${webhookMessage}`)
    const discordRequest = {
        content: webhookMessage,
    };
    await axios.post(`https://discordapp.com/api/webhooks/${webhookTarget}`, discordRequest)
        .then(response => {
            console.log(response.data.url);
            console.log(response.data.explanation);
        })
        .catch(error => {
            throw error;
        });
    res.status(200);
    res.contentType("application/json")
    console.log(`[${requestId}] Proxy done.`)
    res.send(JSON.stringify({"result": 'ok'}));
    return true;
})

app.listen(port, () => {
    console.log(`Discord Gateway started on port ${port}`)
})

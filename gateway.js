const express = require('express')
const axios = require('axios');
const crypto = require('crypto');

const app = express()
const port = 3000

const MONITORED_RPR_CHANNELS = (process.env.RPR_CHANNELS || '')
    .split(",")
    .map(v => v.trim());

function returnMandatoryParamMissing(res, paramName, requestId) {
    console.log(`[${requestId}] Query parameter "${paramName}" not provided.`)
    res.status(400)
    res.contentType("application/json")
    res.send(JSON.stringify({error: `Query parameter "${paramName}" not provided.`}));
}

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

async function handleRPRRequest(req, res) {
    const requestId = crypto.randomUUID();
    try {
        console.log(`[${requestId}] Receiving proxy request from ${req.socket.remoteAddress}`)
        const webhookId = req.params.webhookId;
        const webhookToken = req.params.webhookToken;
        if (!webhookId) {
            returnMandatoryParamMissing(res, 'webhookid', requestId);
        }
        if (!webhookToken) {
            returnMandatoryParamMissing(res, 'webhooktoken', requestId);
        }
        const webhookTarget = `${webhookId}/${webhookToken}`;
        const message = req.query.message;
        const channel = req.query.channel;
        // Don't want to log every channel for privacy reasons.
        if (!MONITORED_RPR_CHANNELS.includes(channel)) {
            console.log(`[${requestId}] Skipping message in RPR channel ${channel}`)
            return
        }
        const character = req.query.character;
        if (!message) {
            returnMandatoryParamMissing(res, 'message', requestId);
        }
        const discordMsg = `[${channel}][${character}] ${message}`;
        if (process.env.LOG_CHANNEL) {
            console.log(`[${requestId}] Receiving to RPR channel ${channel}`)
        }
        return handleVersionOne(req, res, requestId, discordMsg, webhookTarget, 'RPR-1')
    } catch (e) {
        console.error(`[${requestId}]`, e);
    }
}

app.get('/proxy-request', async (req, res) => {
    return handleProxyRequest(req, res)
})

if (process.env.RPR_ENABLED) {
    app.get('/rpr-proxy/:webhookId/:webhookToken', async (req, res) => {
        return handleRPRRequest(req, res);
    })
}

app.listen(port, () => {
    console.log(`Discord Gateway started on port ${port}`)
})

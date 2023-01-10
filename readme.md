# Webhook Gateway
A simple gateway that can transform requests sent by the Thrall Wars Utilities mod from
a HTTP GET request into a HTTP POST request for discord.

You can find more info [here in our wiki](https://conanexilestwmod.fandom.com/wiki/TWU_Webhooks).

## Running the Gateway - Docker
Docker is the simplest way to run the gateway. By default, it comes without HTTPs, but Let's Encrypt can easily be added via
the certbot nginx image. 

To run it, you will have to have [Docker](https://www.docker.com/) installed in your server.

Follow these steps:
1. ``git clone https://github.com/Nia292/webhook-gateway.git``
2. ``cd webhook-gatway``
3. ``docker compose -f docker-compose.deploy.yaml up -d``

And the gateway is now running on port 3000!

## Running the Gateway - NodeJS
If you do not want to bother installing Docker, you can just install [NodeJs](https://nodejs.dev/). Grab the latest LTS release,
install it, and then follow these steps:
1. ``git clone https://github.com/Nia292/webhook-gateway.git``
2. ``cd webhook-gatway``
3. ``node gateway.js``

And your gateway will be running on port 3000.

## Enabling RPR
You can also use this gateway for RPR Webhooks. It will forward RPR messages to discord with the following pattern as
a message:
``[<channel>][<character>] <written message>``
For privacy reasons, not all channels are actively pushed. Instead, you have to manually specify which channel needs to be pushed.

### Starting the Gateway - Docker
A docker compose file is provided again: 
1. ``git clone https://github.com/Nia292/webhook-gateway.git``
2. ``cd webhook-gatway``
3. ``docker compose -f docker-compose.deploy-rpr.yaml up -d``

And the gateway starts with only the global chat forwarded, active on port 3000

### Starting the Gateway - Native NodeJS
If you do not want to bother installing Docker, you can just install [NodeJs](https://nodejs.dev/). Grab the latest LTS release,
install it, and then follow these steps:
1. ``git clone https://github.com/Nia292/webhook-gateway.git``
2. ``cd webhook-gatway``
3. ``MONITORED_RPR_CHANNELS='1' RPR_ENABLED='true' node gateway.js``
And the gateway starts, active on port 3000.

### Configuring RPR
Now that your gateway is running, you will need to configure RPR.

1. Create a webhook for the channel you want the webhook to go to: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
2. You should have a webhook URL like this:
    * https://discord.com/api/webhooks/106XXXXXXXXXXXXX/NzwXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
3. Now build your URL for RPR with the following pattern: ``http://<server-ip>:3000/rpr-proxy/<everything after /webhooks/>``

With that URL, you can now go into your RPR settings, under webhooks, and paste the webhook URL there. Activate the webhook feature
and you are good to go.


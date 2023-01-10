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
3. ``docker-compose -f docker-compose.deploy.yaml up -d``

And the gateway is now running on port 8080!

## Running the Gateway - NodeJS
If you do not want to bother installing Docker, you can just install [NodeJs](https://nodejs.dev/). Grab the latest LTS release,
install it, and then follow these steps:
1. ``git clone https://github.com/Nia292/webhook-gateway.git``
2. ``cd webhook-gatway``
3. ``node gateway.js``

And your gateway will be running on port 3000.

## Enabling RPR
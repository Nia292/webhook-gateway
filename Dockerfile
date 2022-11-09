FROM node:18-alpine
COPY package.json /webhook-gw/package.json
COPY gateway.js /webhook-gw/gateway.js
RUN cd /webhook-gw && npm install
EXPOSE 3000/tcp
ENTRYPOINT node /webhook-gw/gateway.js

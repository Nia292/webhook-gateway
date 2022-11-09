FROM 19-alpine3.15
COPY package.json /webhook-gw/package.json
COPY gateway.js /webhook-gw/gateway.js
RUN npm install
EXPOSE 3000/tcp
ENTRYPOINT node /webhook-gw/gateway.js

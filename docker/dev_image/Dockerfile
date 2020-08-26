FROM node:14.8-alpine
ENV NODE_VERSION 14.8.0
WORKDIR /app

COPY app/ ./

# Expose API port to the outside
EXPOSE 2000

RUN npm install

#RUN npm i dotenv


CMD [ "npm", "run", "start-dev" ]
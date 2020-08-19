FROM node:latest
ENV NODE_VERSION 14.8.0
WORKDIR /home/chrx/upsmarting/MailTool/app/app.js

COPY app/ ./

# Expose API port to the outside
EXPOSE 2000

RUN npm install


CMD [ "npm", "run", "start-dev" ]
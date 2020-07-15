FROM node:current

WORKDIR /app

RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y postgresql-client
ADD package.json /app
RUN npm install


ADD . /app

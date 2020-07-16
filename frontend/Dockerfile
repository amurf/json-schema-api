FROM node:current

WORKDIR /app

ADD package.json /app
RUN npm install

ADD babel.config.js /app
ADD tsconfig.json /app
ADD src /app

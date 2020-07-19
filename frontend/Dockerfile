FROM node:current

WORKDIR /app

ADD package.json /app
RUN npm install

ADD babel.config.js /app
ADD postcss.config.js /app
ADD tsconfig.json /app
ADD vue.config.js /app

ADD public /app/public
ADD src /app/src

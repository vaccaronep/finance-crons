FROM node:15-alpine as base

WORKDIR /var/app

COPY package.json ./

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install

COPY . .

FROM base as production

ENV NODE_PATH=./dist

CMD ["npm", "run", "build"]
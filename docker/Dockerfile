FROM node:18.13.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --silent
COPY . .
RUN yarn build

CMD ["yarn", "start"]

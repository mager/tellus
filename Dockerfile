FROM node:19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . ./

EXPOSE 3005

CMD ["ts-node", "index.ts"]

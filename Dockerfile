FROM node:19-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
CMD ["npm", "start"]

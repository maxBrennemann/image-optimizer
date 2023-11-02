FROM node:21

WORKDIR /api

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

EXPOSE 3000

CMD ["npm", "start"]

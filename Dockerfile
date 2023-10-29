FROM node:slim

RUN apt-get update \
 && apt-get install

#WORKDIR /image-api
WORKDIR /usr/src/app
#COPY package.json /image-api/package.json
#COPY package-lock.json /image-api/package-lock.json
COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

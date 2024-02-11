FROM node:16.20.2-buster

WORKDIR /SignEZ/

COPY public/ /SignEZ/public
COPY src/ /SignEZ/src
COPY package.json /SignEZ/

RUN npm install

CMD ["npm", "start"]


FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

# Compile the SMUI theme
RUN npm run prepare

EXPOSE 3000

CMD [ "npm", "run", "start" ]
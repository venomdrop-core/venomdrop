FROM node:14-slim

WORKDIR /app

# Setup a path for using local npm packages
RUN mkdir -p /opt/node_modules

COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm i

COPY ./ /app

RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]

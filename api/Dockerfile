FROM node:14.17.3

EXPOSE 3000

RUN mkdir api
WORKDIR /api

# Environment
ENV NODE_ENV=development

# Dependencies
COPY ["package.json", "package-lock.json", "./"]
RUN npm install

COPY . .

CMD [ "node", "src/app.js" ]
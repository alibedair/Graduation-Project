FROM node:18 


WORKDIR /usr/local/app


COPY package.json package-lock.json ./


RUN npm install 


COPY . .

RUN chmod -R 777 /usr/local/app

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
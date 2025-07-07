FROM node:18 


WORKDIR /usr/local/app


COPY package.json package-lock.json ./


RUN npm install 


COPY . .

RUN chmod -R 777 /usr/local/app

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
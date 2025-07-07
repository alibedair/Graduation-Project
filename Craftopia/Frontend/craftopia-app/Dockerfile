FROM node:20-alpine

WORKDIR /usr/local/app

COPY package.json package-lock.json ./

RUN npm ci --silent --no-audit --no-fund

COPY . .

RUN chmod -R 777 /usr/local/app

RUN NODE_OPTIONS='--max-old-space-size=2048' npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173", "-H", "0.0.0.0"]
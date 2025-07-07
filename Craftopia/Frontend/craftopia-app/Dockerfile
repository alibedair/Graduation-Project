FROM node:20-alpine

WORKDIR /usr/local/app

COPY package.json package-lock.json ./

RUN npm ci --silent --no-audit --no-fund

COPY . .

RUN chmod -R 777 /usr/local/app

EXPOSE 5173

# Build at runtime instead of build time
CMD ["sh", "-c", "NODE_OPTIONS='--max-old-space-size=2048' npm run build && npm run preview -- --host 0.0.0.0 --port 5173"]
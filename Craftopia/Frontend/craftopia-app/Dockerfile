FROM node:20-alpine AS builder

WORKDIR /usr/local/app


COPY package.json package-lock.json ./

RUN npm ci --silent --no-audit --no-fund

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /usr/local/app

COPY --from=builder /usr/local/app/dist ./dist
COPY --from=builder /usr/local/app/package.json ./

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173", "-H", "0.0.0.0"]
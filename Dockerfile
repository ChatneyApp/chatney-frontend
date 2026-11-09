FROM node:24.22.2-alpine3.24 AS build

ARG VITE_API_URL
ARG VITE_WEBSOCKET_URL
ARG VITE_ENV=production

WORKDIR /app

# Dependencies: only re-run when the manifest/lockfile changes
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Sources
COPY . .
RUN npm run build

FROM nginx:1.31-alpine3.24-slim

# Config changes rarely; put it before the frequently-changing assets
COPY ./configs/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

FROM node:18-alpine AS build

WORKDIR /app
COPY . .

RUN npm ci && npm run build
RUN ls -l /app/dist

FROM nginx:stable-alpine3.20

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./configs/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# You are free to change the contents of this file
FROM node:lts-alpine AS builder

# We do not copy current directory for perfs, but we expect it to mounted
#COPY . .

# WIP
RUN set -ex; \
    apk add --no-cache \
        g++ \
        gcc \
        make \
    ; \
    npm install -g @angular/cli@8; \
    npm install -g nativescript@6; \
    npm run ngxp-install; \
    npm run build.prod

# You are free to change the contents of this file
FROM nginx:alpine

# NGINX configurations
COPY ./nginx/conf.d /etc/nginx/conf.d

# Copy built app from builder to www root
COPY --from=builder dist/app /usr/share/nginx/html

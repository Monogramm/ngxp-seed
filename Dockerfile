#FROM node:lts-alpine AS builder
#
## We do not copy current directory for perfs, but we expect it to mounted
##COPY . .
#
## Install dependencies
#RUN set -ex; \
#    apk add --no-cache \
#        g++ \
#        gcc \
#        make \
#    ; \
#    npm install -g @angular/cli@8; \
#    npm install -g nativescript@6

# Custom builder image
FROM monogramm/docker-ngxp:jdk AS builder

WORKDIR /usr/src/app

COPY . .

# Install NGXP project dependencies
# Build web site
RUN set -ex; \
    node --version; \
    npm --version; \
    npm run ngxp-install; \
    npm run build.prod; \
    ls -al dist

FROM nginx:alpine

# NGINX configurations
COPY ./nginx/conf.d /etc/nginx/conf.d

# Copy built app from builder to www root
COPY --from=builder /usr/src/app/dist/app /usr/share/nginx/html

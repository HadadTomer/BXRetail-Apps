# build environment
# FROM node:14.15.4-alpine as build
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm ci
# COPY . ./
# RUN npm run build .env

# Copy .env file and shell script to container
# WORKDIR /usr/share/nginx/html/app
# COPY ./env.sh .
# COPY ./.env .

# Make our shell script executable
# RUN chmod +x env.sh


# Add bash - not included with Alpine-based images
# RUN apk add --no-cache bash

# CMD ["/bin/bash", "-c", "/usr/share/nginx/html/app/env.sh"]

# git add, commit, push
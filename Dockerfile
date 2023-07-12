# FROM node:12

# WORKDIR /app

# ENV PATH /app/node_modules/.bin:$PATH

# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install --silent
# RUN npm install react-scripts@3.4.1 -g --silent

# COPY . ./

# # CMD ["npm", "start"]

# RUN npm run build

FROM alpine:3.12

ADD config/default.conf /etc/nginx/conf.d/default.conf

COPY . /var/www/localhost/htdocs

COPY package.json /var/www/localhost/htdocs
COPY package-lock.json /var/www/localhost/htdocs

RUN apk add nginx && \
    mkdir /run/nginx && \
    apk add nodejs && \
    apk add npm && \
    cd /var/www/localhost/htdocs && \
    rm -rf node_modules && \
    npm install && \
    npm run build:prod;
#npm run build:prod for production

CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]

WORKDIR /var/www/localhost/htdocs
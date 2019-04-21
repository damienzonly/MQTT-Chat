FROM node:alpine as builder
WORKDIR /build

COPY src src
COPY public public
COPY package.json .
COPY .env.production .

RUN yarn
RUN yarn build


FROM nginx:alpine
WORKDIR /
COPY --from=builder /build /etc/nginx/html

EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]
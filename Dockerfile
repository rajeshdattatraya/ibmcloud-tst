FROM node:14.15.4-alpine3.12 as build-step
WORKDIR /app
COPY package.json ./
RUN npm cache clean --force
RUN npm install
COPY . .
RUN npm run build


FROM nginx:1.18.0-alpine as prod-stage
COPY --from=build-step /app/dist/TATClientApp /usr/share/nginx/html


ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD [ "nginx", "-g", "daemon off;" ]
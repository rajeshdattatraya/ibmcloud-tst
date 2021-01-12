FROM node:8

ADD views /app/views
ADD angular.json /app
ADD package.json /app


RUN cd /app; npm install

ENV NODE_ENV production
ENV PORT 4200
EXPOSE 4200

WORKDIR "/app"
CMD [ "npm", "start" ]

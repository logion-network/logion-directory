# Build directory
FROM node:14 AS build-directory
WORKDIR /tmp/logion-directory
COPY . .
RUN yarn install
RUN yarn build

# Directory image
FROM node:14

WORKDIR /usr/share/logion-directory
COPY --from=build-directory /tmp/logion-directory/dist dist
COPY --from=build-directory /tmp/logion-directory/node_modules node_modules
COPY --from=build-directory /tmp/logion-directory/resources resources

ENV NODE_ENV=production
ENV WS_PROVIDER_URL=ws://localhost:9944
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV JWT_SECRET=Y2hhbmdlLW1lLXBsZWFzZQ==
ENV JWT_ISSUER=localhost
ENV JWT_TTL_SEC=3600
ENV PORT=8080
ENV TYPEORM_CONNECTION=postgres
ENV TYPEORM_HOST=localhost
ENV TYPEORM_USERNAME=postgres
ENV TYPEORM_PASSWORD=secret
ENV TYPEORM_DATABASE=postgres
ENV TYPEORM_PORT=5432
ENV TYPEORM_SYNCHRONIZE=false
ENV TYPEORM_ENTITIES=dist/model/*.model.js
ENV TYPEORM_MIGRATIONS=dist/migration/*.js

COPY ./docker /usr/docker
RUN chmod +x /usr/docker/*

ENTRYPOINT ["/usr/docker/docker-entrypoint.sh"]

CMD node ./node_modules/typeorm/cli.js migration:run && node ./dist/app.js
EXPOSE ${PORT}

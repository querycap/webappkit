
FROM --platform=${BUILDPLATFORM} docker.io/library/node:16-buster as build-env

FROM --platform=${BUILDPLATFORM} build-env AS builder

WORKDIR /src
COPY ./ ./

ARG APP
ARG ENV

ARG PROJECT_GROUP
ARG PROJECT_NAME
ARG PROJECT_VERSION

ARG YARN_NPM_REGISTRY_SERVER
ARG YARN_HTTPS_PROXY


RUN npm install -g --registry=${YARN_NPM_REGISTRY_SERVER} pnpm
RUN pnpm --registry=${YARN_NPM_REGISTRY_SERVER} install


RUN PROJECT_GROUP=${PROJECT_GROUP} PROJECT_VERSION=${PROJECT_VERSION} \
    npx devkit build --prod ${APP} ${ENV}

FROM docker.io/querycap/webappserve:0.2.1

ARG PROJECT_NAME
COPY --from=builder /src/public/${PROJECT_NAME} /app

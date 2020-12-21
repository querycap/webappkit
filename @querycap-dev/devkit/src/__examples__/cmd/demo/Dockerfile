
ARG DOCKER_REGISTRY
FROM --platform=${BUILDPLATFORM} ${DOCKER_REGISTRY}/docker.io/library/node:15-buster as build-env

FROM --platform=${BUILDPLATFORM} build-env AS builder

WORKDIR /src
COPY ./ ./

ARG YARN_NPM_REGISTRY_SERVER
ARG YARN_HTTPS_PROXY
ENV YARN_CACHE_FOLDER=/tmp/yarn-cache
RUN yarn

ARG APP
ARG ENV
ARG PROJECT_GROUP
ARG PROJECT_VERSION
RUN PROJECT_GROUP=${PROJECT_GROUP} PROJECT_VERSION=${PROJECT_VERSION} yarn devkit build --prod ${APP} ${ENV}

FROM ${DOCKER_REGISTRY}/docker.io/querycap/webappserve:0.0.0

ARG PROJECT_NAME
COPY --from=builder /src/public/${PROJECT_NAME} /app

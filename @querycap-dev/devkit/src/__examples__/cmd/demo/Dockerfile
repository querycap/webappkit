# syntax = hub-dev.rockontrol.com/docker.io/docker/dockerfile:experimental

ARG DOCKER_REGISTRY=hub-dev.rockontrol.com
FROM --platform=${BUILDPLATFORM} ${DOCKER_REGISTRY}/docker.io/library/node:15-buster as build-env

FROM --platform=${BUILDPLATFORM} build-env AS builder

WORKDIR /src
COPY ./ ./

ENV YARN_CACHE_FOLDER=/tmp/yarn-cache
RUN --mount=type=cache,sharing=locked,id=yarncache,target=/tmp/yarn-cache yarn

ARG APP
ARG ENV
ARG PROJECT_GROUP
ARG PROJECT_VERSION
RUN PROJECT_GROUP=${PROJECT_GROUP} PROJECT_VERSION=${PROJECT_VERSION} yarn devkit build --prod ${APP} ${ENV}

FROM ${DOCKER_REGISTRY}/docker.io/querycap/webappserve:0.0.0

ARG PROJECT_NAME
COPY --from=builder /src/public/${PROJECT_NAME} /app

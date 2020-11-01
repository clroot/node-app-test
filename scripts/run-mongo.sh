#!/bin/bash
DOCKER_APP_NAME=node-app-test-mongo
EXIST_DOCKER_APP=$(docker ps -a | grep ${DOCKER_APP_NAME})

if [ "$EXIST_DOCKER_APP" ]; then
  echo 'stop mongo...'
  docker rm -f ${DOCKER_APP_NAME}
fi

echo 'run mongo...'
docker run -d --name ${DOCKER_APP_NAME} \
  -p 127.0.0.1:27017:27017 \
  mongo
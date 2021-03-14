#!/bin/bash
app="python"
docker image build -t ${app} .
docker run -p 5000:5000 ${app}
# docker build -t ${app} .
# docker run -d -p 5000:5000 \
#   --name=${app} \
#   -v $PWD:/app ${app}

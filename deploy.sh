#!/bin/bash
docker build -t ml-service .
docker run -d -p 5000:5000 --env-file=.env ml-service
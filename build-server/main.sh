#!/bin/bash

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

# when the container will run it will clone the repo at this path
git clone "$GIT_REPOSITORY_URL" /home/app/output

# this node file will build the code inside the container after cloaning is done 
exec node script.js
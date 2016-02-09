#!/bin/bash

# Building right now just means copying the source files
mkdir --path ./build
echo "copying src files into build"
cp -r ./src/* ./build

echo "copying build files into maratsubkhankulov.github.io"
cp -r ./build/* ./maratsubkhankulov.github.io

echo "adding all to repo and committing"
cd maratsubkhankulov.github.io
git add *

echo "pushing to remote"
git push remote master

#!/bin/bash
#Author: Björn Ingemar Elfström

#Export NODE_PATH as root directory.
export NODE_PATH=.

#Clean and Build project.
npm run clean
npm run createbuild
npm run buildclient

#Move Built project into build folder
mv client/build build/static
cp -R server build/server
mkdir -p build/client/src
cp -r client/src/common build/client/src
cp run.js build

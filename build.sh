#!/bin/bash
#
# Script which builds the project and copies necessary scripts into the build folder.
#
#Author: Björn Ingemar Elfström

#Export NODE_PATH as current directory.
export NODE_PATH=.

#Clean, Create and Build project.
npm run clean
npm run createbuild
npm run buildclient

#Move Built client files into build folder
mv client/build build/static

#Copy Built server files into build folder.
cp -R server build/server
mkdir -p build/client/src
cp -r client/src/common build/client/src

#Copy run script into build folder.
cp run.js build

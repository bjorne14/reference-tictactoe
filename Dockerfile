#Use node image for simplicity
FROM node

#Set NODE_PATH
ENV NODE_PATH=.

#Create WORKDIR and copy over build and package.json for installing the server.
WORKDIR /app
COPY ./build/ .
COPY ./package.json /app/package.json

#Expose port 80
EXPOSE 80

#Install server
RUN npm install

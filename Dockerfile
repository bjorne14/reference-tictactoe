#Use node image for simplicity
FROM node

#Set NODE_PATH
ENV NODE_PATH=.

#Create WORKDIR and copy over build and package.json for installing the server.
WORKDIR /app
COPY ./build/ .
COPY ./run .
COPY ./package.json /app/package.json

#Expose port 8080
EXPOSE 8080

#Install server
RUN npm install
CMD ["./run"]

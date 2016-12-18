module.exports=function(injected){

    const io = injected('io');
    const incomingSocketMessageDispatcher = injected('incomingSocketMessageDispatcher');
    const OutgoingSocketIoMessagePort = injected('OutgoingSocketIoMessagePort');
    const queryRouter = injected('queryRouter');

    var clientId = 0;
    var numClients=0;

    var connected={
    };

    function trackClient(clientId, socket) {

        var newUserSession = {clientId, userName: "Newbie#" + clientId};
        io.emit('userJoined', newUserSession);
        socket.emit('userAcknowledged', newUserSession); //
        numClients++;
        emitStats();

        var dispatcher = incomingSocketMessageDispatcher.startDispatching(socket, newUserSession);

        connected[clientId] = newUserSession;
        socket.emit('usersConnected', connected);

        socket.on('disconnect', ()=>{
            io.emit('userLeft', {clientId, message : "User left the party"});
            numClients--;
            emitStats();
            dispatcher.stopDispatching(socket);
            delete connected[clientId];
        });

        socket.on('changeUserName', function(userNameChange){
            connected[clientId].userName=userNameChange.userName;
            io.emit('userChanged', connected[clientId])
        });

        const queryResultPort = OutgoingSocketIoMessagePort
        (inject({
            io:socket,
            messageRouter:queryRouter
        }));

        const dispatchOnlyToOriginFilter = function(message){
            return message.requestCommand._session.clientId===clientId;
        };

        queryResultPort.dispatchThroughIo('*', 'queryResult', dispatchOnlyToOriginFilter);
    }


    function emitStats() {
        io.emit('stats', {numClients: numClients});
        console.log("Connected clients: " + numClients);
    }

    io.on('connection', function(socket){
        trackClient(clientId++, socket);

    });

};

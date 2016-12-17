module.exports=function(injected){

    const io = require('socket.io-client');
    const RoutingContext = require('../../client/src/routing-context');
    const generateUUID = require('../../client/src/common/framework/uuid');

    var connectCount =0;

    function userAPI(){
        // object containing information about command for the game(we override the properties as we gather information)
        var game = { 
            commandId: "dummy value",        
            gameId: "dummy value",
            type: "dummy value",
            user: {userName: generateUUID()},
            name: "a cool game",
            timeStamp: "2030-03-02T13:37:00",
            side: "the darkside..",
            coordinates: "dummy"
        };
 
        
        // Queue of events of which we wait on
        var waitingFor=[];
        var commandId=0;

        var routingContext = RoutingContext(inject({
            io,
            env:"test"
        }));

        connectCount++;
        const me = {
            getGame:()=>{
                return game;
            },
            expectGameWon:()=>{
                waitingFor.push("expectGameWon");
                routingContext.eventRouter.on('GameWon', function(gameEvent){
                    expect(gameEvent.side).not.toBeUndefined();
                    if(game.gameId === gameEvent.gameId){
                        waitingFor.pop();
                    }
                });
                return me;
            },            
            expectMoveMade:()=>{
                waitingFor.push("expectMovePlaced");
                routingContext.eventRouter.on("MovePlaced", function(gameEvent){
                    expect(gameEvent.side).not.toBeUndefined();                    

                    var t = waitingFor[waitingFor.length - 1 ];
                    /**
                     * GameWon/Draw will be sent with MovePlaced, so if we receive an MovePlaced we set the queue
                     * to GameWon/Draw
                     * */
                    if(t === "expectGameWon" || t === "expectGameDraw"){
                        waitingFor = [];
                        waitingFor.push(t);
                    }                    
                    else if(game.gameId === gameEvent.gameId){
                        waitingFor.pop();
                    }
                });
                return me;
            },
            placeMove:(x, y)=>{
                game.type = "PlaceMove";
                game.commandId = generateUUID();
                game.coordinates = {"x": x, "y": y};
                routingContext.commandRouter.routeMessage(game);
                return me;
            },
            expectGameJoined:()=>{
                waitingFor.push("expectGameJoined");
                routingContext.eventRouter.on("GameJoined", function(gameEvent){                  
                    if(game.gameId === gameEvent.gameId){
                        expect(gameEvent.side).toBe('O');
                        game.side = "O";
                        waitingFor.pop();
                    }
                });
                return me;
            },
            joinGame:(gameId)=>{
                game.gameId = gameId;
                game.commandId = generateUUID();
                game.type = "JoinGame";
                routingContext.commandRouter.routeMessage(game);
                return me;
            },
            expectGameCreated:()=>{
                waitingFor.push("expectGameCreated");
                routingContext.eventRouter.on('GameCreated', function(gameEvent){
                    if(gameEvent.gameId === game.gameId){
                        expect(gameEvent.side).toBe('X');
                        game.side = "X";
                        waitingFor.pop();
                    }
                });
                return me;
            },
            createGame:()=>{
                game.gameId = generateUUID();
                game.commandId = generateUUID();
                game.type = "CreateGame";
                routingContext.commandRouter.routeMessage(game);
                return me;
            },
            expectUserAck:(cb)=>{
                waitingFor.push("expectUserAck");
                routingContext.socket.on('userAcknowledged', function(ackMessage){
                    expect(ackMessage.clientId).not.toBeUndefined();
                    waitingFor.pop();
                });
                return me;
            },
            sendChatMessage:(message)=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"chatCommand", message });
                return me;
            },
            expectChatMessageReceived:(message)=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('chatMessageReceived', function(chatMessage){
                    expect(chatMessage.sender).not.toBeUndefined();
                    if(chatMessage.message===message){
                        waitingFor.pop();
                    }
                });
                return me;
            },
            cleanDatabase:()=>{
                var cmdId = commandId++;
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"cleanDatabase"});
                return me;

            },
            waitForCleanDatabase:()=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('databaseCleaned', function(chatMessage){
                    waitingFor.pop();
                });
                return me;

            },
            then:(whenDoneWaiting)=>{
                function waitLonger(){
                    if(waitingFor.length>0){
                        setTimeout(waitLonger, 0);
                        return;
                    }
                    whenDoneWaiting();
                }
                waitLonger();
                return me;
            },
            disconnect:function(){
                routingContext.socket.disconnect();
            }

        };
        return me;

    }

    return userAPI;
};

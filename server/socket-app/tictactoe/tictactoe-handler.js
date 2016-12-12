
module.exports = function(injected){
    var TictactoeState = injected('TictactoeState');

    return function(history){

        var gameState = TictactoeState(history);
        return {
            executeCommand: function(cmd, eventHandler){

                var cmdHandlers = {
                    "CreateGame": function (cmd) {
                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameCreated",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'X'
                        }]);

                    },
                    "JoinGame": function (cmd) {
                        if(gameState.gameFull()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "FullGameJoinAttempted",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            }]);
                            return;
                        }

                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameJoined",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'O'
                        }]);
                    },
                    "PlaceMove": function(cmd){                      
                        // Check here for conditions which prevent command from altering state
                        if(gameState.notYourTurn(cmd.side)){
                            eventHandler([{
                                gameId: cmd.gameId,
                                type: "NotYourTurn",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                coordinates: cmd.coordinates
                            }]);
                            return;                           
                        }
                        if(gameState.isOutOfBounds(cmd.coordinates) || gameState.isCellOccupied(cmd.coordinates)){
                            eventHandler([{
                                gameId: cmd.gameId,
                                type: "IllegalMove",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                coordinates: cmd.coordinates
                            }]);
                            return;                           
                        }
                        
                        var placeMent = {
                            gameId: cmd.gameId,
                            type: "MovePlaced",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side: cmd.side,
                            coordinates: cmd.coordinates
                        };
                        // Check here for conditions which may warrant additional events to be emitted (win/draw).
                        if(gameState.gameDraw(cmd.side, cmd.coordinates)){
                            eventHandler([ placeMent ,{
                                gameId: cmd.gameId,
                                type: "GameDraw",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side
                            }]);                  
                            return;
                        }

                        if(gameState.gameWon(cmd.side, cmd.coordinates)){
                            eventHandler([ placeMent ,{
                                gameId: cmd.gameId,
                                type: "GameWon",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side
                            }]);                  
                            return;
                        }


                        //Else we just do MovePlaced
                        eventHandler([ placeMent ]);
                    
                    }
                }
                if(!cmdHandlers[cmd.type]){
                    throw new Error("I do not handle command of type " + cmd.type)
                }
                cmdHandlers[cmd.type](cmd);
            }
        }
    }
};

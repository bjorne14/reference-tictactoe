import React from 'react';
import _ from 'lodash';

export default function (injected) {
    const TictactoeBoard = injected('TictactoeBoard');

    const commandPort =injected('commandPort');
    const eventRouter =injected('eventRouter');
    const queryRouter =injected('queryRouter');

    const generateUUID = injected('generateUUID');

    const socket = injected('socket');

    class TictactoeGame extends React.Component {
        constructor() {
            super();
            this.state = {
                currentGame:{

                },
                openGames:{},
                lastMoveStatusMsg:"",
                lastMoveClasses:""
            }
        }
        //noinspection JSUnusedGlobalSymbols
        componentWillMount(){

            socket.on('userAcknowledged', (userSession)=> {
                this.setState({session: userSession});
            });


            const gameJoined = (gameJoined)=>{

                if(this.state.session.clientId === gameJoined.userSession.clientId){
                    this.setState({
                        gameOver:undefined,
                        currentGame:{
                            gameId:gameJoined.gameId,
                            side:gameJoined.side,
                            name:gameJoined.name,
                            myName:this.state.session.userName,
                        }
                    });
                    this.setState({hasTheTurn:'X'});
                }

                var openGames = this.state.openGames;
                delete openGames[gameJoined.gameId];
                this.setState({
                    openGames:openGames
                })
            };

            const notYourTurn = (placement)=>{
                if(this.state.currentGame.gameId === placement.gameId && placement.side === this.state.currentGame.side){
                    var statusMsg="It's not your turn";
                    this.setState({lastMoveClasses:"gameInfo notmyturn"});
                    this.setState({lastMoveStatusMsg:statusMsg});
                }

            };

            const movePlaced = (placement)=>{
                if(this.state.currentGame.gameId === placement.gameId){
                    var player;
                    if(placement.side === this.state.currentGame.side){
                        player = "You";
                    }
                    else{
                        player = "Your opponent";
                    }

                    var statusMsg=player + " occupied cell (" + placement.coordinates.x + "," + placement.coordinates.y + ")";

                    var nextTurn=this.state.hasTheTurn;
                    if(this.state.hasTheTurn === "X"){
                        nextTurn="O";
                    }
                    else{
                        nextTurn="X";
                    }

                    if(this.state.lastMoveClasses !== "gameInfo myturn"){                    
                        this.setState({lastMoveClasses:"gameInfo myturn"});
                    }

                    this.setState({lastMoveStatusMsg:statusMsg});
                    this.setState({hasTheTurn:nextTurn});
                }
            };

            const gameCreated = (gameCreated)=>{
                gameJoined(gameCreated);

                var openGames = this.state.openGames;
                if(this.state.session.clientId === gameCreated.userSession.clientId){
                    // Game that I created, join & play
                    this.setState({
                        gameOver:undefined,
                        currentGame:{
                            gameId:gameCreated.gameId,
                            side:gameCreated.side,
                            name:gameCreated.name,
                            myName:this.state.session.userName
                        }
                    });
                    this.setState({hasTheTurn:'X'});
                } else{
                    // Game that someone else created, add to open games.
                    openGames[gameCreated.gameId]=gameCreated;
                    this.setState({
                       openGames:openGames
                    });
                }
            };


            const gameOver = (gameOver)=>{
                if(this.state.currentGame.gameId===gameOver.gameId){
                    this.setState({
                        gameOver:gameOver,
                        currentGame:{

                        }
                    })
                }
            };

            eventRouter.on('NotYourTurn', notYourTurn); 
            eventRouter.on('MovePlaced', movePlaced); 
            eventRouter.on('GameJoined', gameJoined);
            eventRouter.on('GameCreated', gameCreated);
            eventRouter.on('GameWon', gameOver);
            eventRouter.on('GameDraw', gameOver);

            queryRouter.on('OpenGamesResult', (resultMessage)=>{
                _.each(resultMessage.resultSet, function(event){
                    if(event.type==='GameCreated'){
                        gameCreated(event);
                    }
                });
            });
            commandPort.routeMessage({
                commandId:generateUUID(),
                type:"RequestOpenGames"
            });
        }
        createGame(){
            var cmdId = generateUUID();
            commandPort.routeMessage({
                commandId:cmdId,
                type:"CreateGame",
                gameId:generateUUID(),
                name:generateUUID()
            });
        }
        joinGame(game){
            return ()=>{
                var cmdId = generateUUID();
                commandPort.routeMessage({
                    commandId:cmdId,
                    type:"JoinGame",
                    gameId:game.gameId
                });
            }
        }
        render() {
            var openGames = _.map(this.state.openGames, (openGame, idx)=>{
                return <div key={idx}>
                    <span>{openGame.userSession.userName}</span> <button type="button" role="button" onClick={this.joinGame(openGame)}> Join</button>
                </div>
            });
            var playerInformation="";
            var hasTurnInformation="";
            var lastMoveStatus="";

            var gameOver=undefined;

            var gameView = <div>
                <button type="button" role="button" onClick={this.createGame}>Create new game</button>
                <h2>Open games:</h2>
                {openGames}
            </div>;

            if(this.state.gameOver){
                var gameEnd;
                if(this.state.gameOver.type==='GameWon'){
                    gameEnd = <span>{this.state.gameOver.side} won the game!</span>
                } else {
                    gameEnd = <span>Draw!</span>
                }
                gameOver = <div>Game over: {gameEnd} </div>
            }
            if(this.state.currentGame.gameId){
                playerInformation=<div className="gameInfo">You are playing as {this.state.currentGame.side}</div>
                hasTurnInformation=<div className="gameInfo">It is player {this.state.hasTheTurn} turn to make a move</div>
                lastMoveStatus=<div className={this.state.lastMoveClasses}>{this.state.lastMoveStatusMsg}</div>

                gameView = <TictactoeBoard gameId={this.state.currentGame.gameId} mySide={this.state.currentGame.side} name={this.state.currentGame.name} myName={this.state.currentGame.myName}></TictactoeBoard>
            }
            return (<div className="TictactoeGame">
                {gameOver}
                {gameView}
                {playerInformation}
                {hasTurnInformation}
                {lastMoveStatus}
           </div>);
        }
    }

    return TictactoeGame;
}

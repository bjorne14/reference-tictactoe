/* Events for testing.
 * PlayerA will allways create the game.
 * Every action will be performed at the same timestamp, the game will allways be PlayerA's epic tictactoe party.
 */
const GAME_ID = "1337";
const TIME_STAMP = "2030-03-02T13:37:00";
const GAME_NAME = "PlayerA's epic tictactoe party";

function CreateGame() {
    return {
        gameId: GAME_ID,
        type: "CreateGame",
        name: GAME_NAME,
        timeStamp: TIME_STAMP,
    };
}


function GameCreated() {
    return {
        gameId: GAME_ID,
        type: "GameCreated",
        name: GAME_NAME,
        timeStamp: TIME_STAMP,
        side: 'X'
    };
}

function JoinGame(_username) {
    return {
        gameId: GAME_ID,
        type: "JoinGame",
        user: { userName: _username },
        name: GAME_NAME,
        timeStamp: TIME_STAMP        
    };
}

function GameJoined(_username) {
    return {
        gameId: GAME_ID,
        type: "GameJoined",
        user: { userName: _username },
        name: GAME_NAME,
        timeStamp: TIME_STAMP,
        side: 'O' 
    };
}

function PlaceMove(_username, _side, _coordinates){
    return {
        gameId: GAME_ID,
        type: "PlaceMove",
        user: { userName: _username },
        name: GAME_NAME,
        timeStamp: TIME_STAMP,
        side: _side,
        coordinates: _coordinates
    };
}

function MovePlaced(_username, _side, _coordinates) {
    return {
        gameId: "1337",
        type: "MovePlaced",
        user: { userName: _username },
        name: GAME_NAME,
        timeStamp: TIME_STAMP,
        side: _side,
        coordinates: _coordinates
    };
}
module.exports = {
    CreateGame: CreateGame,
    GameCreated: GameCreated,
    JoinGame: JoinGame,
    GameJoined: GameJoined,
    PlaceMove: PlaceMove,
    MovePlaced: MovePlaced
}

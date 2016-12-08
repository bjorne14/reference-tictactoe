var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

 /* Global testing data for the creation and joining of games since that will be used in multiple tests.
  * (for clarity they should be cased in the same manner as the actual commands with the exception of prefixes describing when)
  * 
  * PlayerA will allways create the game, PlayerB joins the game successfully.
  */
var CreateGame = {
    gameId: "1337",
    type: "CreateGame",
    name: "PlayerA's epic tictactoe party",
    timeStamp: "2030-03-02T13:37:00",
};

var GameCreated = {
    gameId: "1337",
    type: "GameCreated",
    name: "PlayerA's epic tictactoe party",
    timeStamp: "2030-03-02T13:37:00",
    side: 'X'
};

var JoinGame = {
    gameId: "1337",
    type: "JoinGame",
    user: { userName: "PlayerB" },
    name: "PlayerA's epic tictactoe party",
    timeStamp: "2030-03-02T13:37:00"        
};

var GameJoined = {
    gameId: "1337",
    type: "GameJoined",
    user: { userName: "PlayerB" },
    name: "PlayerA's epic tictactoe party",
    timeStamp: "2030-03-02T13:37:00",
    side: 'O' 
};

var InitPlaceMove = {
    gameId: "1337",
    type: "PlaceMove",
    user: { userName: "PlayerA" },
    name: "PlayerA's epic tictactoe party",
    timeStamp: "2031-03-02T13:37:04",
    side: "X",
    coordinates: { "x": 0, "y": 0 }
};

var InitMovePlaced = {
    gameId: "1337",
    type: "MovePlaced",
    user: { userName: "PlayerA" },
    name: "PlayerA's epic tictactoe party",
    timeStamp: "2031-03-02T13:37:04",
    side: "X",
    coordinates: { "x": 0, "y": 0 }
};

// Unit test for the creation of TicTacToe games
describe('create game command', function() {


    var given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){
        given = [];
        when = CreateGame;
        then = [ GameCreated ];
    })
});


// Unit test for joining a created TicTacToe game
describe('join game command', function () {


    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game joined event...', function () {
        given = [ CreateGame, GameCreated ];
        when = JoinGame;
        then = [ GameJoined ];
    });

    it('should emit FullGameJoinAttempted event when game full', function () {
        given = [ CreateGame, GameCreated, JoinGame, GameJoined ];
        when = {
            gameId: "1337",
            type: "JoinGame",
            user: { userName: "PlayerC" },
            name: "PlayerA's epic tictactoe party",
            timeStamp: "2030-03-02T13:37:04"
        };
        then = [
            {
                gameId: "1337",
                type: "FullGameJoinAttempted",
                user: { userName: "PlayerC" },
                name: "PlayerA's epic tictactoe party",
                timeStamp: "2030-03-02T13:37:04"
            }
        ];

    });
});

describe('PlaceMove command tests', function() {
    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit MovePlaced...', function() {
        given = [ CreateGame, GameCreated, JoinGame, GameJoined ];     
        when = InitPlaceMove;   
        then = [ InitMovePlaced ];
    });



});



var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));
var TestEvents = require('./tictactoe-test-events');

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

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
        when = TestEvents.CreateGame();
        then = [ TestEvents.GameCreated() ];
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
        given = [ TestEvents.CreateGame(), TestEvents.GameCreated() ];
        when = TestEvents.JoinGame("PlayerB");
        then = [ TestEvents.GameJoined("PlayerB") ];
    });

    it('should emit FullGameJoinAttempted event when game full', function () {
        given = [ 
            TestEvents.CreateGame(), TestEvents.GameCreated(),    
            TestEvents.JoinGame("PlayerB"), TestEvents.GameJoined("PlayerB") 
        ];
        when = TestEvents.JoinGame("PlayerC");
        then = [
            {
                gameId: "1337",
                type: "FullGameJoinAttempted",
                user: { userName: "PlayerC" },
                name: "PlayerA's epic tictactoe party",
                timeStamp: "2030-03-02T13:37:00"
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
        given = [
            TestEvents.CreateGame(), TestEvents.GameCreated(),
            TestEvents.JoinGame("PlayerB"), TestEvents.GameJoined("PlayerB") 
        ];     
        when = TestEvents.PlaceMove("PlayerA", "X", {"x": 0, "y": 0});
        then = [ TestEvents.MovePlaced("PlayerA", "X", {"x": 0, "y": 0}) ];
    });


    it('should emit IllegalMove (cell already occupied)...', function() {
        given = [ 
            TestEvents.CreateGame(), TestEvents.GameCreated(),
            TestEvents.JoinGame("PlayerB"), TestEvents.GameJoined("PlayerB"),
            TestEvents.PlaceMove("PlayerA", "X", {"x": 0, "y": 0}), TestEvents.MovePlaced("PlayerA", "X", {"x": 0, "y":0}) ];
        when = TestEvents.PlaceMove("PlayerB", "O", {"x": 0, "y": 0});
        then = [{
            gameId: "1337",
            type: "IllegalMove",
            user: { userName: "PlayerB" },
            name: "PlayerA's epic tictactoe party",
            timeStamp: "2030-03-02T13:37:00",
            side: "O",
            coordinates: { "x": 0, "y": 0 } 
        }];
    });
    
    it('should emit NotYourTurn (Player tries to perform two occuputations in a row)...', function() {
        given = [ 
            TestEvents.CreateGame(), TestEvents.GameCreated(),
            TestEvents.JoinGame("PlayerB"), TestEvents.GameJoined("PlayerB"),
            TestEvents.PlaceMove("PlayerA", "X", {"x": 0, "y": 0}), TestEvents.MovePlaced("PlayerA", "X", {"x": 0, "y":0}) ];
        when = TestEvents.PlaceMove("PlayerA", "X", {"x": 1, "y": 1});
        then = [{
            gameId: "1337",
            type: "NotYourTurn",
            user: { userName: "PlayerA" },
            name: "PlayerA's epic tictactoe party",
            timeStamp: "2030-03-02T13:37:00",
            side: "X",
            coordinates: { "x": 1, "y": 1 } 
        }];
    });
  

});


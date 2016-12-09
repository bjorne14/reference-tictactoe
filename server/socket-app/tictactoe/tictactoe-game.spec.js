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
        when = TestEvents.createGame();
        then = [ TestEvents.gameCreated() ];
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
        given = [ TestEvents.createGame(), TestEvents.gameCreated() ];
        when = TestEvents.joinGame("PlayerB");
        then = [ TestEvents.gameJoined("PlayerB") ];
    });

    it('should emit FullGameJoinAttempted event when game full', function () {
        given = [ 
            TestEvents.createGame(), TestEvents.gameCreated(),    
            TestEvents.joinGame("PlayerB"), TestEvents.gameJoined("PlayerB") 
        ];
        when = TestEvents.joinGame("PlayerC");
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
            TestEvents.createGame(), TestEvents.gameCreated(),
            TestEvents.joinGame("PlayerB"), TestEvents.gameJoined("PlayerB") 
        ];     
        when = TestEvents.placeMove("PlayerA", "X", {"x": 0, "y": 0});
        then = [ TestEvents.movePlaced("PlayerA", "X", {"x": 0, "y": 0}) ];
    });


    it('should emit IllegalMove (cell already occupied)...', function() {
        given = [ 
            TestEvents.createGame(), TestEvents.gameCreated(),
            TestEvents.joinGame("PlayerB"), TestEvents.gameJoined("PlayerB"),
            TestEvents.placeMove("PlayerA", "X", {"x": 0, "y": 0}), TestEvents.movePlaced("PlayerA", "X", {"x": 0, "y":0}) ];
        when = TestEvents.placeMove("PlayerB", "O", {"x": 0, "y": 0});
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
            TestEvents.createGame(), TestEvents.gameCreated(),
            TestEvents.joinGame("PlayerB"), TestEvents.gameJoined("PlayerB"),
            TestEvents.placeMove("PlayerA", "X", {"x": 0, "y": 0}), TestEvents.movePlaced("PlayerA", "X", {"x": 0, "y":0}) ];
        when = TestEvents.placeMove("PlayerA", "X", {"x": 1, "y": 1});
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


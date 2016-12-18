const io = require('socket.io-client');
const RoutingContext = require('../client/src/routing-context');
var UserAPI = require('./fluentapi/user-api');
var TestAPI = require('./fluentapi/test-api');

// TicTacToe load-test settings
const count = 75;
const timelimit = 22000;
var startMillis;
var endMillis;
var games = 0;
var players=[];        

const userAPI = UserAPI(inject({
    io,
    RoutingContext
}));

const testAPI = TestAPI(inject({
    io,
    RoutingContext
}));

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

/**
 * Starts an tictactoe game. I choose to keep all the clients active for a more realistic test
 * */
function playGame(done){
        var userA;
        var userB;
        userA = userAPI();
        userB = userAPI();
        players.push(userA);
        players.push(userB);
        games++;
        userA.expectGameCreated().createGame().then(()=> {           
                userB.expectGameJoined().joinGame(userA.getGame().gameId).then(function () {                    
                    userA.expectMoveMade().placeMove(0, 0).then(()=> {
                        userA.expectMoveMade();
                        userB.expectMoveMade().placeMove(1, 0).then(()=> {
                            userB.expectMoveMade(); // By other user
                            userA.expectMoveMade().placeMove(1, 1).then(()=> {
                                userA.expectMoveMade(); // By other user
                                userB.expectMoveMade().placeMove(0, 2).then(()=> {
                                    userB.expectMoveMade(); // By other user
                                    userA.expectMoveMade().placeMove(2, 2)
                                        .expectGameWon().then(function () { 
                                            userA.disconnect();
                                            userB.disconnect();
                                            games--;
                                            if(games === 0){
                                                endMillis = new Date().getTime();  
                                                var duration = endMillis - startMillis;  
                                                _.each(players, function(usr){
                                                    usr.disconnect();
                                                });
                                                if(duration > timelimit){
                                                    done.fail(duration + " exceeds limit " + timelimit);
                                                }
                                                else{
                                                    console.log(duration);
                                                    done();
                                                }
                                            }                                                             
                                        }); // Winning move
                                })
                            })
                        });
                    })
                })
            }        
        );  
    }

describe('User tictactoe load test', function(){

    beforeEach(function(done){
        var testapi = testAPI();
        testapi.waitForCleanDatabase().cleanDatabase().then(()=>{
            testapi.disconnect();
            done();
        });        
    });


    it('should be able to play ' + count + ' tictactoe games end to end within ' + timelimit + 'ms', function(done){
        startMillis = new Date().getTime();  
        for(var i = 0; i < count; i++){
            playGame(done);            
        }

    });    
});

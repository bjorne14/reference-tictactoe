const io = require('socket.io-client');
const RoutingContext = require('../client/src/routing-context');
var UserAPI = require('./fluentapi/user-api');
var TestAPI = require('./fluentapi/test-api');

const userAPI = UserAPI(inject({
    io,
    RoutingContext
}));

const testAPI = TestAPI(inject({
    io,
    RoutingContext
}));

describe('User chat API', function(){
    var user;

    beforeEach(function(done){
        var testapi = testAPI();
        testapi.waitForCleanDatabase().cleanDatabase().then(()=>{
            testapi.disconnect();
            user = userAPI();
            done();
        });
    });

    afterEach(function(){
        user.disconnect();
    });

    it('should get user session information on connect',function(done){
        // There is a weak race condition here. Why ?
        user.expectUserAck().then(done);
    });

    it('should receive chat message back after sending chat command',function(done){
        // There is no race condition here. Why ?
        user.expectChatMessageReceived('message one ')
            .sendChatMessage('message one ')
            .then(done);
    });

});

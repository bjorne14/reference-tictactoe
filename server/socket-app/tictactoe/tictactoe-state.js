var _ = require('lodash');

module.exports = function (injected) {
    var isGameFull = false;

    return function (history) {

        function processEvent(event) {
            if(event.type === "GameJoined"){
                isGameFull = true;
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }
        function gameFull(){
            return isGameFull;
        }
        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull
        }
    };
};

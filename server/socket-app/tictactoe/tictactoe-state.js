var _ = require('lodash');

module.exports = function (injected) {
    var isGameFull = false;

    // '-' indicates that the cell is free for occupation
    var board = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ];

    return function (history) {

        function processEvent(event) {
            if(event.type === "GameJoined"){
                isGameFull = true;
            }
            else if(event.type === "MovePlaced"){
                board[event.coordinates.y][event.coordinates.x] = event.side;
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

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
<<<<<<< HEAD
            else if(event.type === "MovePlaced"){
=======
            else if(event.type === "PlaceMove"){
<<<<<<< HEAD
                illegalMove = false;
>>>>>>> 8eed877... PlaceMove (on an occupied cell) test : PASSED
=======
>>>>>>> 9533bac... Refactor, moved all testing data into module
                board[event.coordinates.y][event.coordinates.x] = event.side;
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function isCellOccupied(x, y){
            return board[y][x] !== '-';
        }

        function gameFull(){
            return isGameFull;
        }
        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull,
            isCellOccupied: isCellOccupied
        }
    };
};

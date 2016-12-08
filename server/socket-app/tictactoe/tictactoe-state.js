var _ = require('lodash');

module.exports = function (injected) {
    var isGameFull = false;
    var lastPlacedPlayer = "none";
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
                lastPlacedPlayer = event.side;
                board[event.coordinates.y][event.coordinates.x] = event.side;
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function isCellOccupied(x, y){
            return board[y][x] !== '-';
        }

        function notYourTurn(side){
           return lastPlacedPlayer === side;
        }

        function gameFull(){
            return isGameFull;
        }
        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull,
            isCellOccupied: isCellOccupied,
            notYourTurn: notYourTurn
        }
    };
};

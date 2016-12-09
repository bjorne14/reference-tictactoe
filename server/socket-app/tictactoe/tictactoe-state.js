var _ = require('lodash');

module.exports = function (injected) {
    var isGameFull = false;
    var occupiedCells = 0;
    var lastPlacedPlayer = "none";
    // '-' indicates that the cell is free for occupation
    var board = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ];

    return function (history) {
        function clear(){
            isGameFull = false;
            lastPlacedPlayer = "none";
            for(i = 0; i < 3; i++){
                for(j = 0; j < 3; j++){
                    board[i][j] = '-';
                }                   
            }
        }

        function processEvent(event) {
            if(event.type === "GameJoined"){
                isGameFull = true;
            }
            else if(event.type === "MovePlaced"){
                occupiedCells++;
                lastPlacedPlayer = event.side;
                board[event.coordinates.y][event.coordinates.x] = event.side;
            }
        }

        function processEvents(history) {
            occupiedCells = 0;
            clear();
           _.each(history, processEvent);
        }
        
        function isOutOfBounds(cords){
            return ((cords.x < 0 || cords.x > 2) || (cords.y < 0 || cords.y > 2));
        }

        function isCellOccupied(cords){
            return board[cords.y][cords.x] !== '-';
        }

        function notYourTurn(side){
           return lastPlacedPlayer === side;
        }

        function gameDraw(side, cords){
            if(gameWon(side, cords)){
                return false;
            }
            return occupiedCells === 9;
        }

        function gameWon(side, cords){
            // Occupy the cell for the player.
            board[cords.y][cords.x] = side;
            occupiedCells++;

            // Check if player has occupied 3 cells along the diagonal
            if((board[0][0] == side && board[1][1] == side && board[2][2] == side) ||
                    (board[2][0] == side &&  board[1][1] == side && board[0][2] == side)){
                return true;
            }
            for(i = 0; i < 3; i++){
                if(board[i][0] == side && board[i][1] == side && board[i][2] == side){
                    return true;
                }
                if(board[0][i] == side && board[1][i] == side && board[2][i] == side){
                    return true;
                }
            }

            return false;
        }

        function gameFull(){
            return isGameFull;
        }
        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull,
            isCellOccupied: isCellOccupied,
            isOutOfBounds: isOutOfBounds,
            notYourTurn: notYourTurn,
            gameWon: gameWon,
            gameDraw: gameDraw
        }
    };
};

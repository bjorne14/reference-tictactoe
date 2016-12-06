### TicTacToe unit test examples
**I invinted three players :**
<br>
*PlayerA* - _The player which created the game and did the first move_
<br>
*PlayerB* - _An player which tries to join the game_
<br>
*PlayerC* - _Another player which also tries to join the game_

***Winning scenarios:***
Three cells occupied by the same player form an vertical/horizontal/diagonal line.	
* ***Given:*** 
	* PlayerA has created a game which PlayerB has successfully joined.
	* PlayerA/B has occupied two cells each, PlayerB has two cells forming an vertical/diagonal/horizontal line which isn't blocked
* ***When***:
	* PlayerB occupies the third cell and thus forms an vertical/horizontal/diagonal line of three cells.
* ***Then:***
	* PlayerB has now won the game
	
---
***Draw scenarios***
* ***Given:*** 
	* PlayerA has created a game which PlayerB has successfully joined.	
* ***When***:
	* PlayerB occupies the last cell on the board.
* ***Then:***
	* Neither PlayerA or PlayerB has won, i.e the game is a draw.
	
---
***Illegal Moves***
- **Player tries to occupy an cell outside the playing board.**
  * ***Given:*** 
      * PlayerA has created a game which PlayerB has successfully joined.	
  * ***When***:
      * PlayerA tries to occupy an cell outside the board.
  * ***Then:***
      * PlayerA isn't allowed to occupy the cell and should retry.
- **Player tries to join a game where another player has already joined.**
  * ***Given:*** 
      * PlayerA has created a game which PlayerB has successfully joined.	
  * ***When***:
      * PlayerC tries to join the game.
  * ***Then:***
      * PlayerC isn't allowed to join the game since its full.
- **Player tries to occupy an cell which is already occupied by another player.**
   * ***Given:*** 
      * PlayerA has created a game which PlayerB has successfully joined.
      * PlayerB has occupied an cell C.
   * ***When:*** 
      * PlayerA tries to occupy the cell C.
   * ***Then:*** 
      * PlayerA isn't able to occupy the cell C, and should retry.
- **Player tries to occupy an cell when it's opponent has the turn.**
  * ***Given:*** 
      * PlayerA has created a game which PlayerB has successfully joined.	
      * PlayerB has the turn.
  * ***When***:
      * PlayerA tries to occupy an cell
  * ***Then:***
      * PlayerA isn't allowed to occupy the cell and should wait.

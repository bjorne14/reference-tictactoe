### TicTacToe unit test examples
**I invented three players :**
<br>
*PlayerA* - _The player which created the game and did the first move_
<br>
*PlayerB* - _An player which tries to join the game_
<br>
*PlayerC* - _Another player which also tries to join the game_

***Winning scenarios:*** _(Three cells occupied by the same player form an vertical/horizontal/diagonal line.)_
* ***Given:*** 
	* PlayerA has created a game _('CreateGame', 'GameCreated' events)_ which PlayerB has successfully joined _('game join', 'game joined' events)_ .
	* PlayerA/B has occupied two cells each _('PlaceMove', 'MovePlaced' events)_, PlayerB has two cells forming an vertical/diagonal/horizontal line which isn't blocked
* ***When***:
	* PlayerB occupies the third cell _('PlaceMove', 'MovePlaced' events)_ and thus forms an vertical/horizontal/diagonal line of three cells.
* ***Then:***
	* PlayerB has now won the game _(Event of type 'GameWon' is emitted)_
	
---
***Draw scenarios***
* ***Given:*** 
	* PlayerA has created a game _('CreateGame', 'GameCreated' events)_ which PlayerB has successfully joined _('game join', 'game joined' events)_ .
	* PlayerA/B has occupied four cells each _('PlaceMove', 'MovePlaced' events)_ where no two consecutive _(vertical/horizontal/diagonal)_ cells from the last cell is occupied by the same player.
* ***When***:
	* PlayerB occupies the last cell on the board _('PlaceMove', 'MovePlaced' events)_ .
* ***Then:***
	* Neither PlayerA or PlayerB has won, i.e the game is a draw. _(Event of type 'GameDraw' is emitted)_
	
---
***Legal Actions***
- **Player creates a game**
	* ***Given:*** 
		* Nothing
	* ***When***:
		* PlayerA creates a game _('CreateGame' event)_ .
	* ***Then***:
		* PlayerA has successfully created a game. _(Event of type 'GameCreated' is emitted)_
- **Player tries to join a game.**
  * ***Given:*** 
      * PlayerA has created a game which no player has joined _('CreateGame', 'GameCreated' events)_ .
  * ***When***:
      * PlayerB tries to join the game _('JoinGame' event)_ .
  * ***Then:***
      * PlayerB has successfully joined the game. _(Event of type 'GameJoined' is emitted)_
- **Player performs first occupation of cell in game.**
  * ***Given:*** 
	* PlayerA has created a game _('CreateGame', 'GameCreated' events)_ which PlayerB has successfully joined _('JoinGame', 'GameJoined' events)_ .
  * ***When***:
      * PlayerB tries to occupy an cell _('PlaceMove' event)_ .
  * ***Then:***
      * PlayerB has successfully occupied the cell. _(Event of type 'MovePlaced' is emitted)_

---
***Illegal Actions***
- **Player tries to occupy an cell outside the playing board.**
  * ***Given:*** 
	* PlayerA has created a game _('CreateGame', 'GameCreated' events)_ which PlayerB has successfully joined _('game join', 'game joined' events)_ .
  * ***When***:
      * PlayerA tries to occupy an cell outside the board _('PlaceMove' event)_ .
  * ***Then:***
      * PlayerA isn't allowed to occupy the cell and should retry. _(Event of type 'IllegalMove' is emitted)_
- **Player tries to join a game where another player has already joined.**
  * ***Given:*** 
	* PlayerA has created a game _('CreatedGame', 'GameCreated' events)_ which PlayerB has successfully joined _('JoinGame', 'GameJoined' events)_ .
  * ***When***:
      * PlayerC tries to join the game  _('JoinGame' event)_ .
  * ***Then:***
      * PlayerC isn't allowed to join the game since its full. _(Event of type 'FullGameJoinAttempted' is emitted)_
- **Player tries to occupy an cell which is already occupied by another player.**
   * ***Given:*** 
	* PlayerA has created a game _('CreateGame', 'GameCreated' events)_ which PlayerB has successfully joined _('game join', 'game joined' events)_ .
      * PlayerB has occupied an cell C _('PlaceMove', 'MovePlaced' events)_ .
   * ***When:*** 
      * PlayerA tries to occupy the cell C _('PlaceMove' event)_ .
   * ***Then:*** 
      * PlayerA isn't able to occupy the cell C, and should retry. _(Event of type 'IllegalMove' is emitted)_
- **Player tries to occupy an cell when it's opponent has the turn.**
  * ***Given:*** 
	* PlayerA has created a game _('CreateGame', 'GameCreated' events)_ which PlayerB has successfully joined _('game join', 'game joined' events)_ .
      * PlayerB has the turn.
  * ***When***:
      * PlayerA tries to occupy an cell _('PlaceMove' event)_ .
  * ***Then:***
      * PlayerA isn't allowed to occupy the cell and should wait. _(Event of type 'NotYourMove' is emitted)_

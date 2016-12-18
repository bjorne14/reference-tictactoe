import ReactTestUtils from 'react-addons-test-utils';
import TictactoeBoardModule from './TictactoeBoard';
import ReactDOM from 'react-dom';
import React from 'react';
import { shallow } from 'enzyme';

import TicCellComponent from './TicCell';

import MessageRouter from '../common/framework/message-router';

var div, component, TicCell, myCords, side, gameIdUUID;

var commandRouter = MessageRouter(inject({}));
var eventRouter = MessageRouter(inject({}));
var commandsReceived=[];

// A move to 'perform' in order to check how the cells acts with correct/wrong information.(overwrite props as needed)
var move;

commandRouter.on("*", function(cmd){
    commandsReceived.push(cmd);
} );

beforeEach(function () {
    commandsReceived.length=0;
    TicCell = TicCellComponent(inject({
        generateUUID:()=>{
            return "youyouid"
        },
        commandPort: commandRouter,
        eventRouter
    }));
    div = document.createElement('div');
    myCords = {x: 0, y:0 };
    side = 'X';
    gameIdUUID = 'uuid'; 

    var timeOfMove = new Date().toISOString();
    move = {
        commandId: 'so command',
        gameId: 'aId',
        type: 'MovePlaced',
        user: { userName: 'the other player' },
        name: 'so name',
        timeStamp: timeOfMove,
        side: 'O',
        coordinates: { x:1, y:0}
    };

    component = shallow(<TicCell />, div);
    component.setProps({coordinates: myCords, mySide: side, gameId: gameIdUUID});
});
describe("Tic Cell", function () {
    it('should render without error', function () {

    });

    it('should record move with matching game id and coordinates ',function(){
        move.coordinates = myCords;
        move.gameId = gameIdUUID;
        eventRouter.routeMessage(move);
        expect(component.state('side')).toBe(move.side);
    });

    it('should ignore move with matching gameId but not coordinates',function(){
        var oldSide = component.state('side');
        move.gameId = gameIdUUID;
        eventRouter.routeMessage(move);
        expect(component.state('side')).toBe(oldSide);
    });

    it('should ignore move with matching coordinates, but not matching gameId',function(){
        var oldSide = component.state('side');
        move.coordinates = myCords;
        eventRouter.routeMessage(move);
        expect(component.state('side')).toBe(oldSide);
    });

    it('should issue PlaceMove command with gameId, mySide and coordinates when clicked', ()=>{
        component.find('div').simulate('click');
        // Check so that we receive a command
        expect(commandsReceived.length).toBe(1);

        // Check so that gameId/mySide/coordinates are set and have the correct values.
        expect(commandsReceived[0].gameId).toBe(gameIdUUID);
        expect(commandsReceived[0].side).toBe(side);
        expect(commandsReceived[0].coordinates).toBe(myCords);

    });
});

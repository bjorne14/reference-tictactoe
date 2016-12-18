import React from 'react';

export default function (injected) {
    const eventRouter = injected('eventRouter');
    const commandPort = injected('commandPort');
    const generateUUID = injected('generateUUID');

    class TicCell extends React.Component {
        constructor() {
            super();
            this.state = {
                side: ""
            }

            this.makeMove = this.makeMove.bind(this);
        }
        componentWillMount(){
            const movePlaced = (placement)=>{
                if(placement.gameId === this.props.gameId && placement.coordinates.x === this.props.coordinates.x 
                        && placement.coordinates.y === this.props.coordinates.y) {
                    this.setState({ side: placement.side});
                }
            };
            eventRouter.on('MovePlaced', movePlaced);          
        }

        makeMove(){
            var timeOfMove = new Date().toISOString();
            var move = {
                commandId: generateUUID(),
                gameId: this.props.gameId,
                type: "PlaceMove",
                user: { userName: "not sure how this is injected" },
                name: "not sure how this is injected", 
                timeStamp: timeOfMove,
                side: this.props.mySide,
                coordinates: this.props.coordinates             
            };
            commandPort.routeMessage(move);
        }

        render() {
            return <div onClick={this.makeMove} className="ticcell">
                {this.state.side}
            </div>
        }
    }
    return TicCell;
}

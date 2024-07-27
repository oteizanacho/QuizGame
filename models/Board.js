//clase tablero 
class Board{
    constructor(id, boxes){
        this.id = id;
        this.players = [];
        this.boxes = boxes;
        this.winner = {};
        this.turn = {};
    }

    addPlayer(player){
        this.players.push(player);
    }

    setWinner(player){
        this.winner = player;
    }

    setTurn(player){
        this.turn = player;
    }
}

export default Board;
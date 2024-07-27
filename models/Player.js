//clase casillero
class Player{
    constructor(id, name, color){
        this.id = id;
        this.name = name;
        this.color = color;
        this.position = 0;
    }

    setMove(number){
        this.position += number;
        if(this.position > 20){
            this.position = 20;
        }
    }
}

export default Player;
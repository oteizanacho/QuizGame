//clase casillero
class Box{
    constructor(id, question){
        this.id = id;
        this.question = question;
    }

    changeQuestion(question){
        this.question = question;
    }
}

export default Box;
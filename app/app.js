//imports de clases
import Question from '../models/Question.js';
import Player from '../models/Player.js';
import Board from '../models/Board.js';
//importo json con las preguntas
import questionsData from '../data/questions.json' assert { type: 'json' };
import newQuestionData from '../data/newquestion.json' assert { type: 'json'};
//universal id
import { v4 as uuidv4 } from 'uuid';

//creo jugador nuevo
function newPlayer(id, name, color){
    const player = new Player(id, name, color);
    return player;
}

//creo un tablero nuevo
function newBoard(){
    //arreglo para guardar los casilleros
    let boxes = {};
    for(let i = 0; i < 20; i++){
        boxes[i + 1] = new Question(questionsData[i].question, questionsData[i].options, questionsData[i].answer);
    }
    const idboard = uuidv4();
    const board = new Board(idboard, boxes);
    return board;

}

function rollDice(){
    return Math.floor((Math.random() * 6));
}

function newQuestion(){
    const newquestion = newQuestionData.pop();
    return new Question(newquestion.question, newquestion.options, newquestion.answer);
}

export default {
    newPlayer,
    newBoard,
    rollDice,
    newQuestion
}

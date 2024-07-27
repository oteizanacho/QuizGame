//imports de clases
import Question from '../models/Question.js';
import Player from '../models/Player.js';
import Board from '../models/Board.js';
import Box from '../models/Box.js';
//importo json con las preguntas
import questionsData from '../data/questions.json' assert { type: 'json' };
//universal id
import { v4 as uuidv4 } from 'uuid';

function getRandomColor(){
    const r = Math.floor((Math.random() * 200) + 50)
    const g = Math.floor((Math.random() * 200) + 50)
    const b = Math.floor((Math.random() * 200) + 50)
    //rbg(112,243,59)
    return `rgb(${r},${g},${b})`
}

//creo jugador nuevo
function newPlayer(id, name){
    const player = new Player(id, name, getRandomColor());
    return player;
}

//creo un tablero nuevo
function newBoard(){
    //arreglo para guardar los casilleros
    let boxes = [];
    for(let i = 0; i < 20; i++){
        const questionid = uuidv4();
        //creo una pregunta usando los datos traidos del archivo JSON de preguntas 
        const question = new Question(questionid, questionsData[i].question, questionsData[i].options, questionsData[i].answer);
        //creo un casillero nuevo
        const box = new Box (i + 1, question);
        //sumo el casillero al arreglo de casilleros
        boxes.push(box);
    }
    const idboard = uuidv4();
    //creo un tablero nuevo y le paso los casilleros
    const board = new Board(idboard, boxes);
    return board;
}

function rollDice(){
    return Math.floor((Math.random() * 6));
}

export default {
    newPlayer,
    newBoard,
    rollDice,
}
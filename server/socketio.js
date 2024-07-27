import expressServer from "./express.js";
import { Server } from 'socket.io';
import app from '../app/app.js'

const io = new Server(expressServer);

//contiene las partidas activas
let rooms = {};

//contiene jugadores activos
let activeplayers = {};

io.on('connect', socket => {
    console.log('connected!');

    //crear sala
    socket.on('new', data => {
        //console.log('********************')
        const { username, sesionid } = data;
        if(activeplayers[sesionid]){
            console.log('el jugador ya existe');
            //console.log(activeplayers);
        } else {
            const player = app.newPlayer(sesionid, username);
            const board = app.newBoard();
            board.addPlayer(player);
            board.setTurn(player);
            rooms[board.id] = board;
            activeplayers[sesionid] = player;
            //console.log(`${player.name} con id ${player.id} creado`);
            //console.log('****')
            //console.log(rooms);
            //console.log('********************')
        }
    });

    //unirse a sala y comenzar el juego
    socket.on('join', data => {
        //console.log('********************')
        const { username, sesionid } = data;
        if(activeplayers[sesionid]){
            console.log('el jugador ya existe');
            //console.log(activeplayers);
        } else {
            if(Object.keys(rooms).length > 0){
                let encontre = false;
                for(const boardid in rooms){
                    if(rooms[boardid].players.length < 2){
                        encontre = true;
                        const player = app.newPlayer(sesionid, username);
                        rooms[boardid].players.push(player);
                        activeplayers[sesionid] = player;
                        const roomdata = {
                            boardid, //id de la sala
                            turn: rooms[boardid].turn //jugador
                        }
                        //comienza el turno del jugador
                        io.emit('start', roomdata);
                        //console.log(`${player.name} con id ${player.id} creado`);
                        //console.log('****')
                        //console.log(rooms);
                        //console.log('********************')
                    }
                }
                if(!encontre){
                    console.log('salas llenas.');
                    //console.log('********************')
                }
            } else {
                console.log('no hay salas.');
                //console.log('********************')
            }
        }
    });

    //recibe el valor del dado
    socket.on('roll', data => {
        //id del board y turno del board
        const { boardid, turn } = data;
        for(let i = 0; i < rooms[boardid].players.length; i++){
            //busco en el board el jugador que debe jugar 
            if(rooms[boardid].players[i].id === turn.id){
                let dice = app.rollDice();
                //console.log(`${rooms[boardid].players[i].name} saco un ${dice + 1}`);
                const { question, options, id, answer } = rooms[boardid].boxes[dice].question;
                const questionData = {
                    question,
                    options,
                    boardid,
                    turn,
                    dice
                }
                //envia pregunta al jugador
                io.emit('question', questionData);
                //console.log(`${question}, ${options}, ${id}, ${answer}`)
                //console.log('********************')
            }
        }
    });

    //analizar respuesta
    socket.on('answer', data => {
        const { playeranswer, boardid, dice } = data;
        let { turn } = data;
        //console.log(rooms[boardid].boxes[dice].question.answer)
        const { answer } = rooms[boardid].boxes[dice].question;
        const { players } = rooms[boardid];
        //console.log(rooms[boardid].players)
        if(answer === playeranswer){
            players.forEach(player => {
                if(player.id === turn.id){
                    player.setMove(dice + 1);
                    io.emit('move', player);
                    const aux = {
                        boardid,
                        turn
                    }
                    io.emit('start', aux);
                }
            });
        } else {
            players.forEach(player => {
                if(player.id != turn.id){
                    turn = player;
                    const aux = {
                        boardid,
                        turn
                    }
                    io.emit('start', aux);
                }
            });
        }
        //io.emit('winner');
    });

    socket.on('disconnect', data => {
        console.log(`${socket.id} disconnected.`)
    });
    
})

export default io;


// export default io -> se exporta 1 solo
// export {rooms, activePlayers} -> se exportan varios de una vez

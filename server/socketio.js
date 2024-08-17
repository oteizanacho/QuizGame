import expressServer from "./express.js";
import { Server } from 'socket.io';
import app from '../app/app.js'

const io = new Server(expressServer);

//contiene las partidas activas
let rooms = {};

let askedquestions = {};

io.on('connect', socket => {
    
    //crear sala
    socket.on('new', (username, color, callback) => {
        const player = app.newPlayer(socket.id, username, color);
        const board = app.newBoard();
        rooms[board.id] = board;
        board.addPlayer(player);
        board.setTurn(player);
        socket.join(board.id);
        callback(board.id, player);
    });

    //unirse a sala y comenzar el juego
    socket.on('join', (username, color, callback) => {
        let availableroomid = null;
        for(const roomid in rooms){
            if(rooms[roomid].players.length === 1){
                availableroomid = roomid;
                break;
            }
        }
        if(availableroomid){
            const board = rooms[availableroomid];
            const player = app.newPlayer(socket.id, username, color);
            board.addPlayer(player);
            socket.join(board.id);
            io.to(board.id).emit('start', board);
            callback(board.id, player);
        } else {
            callback(null, null);
        }
    });


    //se tiro el dado, envio una pregunta
    socket.on('roll', (boardid, playerid) => {
        const room = rooms[boardid];
        if(room && room.turn.id === playerid){
            const dice = (Math.floor((Math.random() * 6))) + 1;
            const player = room.players.find(p => p.id === playerid);
            const newposition = (player.position + dice) > 20 ? 20 : player.position + dice;
            if(askedquestions[newposition] === room.boxes[newposition]){
                room.boxes[newposition] = app.newQuestion();
            } else{
                askedquestions[newposition] = room.boxes[newposition];
            }
            const box = room.boxes[newposition];
            const { question, options } = box;
            const questiondata = {
                question,
                options,
                newposition
            }
            io.to(boardid).emit('question', questiondata);
        }
    });

    //se contesto la pregunta enviada
    socket.on('answer', (boardid, playerid, answer, newposition) => {
        const room = rooms[boardid];
        const box = room.boxes[newposition];
        const player = room.players.find(p => p.id === playerid);
        if(room && room.turn.id === playerid){
            console.log(answer);
            console.log(box);
            if(answer === box.answer){
                const oldposition = player.position; // para despintar el div
                player.position = newposition;
                if(newposition >= 20){
                    room.setWinner(player);
                    io.to(boardid).emit('gameOver', player);
                    console.log('emitiendo evento game over.')
                } else {
                    room.setTurn(player);
                    io.to(boardid).emit('correctAnswer', room.players, oldposition);
                    console.log('emitiendo evento correctAnser')
                }
            } else {
                room.turn = room.players.find(p => p.id !== playerid);
                io.to(boardid).emit('wrongAnswer', room.turn);
                console.log('emitiendo evento wrongAnswer');
            }
        }
    });

    //desconexion 
    socket.on('disconnect', () => {
        for(const roomid in rooms){
            const room = rooms[roomid];
            const player = room.players.find(p => p.id === socket.id);
            if(player){
                console.log(player.name, 'se desconecto')
                const winner = room.players.find(p => p.id !== socket.id);
                io.to(roomid).emit('gameOver', winner);
            }
        }
    });

    
})

export default io;


// export default io -> se exporta 1 solo
// export {rooms, activePlayers} -> se exportan varios de una vez

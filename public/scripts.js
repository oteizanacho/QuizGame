// const socket = io('http://localhost:3000');

//tablero
const board = document.getElementById("board");
//name input
const nameinput = document.getElementById('username');

//evento para crear una nueva sala
const newRoom = document.getElementById('newRoom');
newRoom.addEventListener('click', () => {
    const username = nameinput.value;
    const data = {
        username,
        sesionid: socket.id
    }
    board.style.display = "inline-grid";
    socket.emit('new', data);
    console.log('creando sala...');
    console.log(`usuario ${username}, id ${socket.id}`)
});

//evento para unirse a sala
const joinRoom = document.getElementById('joinRoom');
joinRoom.addEventListener('click', () => {
    const username = nameinput.value;
    const data = {
        username,
        sesionid: socket.id
    }
    board.style.display = "inline-grid";
    socket.emit('join', data);
    console.log('buscando sala...');
    console.log(`usuario ${username}, id ${socket.id}`);
});

//inicia el turno del jugador pasado como dato
// socket.on('start', data => {
//     const { boardid, turn } = data;
//     const rollbtn = document.getElementById('dice');
//     if(turn.id === socket.id){
//         console.log(`turno de ${turn.name}, id ${turn.id}`);
//         rollbtn.addEventListener('click', () => {
//             //tiro del dado
//             socket.emit('roll', data);
//         });
//     } else {
//         rollbtn.disabled = 'true';
//     }
// });

//mostrar pregunta
const questionPopUp = document.getElementById('questionPopUp');
// socket.on('question', data => {
//     const { question, options, boardid, turn, dice } = data;
//     const questionLabel = document.getElementById('question');
//     questionLabel.textContent = question;
//     options.forEach((option, index) => {
//         const radioLabel = document.getElementById(`label${index + 1}`);
//         radioLabel.textContent = option;
//         const radioButton = document.getElementById(`opcion${index + 1}`);
//         radioButton.value = option;
//     });
//     const submitbtn = document.getElementById('questionbtn');

//     if(turn.id != socket.id){
//         submitbtn.disabled = 'true';
//     } else {
//         submitbtn.addEventListener('click', e => {
//             e.preventDefault();
//             const options = document.getElementsByName('answer');
//             options.forEach(option => {
//                 if(option.checked){
//                     const playeranswer = option.value;
//                     const questionData = {
//                         playeranswer,
//                         boardid,
//                         turn,
//                         dice
//                     }
//                     //enviar respuesta
//                     socket.emit('answer', questionData);
//                     questionPopUp.style.display = 'none';
//                 }
//             })
//         })
//     }
//     questionPopUp.style.display = "flex";
// });

// //un jugador respondio correctamente y debo moverlo
// socket.on('move', data => {
//     const { id, color, position } = data;
//     if(id === socket.id){
//         const div = document.getElementById(`box${position}`);
//         div.style.backgroundColor = color;
//     }
// });

// //hay un ganador
// socket.on('winner', data => {
//     console.log(`ganador: ${data}`);
// });

/* -------------- FUNCIONES LOGIN -------------- */
// FUNCION PARA TOMAR COLOR SELECCIONADO EN LOGIN
const colorsBtn = document.getElementsByClassName("colorBtn")
for (const btn of colorsBtn) {
    btn.addEventListener("click", (e) => {
        e.preventDefault()
        const color = e.target.id.substring(5)
        console.log(color)
    })
}

const nickname = document.getElementById("username")

const joinBtn = document.getElementById("joinRoom")
joinBtn.addEventListener("click", (e) => {
    e.preventDefault()
})

const createBtn = document.getElementById("newRoom")
createBtn.addEventListener("click", (e) => {
    e.preventDefault()
    console.log(e)
})
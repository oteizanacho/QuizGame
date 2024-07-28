const socket = io.connect('http://localhost:3000');


const board = document.getElementById("board");
const usernameInput = document.getElementById('username');


//evento para crear una nueva sala
const newRoom = document.getElementById('newRoom');
newRoom.addEventListener('click', (e) => {
    e.preventDefault()

    const peon = document.getElementById("player1")
    const username = usernameInput.value;
    const color = colorSelected;
    const casilla = 0;
    const user = {
        username,
        color,
        casilla,
        sesionid: socket.id
    }

    peon.style.backgroundColor= color
    logIn.style.display ="none"
    board.style.display = "inline-grid";
    socket.emit('new', user);
    console.log('creando sala...');
    console.log(`usuario ${username}, color ${color} ,id ${socket.id}`)
});

//evento para unirse a sala
const joinRoom = document.getElementById('joinRoom');
joinRoom.addEventListener('click', (e) => {
    e.preventDefault()
    const username = usernameInput.value;
    const color = colorSelected;
    const user = {
        username,
        color,
        sesionid: socket.id
    }
    logIn.style.display = "none"
    board.style.display = "inline-grid";
    socket.emit('join', user);
    console.log('buscando sala...');
    console.log(`usuario ${username}, id ${socket.id}`);
});

//inicia el turno del jugador pasado como dato
socket.on('start', data => {
    const { boardid, turn } = data;
    const rollbtn = document.getElementById('dice');
    if(turn.id === socket.id){
        console.log(`turno de ${turn.name}, id ${turn.id}`);
        rollbtn.addEventListener('click', () => {
            //tiro del dado
            socket.emit('roll', data);
        });
    } else {
        rollbtn.disabled = 'true';
    }
});

 //mostrar pregunta
const questionModal = document.getElementById('questionModal');
socket.on('question', data => {
    const { question, options, boardid, turn, dice } = data;
    const questionLabel = document.getElementById('question');


    questionLabel.textContent = question;
    options.forEach((option, index) => {
        const answer = document.getElementById("option"+(index+1))
        answer.textContent = option;
    });
    let questionData;
    const optionButtons = document.getElementsByClassName("option")
    for (const optionBtn of optionButtons) {
        optionBtn.addEventListener("click", (btn) =>{
            btn.preventDefault()
            const playerAnswer = btn.target.textContent;
           
            questionData = {
                playerAnswer,
                boardid,
                turn,
                dice
            }
            console.log(questionData)
            
        })
        socket.emit('answer', questionData);
        questionModal.style.display = 'none';
    }
    // const submitbtn = document.getElementById('questionbtn');

    // if(turn.id != socket.id){
    //     submitbtn.disabled = 'true';
    // } else {
    //     submitbtn.addEventListener('click', e => {
    //         e.preventDefault();
    //         const options = document.getElementsByName('answer');
    //         options.forEach(option => {
    //             if(option.checked){
    //                 const playeranswer = option.value;
    //                 const questionData = {
    //                     playeranswer,
    //                     boardid,
    //                     turn,
    //                     dice
    //                 }
                     //enviar respuesta
    //                 socket.emit('answer', questionData);
    //                 questionPopUp.style.display = 'none';
    //             }
    //         })
    //     })
    // }
    questionModal.style.display = "flex";
});

 //un jugador respondio correctamente y debo moverlo
socket.on('move', data => {
    const { id, color, position } = data;
    if(id === socket.id){
        const div = document.getElementById(`box${position}`);
         div.style.backgroundColor = color;
    }
});

 //hay un ganador
 socket.on('winner', data => {
     console.log(`ganador: ${data}`);
 });

/* -------------- FUNCIONES LOGIN -------------- */


// FUNCION PARA TOMAR COLOR SELECCIONADO EN LOGIN
const colorsBtn = document.getElementsByClassName("colorBtn")
let colorSelected; // guardo el color seleccionado para luego enviarla por joinRoom o newRoom event
for (const btn of colorsBtn) {
    btn.addEventListener("click", (e) => {
        e.preventDefault()
        colorSelected = e.target.id.substring(5)
    })
}

// FUNCION PARA UNIRSE A UNA SALA

// FUNCION PARA CREAR UNA SALA
const createBtn = document.getElementById("newRoom")
const logIn = document.getElementById("logInSection")

const player1 = {
    div: document.getElementById("player1"),
    box: 0,
}
  
dice.addEventListener("click", (e) => {
    const result = Math.floor(Math.random() * 6) + 1
    console.log(player1)
    if(player1.box + result < 21){ 
        player1.box += result;
        const box = document.getElementById("box" + player1.box)
        box.appendChild(player1.div)
        console.log(result)
    }
})

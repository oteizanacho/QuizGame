const socket = io.connect('http://localhost:3000');

let color = null;
const colorsbtn = document.getElementsByClassName('colorBtn');
for(let i = 0; i < colorsbtn.length; i++){
    colorsbtn[i].addEventListener('click', (e) => {
        e.preventDefault();
        color = colorsbtn[i].id.substring(5);
    });
}

const board = document.getElementById("board");
const logIn = document.getElementById("logInSection");


//evento para crear una nueva sala
const newRoom = document.getElementById('newRoom');
newRoom.addEventListener('click', (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value;
    if(username && color){
        socket.emit('new', username, color, (boardid, player) => {
            if(boardid){
                logIn.style.display ="none";
                board.style.display = "inline-grid";
                //startGame(boardid, player);
            }
        });
    } else {
        alert(!color ? 'seleccione un color' : 'ingrese nombre');
    }
});

//evento para unirse a sala
const joinRoom = document.getElementById('joinRoom');
joinRoom.addEventListener('click', (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value;
    if(username && color){
        socket.emit('join', username, color, (boardid, player) => {
            if(boardid){
                logIn.style.display ="none";
                board.style.display = "inline-grid";
            }
        });
    } else {
        alert(!color ? 'seleccione un color' : 'ingrese nombre');
    }
});

//  Empieza el juego 
socket.on('start', (board) => {
    const player = board.players.find(p => p.id === socket.id);
    startGame(board.id, player);
});

function startGame(boardid, player){

    const rollbtn = document.getElementById('dice');
    //event listener para enviar 'roll'
    rollbtn.addEventListener('click', (e) => {
        e.preventDefault();
        socket.emit('roll', boardid, player.id);
    });

    //muestro pregunta y opciones con event listener para enviar 'answer'
    socket.on('question', (questiondata) => {
        currentQuestionData = questiondata;
        const { question, options, newposition } = questiondata;
        const questionmodal = document.getElementById('questionModal');
        
        const questionlabel = document.getElementById('question');
        questionlabel.textContent = question;

        options.forEach((option, index) => {
            const answer = document.getElementById(`option${index + 1}`);
            answer.textContent = option;
        });

        const optionbuttons = document.getElementsByClassName('option');
        for(let i = 0; i < optionbuttons.length; i++){
            optionbuttons[i].removeEventListener('click', handleOptionClick);
            optionbuttons[i].addEventListener('click', handleOptionClick);
        }
        
        questionmodal.style.display = 'flex';
    });

    socket.on('correctAnswer', (players, oldposition) => {
        document.getElementById('questionModal').style.display = 'none';
        if(oldposition != 0){
            const oldbox = document.getElementById(`box${oldposition}`);
            oldbox.style.backgroundColor = '#FFDD63';
        }
        players.forEach(player => {
            if(player.position != 0){
                const div = document.getElementById(`box${player.position}`);
                div.style.backgroundColor = player.color;
            }
        });
    });

    socket.on('wrongAnswer', (turn) => {
        document.getElementById('questionModal').style.display = 'none';
        rollbtn.style.display = turn.id === socket.id ? 'block' : 'none';
        const nextTurn = document.getElementById("nextTurn");
        nextTurn.textContent = turn.name + "'s Turn";
    });

    socket.on('gameOver', (winner) => {
        document.getElementById('questionModal').style.display = 'none';
        board.style.display = "none";
        const gameOverScreen = document.getElementById("gameOver")
        gameOverScreen.style.display = "flex"
        const winnerLabel = document.getElementById("winnerLabel")
        winnerLabel.textContent = winner.name + "'s Won!";
    });

    function handleOptionClick(e){
        e.preventDefault();
        const answer = e.target.textContent;
        socket.emit('answer', boardid, player.id, answer, currentQuestionData.newposition);
    }

    let currentQuestionData = null;

}
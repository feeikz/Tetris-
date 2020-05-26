var cvs = document.getElementById("tetris");
var ctx = cvs.getContext("2d");

var scoreElement = document.getElementById("score");
var underScore = document.getElementById("under");
var credits = document.getElementById("Credits");
var Settings = document.getElementById("Settings");
var menuID = document.getElementById("Menu")
var backButton = document.getElementById("b3");
var TetrisIMG = document.getElementById("introduction");
var Buttons = document.getElementById("Buttons");
var RotateButton = document.getElementById("rotB");
var goLeft = document.getElementById("bL");
var goRight = document.getElementById("bR");
var goDown = document.getElementById("bD");
var sON = document.getElementById("sON");
var sOFF = document.getElementById("sOFF");
var bgON=document.getElementById("bgON");
var bgOFF=document.getElementById("bgOFF");
var HS = document.getElementById("HS");

var ROW = 20;
var COL = COLUMN = 10;
var SQ = squareSize = 20;
var VACANT = "WHITE"; // color of an empty square
var board = [];

var gameOver;
var FPS = 140;
var score = 0 ;
var highscore = localStorage.getItem("highscore");


var game="game";
var menu="menu";
var creditsState = "creditsState";
var settingsState = "settingsState";
var switcher=menu;

var audioClear = new Audio('/Sounds/clear.wav');
var backGroundAudio = new Audio('/Sounds/Tetris.mp3');

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "gold"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

var vacantBoard = function (){
    for (r = 0; r < ROW; r++) {
        board[r] = [];
        for (c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }
}


vacantBoard();

function drawSquare (x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}
function renderSettings(){
    menuID.style.display='none';
    backButton.style.display='block';
    Settings.style.display='block';

    sON.onclick = function () {
        sON.style.display = 'none';
        audioClear.muted = true;
    }
    sOFF.onclick = function () {
        sON.style.display = 'block';
        audioClear.muted = false;
    }

    bgOFF.onclick = function () {
		if(backGroundAudio.play()){
            backGroundAudio.muted = false;
        }
        bgOFF.style.display = 'none';
        backGroundAudio.loop=true;
        backGroundAudio.play();
    }
    bgON.onclick = function () {
        bgOFF.style.display = 'block';
        backGroundAudio.muted = true;
    } 
}

function drawBorders(){
    ctx.fillStyle = VACANT;
    ctx.fillRect(0, 0, 200, 400);
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(0, 0, 200, 400);
}

function renderMenu(){
    drawBorders();
    Settings.style.display ='none';
    RotateButton.style.display = 'none';
    Buttons.style.display = 'none';
    underScore.style.display = 'none';
    credits.style.display = 'none';
    menuID.style.display='block';
    document.getElementById("b1").addEventListener("click",function(){
        switcher=game;   
    });
    document.getElementById("b2").addEventListener("click", function () {
        switcher = creditsState;

    });
    document.getElementById("b3").addEventListener("click", function () {
        switcher = settingsState;

    });
}

function renderCredits(){
    drawBorders();
    menuID.style.display = 'none';
    credits.style.display = 'block';
    document.getElementById("cb").addEventListener("click",function () {
       switcher=menu; 
    });
}
function initGame() {
    RotateButton.style.display = 'block';
    Buttons.style.display = 'block';
    menuID.style.display = 'none';
    underScore.style.display = 'block';

    if (highscore !== null) {
        console.log("score: " + score);
        console.log("higscore: " + highscore);
        if (score > highscore) {
            localStorage.setItem("highscore", score);
            console.log(localStorage.getItem("highscore") + " highscore prepis");
        }
    }
    else {
        localStorage.setItem("highscore", score);
    }

    goLeft.onclick = function () {
        p.moveLeft();
    }
    goRight.onclick = function () {
        p.moveRight();
    }
    goDown.onclick = function(){
        p.moveDown();
    }
    RotateButton.onclick = function(){
        p.rotate();
    }
}

var p = null;
setInterval(function () {
    TetrisIMG.addEventListener("click",function(){
        if(switcher=="game"){
            stopGame();
        }
        switcher=menu;
    });
   console.log(switcher);
   if(switcher=="game"){
        initGame();
       HS.innerHTML = localStorage.getItem("highscore"); 
       if(p===null){
           p=randomPiece();
       }
        drawBoard();
        p.moveDown();
        if(gameOver){
            stopGame();
        }
       scoreElement.innerHTML = score;   
   }
   if(switcher=="menu"){
       renderMenu();
   }
   if(switcher=="creditsState"){
       renderCredits();
   }
   if(switcher=="settingsState"){
       renderSettings();
   }
}, 100000 / FPS);


function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0; 
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}

Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.draw = function () {
    this.fill(this.color);
}

Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}

Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        
        this.lock();
        p = randomPiece();
    }
}

Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move Left the piece
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            // ak je to prava stena
            kick = -1; // kickneme to doľava
        } else {
            // ak je to lava stena
            kick = 1; //kickneme to doprava
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // 5%4 => 1 
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}


Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // we skip the vacant squares
            if (!this.activeTetromino[r][c]) {
                console.log("teraz");
                continue;
            }
            // lockne na vrchu 
            if (this.y + r < 0) {
                stopGame();
                alert("Game Over!");
                break;
            }
            // lockneme
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // mažem plné polia
    for (r = 0; r < ROW; r++) {
        var isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if (isRowFull) {
            for (y = r; y > 1; y--) {
                for (c = 0; c < COL; c++) {
                    //posúvam každý row o riadok nižšie
                    board[y][c] = board[y - 1][c];
                    audioClear.play();
                }
            }
            score += 10;
        }
    }
    drawBoard();
    scoreElement.innerHTML = score;
}


Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            //skipujem prázdne 
            if (!piece[r][c]) {
                continue;
            } 
            var newX = this.x + c + x;
            var newY = this.y + r + y;

            // podmienky
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            // záporné súradnice
            if (newY < 0) {
                continue;
            }
            //ak je locknuty piece na nových poziciach
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece(PIECES[r][0], PIECES[r][1]);
    
}

document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
    } else if (event.keyCode == 38) {
        p.rotate();
    } else if (event.keyCode == 39) {
        p.moveRight();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }else if (event.keyCode == 27){
        stopGame();
    }
}

function stopGame() {
    vacantBoard();
    switcher = menu;
    p = null; 
    score=0;
}
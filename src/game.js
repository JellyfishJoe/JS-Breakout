const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 15;

let ballRadius = 10;

let dx;
let dy;

//paddle
const paddleHeight = 10;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

//for bricks
const colCount = 5;
const rowCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

//scoring
let score = 0;
const neededScore = colCount * rowCount;

let bricks = [];
let column = 0;
let row = 0;
for(c = 0; c < colCount; c++){
	bricks[c] = [];
	column++;
	row = 0;
	for(r = 0; r < rowCount; r++){
		row++;
		bricks[c][r] = {x:0, y:0, status: 1, col: column, row: row};
	}
}

console.log(bricks);

var ballColor = "red";

window.onload = setupGame();

function setupGame(){
	chooseBallDirection();
}

function drawBall(){
	ctx.beginPath();
	ctx.fillStyle = ballColor;
	ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function keyDownHandler(event){
	if(event.keyCode == 37){
		rightPressed = true;
	}

	if(event.keyCode == 39){
		leftPressed = true;
	}
}

function keyUpHandler(event){
	if(event.keyCode == 37){
		rightPressed = false;
	}

	if(event.keyCode == 39){
		leftPressed = false;
	}
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function gameLoop(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	collisionDetection();
	drawScore();
	checkScore();
	drawBricks();

	//paddle movement
	if(rightPressed){
		paddleX -=5;
	}

	if(leftPressed){
		paddleX += 5;
	}

	if(paddleX > canvas.width - paddleWidth){
		paddleX = canvas.width - paddleWidth;
	}

	if(paddleX < 0){
		paddleX = 0;
	}

	if (x + dx < ballRadius || x + dx > canvas.width - ballRadius){
		dx = -dx;
	}

	//paddle collision
	if(y + dy < ballRadius){
		dy = -dy;
	}else if(y + dy > canvas.height - ballRadius){
		if(x > paddleX && x < paddleX + paddleWidth){
			if(y = y - paddleHeight){
				dy = -dy;
				changeColors();
				if(x > paddleX && x < paddleX + paddleWidth / 3){
					if(dx > 0){
						dx *= 0.5;
					}else if(dx < 0){
						dx *= 2;
					}
				}else if(x > paddleX + 2 * paddleWidth / 3 && x < paddleX + paddleWidth){
					if(dx > 0){
						dx *= 2;
					}else if(dx < 0){
						dx *= 0.5;
					}
				}
			}
			console.log(dx);
		}else{
			gameOver(0);
		}
	}

	if(x + dx < ballRadius || x + dx  > canvas.width - ballRadius){
		dx = -dx;
		//changeColors();
	}

	if(y + dy < ballRadius || y + dy > canvas.height - ballRadius){
		dy = -dy;
		//changeColors();
	}

	x += dx;
	y += dy;
}

function drawPaddle(){
	ctx.beginPath();
	ctx.fillStyle = ballColor;
	ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.closePath();
}

function drawBricks(){
	for(c = 0; c < colCount; c++){
		for(r = 0; r < rowCount; r++){
			if(bricks[c][r].status == 1){
				let brickX = (c * (brickWidth + brickPadding) + brickOffsetLeft);
				let brickY = (r * (brickHeight + brickPadding) + brickOffsetTop);
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.fillStyle = ballColor;
				ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
				ctx.closePath();
			}
		}
	}
}

function drawScore(){
	ctx.font = "20px Comis Sans MS";
	ctx.fillStyle = "black";
	ctx.fillText("Score: " + score, 0 , 20);
}

function checkScore(){
	if(score == neededScore){
		gameOver(1);
	}
}

function chooseBallDirection(){
	var max = (3 * Math.PI) / 4,
		min = Math.PI / 4;
	var angle = Math.random() * (max - min) + min;
	dy = 1.5 * Math.sin(angle);
	dx = 1.5 * Math.cos(angle);
	console.log(dx);
}

function collisionDetection(){
	for(c = 0; c < colCount; c++){
		for(r = 0; r < rowCount; r++){
			var b = bricks[c][r];
			if(b.status == 1){
				if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
					dy = -1.17 * dy;
					b.status = 0;
					score += 1;
					changeColors();
				}
			}
		}
	}
}

var gameInterval = setInterval(gameLoop, 10);

function gameOver(result){
	clearInterval(gameInterval);
	ctx.font = "50px Comic Sans MS";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	if(result == 1){
		ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
	}else if(result == 0){
		ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
	}
}

function restartGame(){
	document.location.reload();
}


/////Color Changing/////

function changeColors(){
	var r = rgb2hex(Math.floor(255 * Math.random()));
	var g = rgb2hex(Math.floor(255 * Math.random()));
	var b = rgb2hex(Math.floor(255 * Math.random()));
	var color = "#" + r + g + b;
	var invColor = findInverseColor(color);
	ballColor = color;
	document.getElementById("game").style.backgroundColor = invColor;
}

function findInverseColor(hex){
	var color = hex2rgb(hex);
	color = rgbInverse(color[0], color[1], color[2]);
	color = rgb2hex(color);
	return color;
}

function hex2rgb(hex){
	hex = hex.replace(/[^0-9A-F]/gi, '');
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);
	var rgb = [r, g, b];
	return(rgb);
}

function rgbInverse(r, g, b){
	rhex = rgb2hex(255 - r);
	ghex = rgb2hex(255 - g);
	bhex = rgb2hex(255 - b);
	return "#" + rhex + ghex + bhex;
}

function rgb2hex(rgb){
	var hex = rgb.toString(16);
	if(hex.length < 2){
		hex = "0" + hex;
	}
	return hex;
}
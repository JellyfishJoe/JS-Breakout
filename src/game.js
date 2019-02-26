const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 15;

let ballRadius = 10;

let dx = 1;
let dy = -2;

//paddle
const paddleHeight = 10;
const paddleWidth = 75;
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

let bricks = [];
for(c = 0; c < colCount; c++){
	bricks[c] = [];
	for(r = 0; r < rowCount; r++){
		bricks[c][r] = {x:0, y:0};
	}
}

var ballColor = "red";

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
	//changeColors();
	drawBall();
	drawPaddle();
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

	//paddle collision
	if (x + dx < ballRadius || x + dx > canvas.width - ballRadius){
		dx = -dx;
	}

	if(y + dy < ballRadius){
		dy = -dy;
	}else if(y + dy > canvas.height - ballRadius){
		if(x > paddleX && x < paddleX + paddleWidth){
			if(y = y - paddleHeight){
				dy = -dy;
				changeColors();
			}
		}else{
			alert("Game Over");
		}
	}

	if(x + dx < ballRadius || x + dx  > canvas.width - ballRadius){
		dx = -dx;
		changeColors();
	}

	if(y + dy < ballRadius || y + dy > canvas.height - ballRadius){
		dy = -dy;
		changeColors();
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
			let brickX = (c * (brickWidth + brickPadding) + brickOffsetLeft);
			let brickY = (r * (brickHeight + brickPadding) + brickOffsetTop);
			bricks[c][r].x = 0;
			bricks[c][r].y = 0;
			ctx.beginPath();
			ctx.fillStyle = ballColor;
			ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
			ctx.closePath();
		}
	}
}

setInterval(gameLoop, 10);

function changeColors(){
	var r = rgb2hex(Math.floor(255 * Math.random()));
	var g = rgb2hex(Math.floor(255 * Math.random()));
	var b = rgb2hex(Math.floor(255 * Math.random()));
	var color = "#" + r + g + b;
	var invColor = findInverseColor(color);
	ballColor = color;
	console.log(invColor);
	//console.log(document.getElementById("game").style.backgroundColor);
	document.getElementById("game").style.backgroundColor = invColor;
}

function findInverseColor(hex){
	console.log("hex = " + hex);
	var color = hex2rgb(hex);
	//console.log("color = " + color);
	color = rgbInverse(color[0], color[1], color[2]);
	color = rgb2hex(color);
	return color;
}

function hex2rgb(hex){
	//var hex = '#fefefe';
	//console.log("hex again = " + hex);
	hex = hex.replace(/[^0-9A-F]/gi, '');
	//console.log("new hex = " + hex);
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);
	//console.log(`r = ${r}, g = ${g}, b = ${b}`);
	var rgb = [r, g, b];
	//console.log(rgb);
	return(rgb);
}

function rgbInverse(r, g, b){
	rhex = rgb2hex(255 - r);
	ghex = rgb2hex(255 - g);
	bhex = rgb2hex(255 - b);
	return "#" + rhex + ghex + bhex;
}

function rgb2hex(rgb){
	//console.log(rgb);
	var hex = rgb.toString(16);
	if(hex.length < 2){
		hex = "0" + hex;
	}
	return hex;
}
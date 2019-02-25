const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 15;

let ballRadius = 10;

let dx = 1;
let dy = -2;

function drawBall(){
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function gameLoop(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();

	if(x + dx < ballRadius || x + dx  > canvas.width - ballRadius){
		dx = -dx;
	}

	if(y + dy < ballRadius || y + dy > canvas.height - ballRadius){
		dy = -dy;
	}

	x += dx;
	y += dy;
}

setInterval(gameLoop, 10);

function changeColors(){
	var r = rgb2hex(Math.random(0, 255));
	var g = rgb2hex(Math.random(0, 255));
	var b = rgb2hex(Math.random(0, 255));
	var hex = "#" + r + g + b;
	findInverseColor(hex);

}

function findInverseColor(hex){
	var color = hex2rgb(hex);
	color = rgbInverse(color);
	color = rgb2hex(color);
	return color;
}

function hex2rgb(hex){
	var hex = '#fefefe';
	hex = hex.replace(/[^0-9A-F]/gi, '')
	console.log(hex);
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);
	console.log(`r = ${r}, g = ${g}, b = ${b}`);
	console.log(rgbInverse(r, g, b));
}

function rgbInverse(r, g, b){
	rhex = rgb2hex(255 - r);
	ghex = rgb2hex(255 - g);
	bhex = rgb2hex(255 - b);
	return "#" + r + g + b;
}

function rgb2hex(rgb){
	var hex = rgb.toString(16);
	console.log(hex);
	if(hex.length < 2){
		hex = "0" + hex;
	}
	return hex;
}
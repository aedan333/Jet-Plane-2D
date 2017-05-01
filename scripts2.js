var canvas;
var ctx;
var timer;
var posX = 0;
var posY = 0;
var square = new Image();
square.src = "Chic-plane.png";
var squareWidth = 75;
var squareHeight = 75;
var airport = new Image();
airport.src = "Basic-Airport.png";
var airportWidth = 124;
var airportHeight = 124;
var posX2 = 1242;
var posY2 = 538;


function init(){
	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	
	timer=setInterval(draw, 10);

	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

};

window.addEventListener('keydown', function(event){

	switch(event.keyCode){
		case 38:
			posY -= 10;
			break;
		case 40:
			posY += 10;
			break;
		case 37:
			posX -= 10;
			break;
		case 39:
			posX += 10;
			break;
	}

});

function draw(){ 
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(airport, posX2, posY2, airportWidth, airportHeight); 
	ctx.drawImage(square, posX, posY, squareWidth, squareHeight);
}
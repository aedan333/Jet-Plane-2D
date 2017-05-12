var canvas;
var ctx;
var timer;

var squareImage = new Image();
squareImage.src = "Chic-plane.png";

var square = {
	img: squareImage,
	width: 75,
	height: 75,
	x: 0,
	y: 0,
}

var airportImage = new Image();
airportImage.src = "Basic-Airport.png";

var airport = {
	img: airportImage,
	width: 124,
	height: 124,
	x: 1242,
	y: 538
};

var gooseImage = new Image();
gooseImage.src = "Goose_sm.png";


function goose(){
	this.img = gooseImage;
	this.width = 40;
	this.height = 29;
	this.x = 1242;
	this.y = 0;
};

var geese = [];


function init(){
	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

	var gooseA = new goose();
	gooseA.y = randomYPosition();
	geese.push(gooseA);

	setInterval(makeAGoose,1100);
	
	timer = setInterval(draw, 10);

  	//console.log(ctx.canvas.height);

};

window.addEventListener('keydown', function(event){

	switch(event.keyCode){
		case 38:
			square.y -= 10;
			break;
		case 40:
			square.y += 10;
			break;
		case 37:
			square.x -= 10;
			break;
		case 39:
			square.x += 10;
			break;
	}

});

function draw(){ 
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(let i = 0;i < geese.length; i++){
		geese[i].x -=1;
		ctx.drawImage(geese[i].img, geese[i].x, geese[i].y, geese[i].width, geese[i].height);
		if(geese[i].x + geese[i].width < 0){
			geese.splice(i,1);
		}
		if(detectCollision(square,geese[i])){
			clearInterval(timer);
			window.location = 'lost.html';	
		} 
	}

	ctx.drawImage(airport.img, airport.x, airport.y, airport.width, airport.height); 
	ctx.drawImage(square.img, square.x, square.y, square.width, square.height);

	
	//CHECK IF THE PLANE HAS TOUCHED THE AIRPORT
	if(detectCollision(square,airport)){
		clearInterval(timer);
		window.location = 'levelup.html';	
	} 
}

function makeAGoose(){
	var newGoose = new goose();
	newGoose.y = randomYPosition();
	geese.push(newGoose);
}

function randomYPosition(){
	return Math.floor(Math.random() * ctx.canvas.height);
}

function detectCollision(object1, object2){
	if (object1.x < object2.x + object2.width &&
   object1.x + object1.width > object2.x &&
   object1.y < object2.y + object2.height &&
   object1.height + object1.y > object2.y) {
	    return true;
	}
};




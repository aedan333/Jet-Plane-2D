var canvas;
var ctx;
var timer;
var flyingKeys = false;
var airplaneDamage = 0;
var maxCollisions = 100;
var currentLevel = 1;
var nextLevel = 2;

var passengers = {
	
	happiness: 2000,
	maxHappiness: 2000,
	
	casualties: 0,
	maxCasualties: 4,
}

var planeImage = new Image();
planeImage.src = "graphics/chic-plane_sm.png";

var airplane = {
	img: planeImage,
	width: 75,
	height: 75,
	x: 0,
	y: 0,
}

var airportImage = new Image();
airportImage.src = "graphics/Basic-Airport.png";

var airport = {
	img: airportImage,
	width: 124,
	height: 124,
	x: 1242,
	y: 538
};

var xBorderImage = new Image();
xBorderImage.src = "graphics/x-border.png";

var xborder1 = {
	img: xBorderImage,
	width: 6,
	height: 3000,
	x: 1366,
	y: 0
};

var yBorderImage = new Image();
yBorderImage.src = "graphics/y-border.png";

var yBorderBottom = {
	img: yBorderImage,
	width: 3000,
	height: 6,
	x: 0,
	y: 660
};

var yBorderTop = {
	img: yBorderImage,
	width: 3000,
	height: 6,
	x: 0,
	y: -6
};

var gooseImage = new Image();
gooseImage.src = "graphics/Goose_sm.png";

function goose(){
	this.img = gooseImage;
	this.width = 40;
	this.height = 29;
	this.x = 1242;
	this.y = 0;
	this.speed = 1;
};

var geese = [];


var stormImage = new Image();
stormImage.src = "graphics/Storm.png";

function storm(){
	this.img = stormImage;
	this.width = 153;
	this.height = 108;
	this.x = 1242;
	this.y = 0;
	this.strength = 1;
	this.isStorm = true;
	this.speed = 1;

};

var storms = [];


var missileImage = new Image();
missileImage.src = "graphics/missile_sm.png";

function missile(){
	this.img = missileImage;
	this.width = 83;
	this.height = 30;
	this.x = 1242;
	this.y = 0;
	this.isMissile = true;
	this.speed = 5;
};

var missiles = [];


function init(level){
	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

	var gooseA = new goose();
	gooseA.y = randomYPosition();
	geese.push(gooseA);


	nextLevel = level + 1;
	currentLevel = level;

	let gooseTimerLength = 10000;
	let stormTimerLength = 3000;

	if(level === 2) gooseTimerLength = 5000;
	if(level === 3) gooseTimerLength = 2000;
	if(level === 4){
		planeImage.src = "graphics/ww2-smalljet_sm.png";
		setInterval(makeAMissile,7000);
	}

	setInterval(makeAGoose,gooseTimerLength);

	setInterval(makeAStorm,stormTimerLength);
	
	timer = setInterval(draw, 10);
	setInterval(domRedraw,500);

  	//console.log(ctx.canvas.height);

};


window.addEventListener('resize',function(event){
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

});

window.addEventListener('keydown', function(event){

	switch(event.keyCode){
		case 38:
			airplane.y -= 10;
			break;
		case 40:
			airplane.y += 10;
			break;
		case 37:
			airplane.x -= 5;
			break;
		case 39:
			airplane.x += 10;
			break;
	}

	if(event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 39){
		flyingKeys = true;
	}

});

window.addEventListener('keyup', function(event){
	if(event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 39){
		flyingKeys = false;
	}
});

function domRedraw(){
	let happinessPercent = Math.floor(passengers.happiness/ passengers.maxHappiness * 100);
	let happinessColour = happinessPercent > 60 ? 'green' : happinessPercent > 50 ? 'yellow' : 'orange';  
	$('.happinessMeter--bar').css({width: happinessPercent + "%", backgroundColor: happinessColour});
	$('.happinessMeter--readout').text(happinessPercent + "%");
	$('.damageMeter').text(airplaneDamage/maxCollisions * 100 + "% damage");
	$('.casualtiesMeter').text(passengers.casualties + " of " + passengers.maxCasualties  + " passengers have died");
}



function draw(){ 
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(!flyingKeys){
		airplane.y += 1;
		passengers.happiness -= 1;
	}else{
		passengers.happiness += 1;
		if(passengers.happiness > passengers.maxHappiness) passengers.happiness = passengers.maxHappiness;
	}
	
	for(let i = 0;i < geese.length; i++){
		geese[i].x -=geese[i].speed;
		ctx.drawImage(geese[i].img, geese[i].x, geese[i].y, geese[i].width, geese[i].height);
		if(geese[i].x + geese[i].width < 0){
			geese.splice(i,1);
		}
		if(!geese[i].hasCollided && detectCollision(airplane,geese[i])){
			geese[i].hasCollided = true;
			if(geese[i].isMissile){
				clearInterval(timer);
				window.location = 'lost.html';
			}
			else if(geese[i].isStorm){
				airplaneDamage += Math.floor(30 * geese[i].strength);
				passengers.happiness -= 200;

				if(geese[i].strength > 0.5) passengers.casualties += 1;
				airplane.y+= 60

			} else{
				geese.splice(i,1);
				airplaneDamage +=50;
				passengers.happiness -= 200;
			}

			if(airplaneDamage >= maxCollisions){
				clearInterval(timer);
				window.location = 'lost.html';
			}
		} 
	}

	ctx.drawImage(airport.img, airport.x, airport.y, airport.width, airport.height); 
	ctx.drawImage(airport.img, airport.x, airport.y, airport.width, airport.height); 
	ctx.drawImage(xborder1.img, xborder1.x, xborder1.y, xborder1.width, xborder1.height);
	ctx.drawImage(yBorderTop.img, yBorderTop.x, yBorderTop.y, yBorderTop.width, yBorderTop.height);
	ctx.drawImage(yBorderBottom.img, yBorderBottom.x, window.innerHeight, yBorderBottom.width, yBorderBottom.height);
	ctx.drawImage(airplane.img, airplane.x, airplane.y, airplane.width, airplane.height);

	
	//CHECK IF THE PLANE HAS TOUCHED THE AIRPORT
	if(detectCollision(airplane,airport)){
		clearInterval(timer);
		window.location = 'level'+ nextLevel +'.html';	
	}

	//CHECK IF THE PLANE HAS TOUCHED THE BORDERS

	if(detectCollision(airplane,xborder1)){
		restartLevel();
	} 

	if(detectCollision(airplane,yBorderBottom)){
		restartLevel();	
	} 

	if(detectCollision(airplane,yBorderTop)){
		restartLevel();	
	} 
}

function restartLevel(){
	clearInterval(timer);
	window.location = 'level'+ currentLevel +'.html';
}

function makeAGoose(){
	var newGoose = new goose();
	newGoose.y = randomYPosition();
	geese.push(newGoose);
}

function makeAStorm(){
	var newStorm = new storm();
	newStorm.y = randomYPosition();
	newStorm.strength = Math.random();
	newStorm.width *= newStorm.strength;
	newStorm.height *= newStorm.strength;
	geese.push(newStorm);
}

function makeAMissile(){
	var newMissile = new missile();
	newMissile.y = randomYPosition();
	geese.push(newMissile);
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


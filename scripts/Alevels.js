var canvas;
var ctx;
var timer;
var flyingKeys = false;
var airplaneDamage = 0;
var maxCollisions = 100;
var currentLevel = 1;
var nextLevel = 2;
var maxCasualties = 1;

var passengers = {
	
	happiness: 2000,
	maxHappiness: 2000,
	
	casualties: 0,
	maxCasualties: 1,
}

var planeImage = new Image();
planeImage.src = "graphics/Frosty_jet.png";

var airplane = {
	img: planeImage,
	width: 95,
	height: 55,
	x: 0,
	y: 0,
}

var airportImage = new Image();
airportImage.src = "graphics/Snow_airport.png";

var airport = {
	img: airportImage,
	width: 324,
	height: 100,
	x: 1085,
	y: 675
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

var yBorderImageBtm = new Image();
yBorderImageBtm.src = "graphics/AARE_terrain.png";

var yBorderBottom = {
	img: yBorderImageBtm,
	width: 600,
	height: 10,
	x: 0,
	y: 700
};

var yBorderImage = new Image();
yBorderImage.src = "graphics/y-border.png";

var yBorderTop = {
	img: yBorderImage,
	width: 3000,
	height: 6,
	x: 0,
	y: -6
};

var enemyList = [];

var stormImage = new Image();
stormImage.src = "graphics/Mean Cloud.png";

function storm(speed){
	this.img = stormImage;
	this.width = 153;
	this.height = 108;
	this.x = 1242;
	this.y = 0;
	this.strength = 1;
	this.isStorm = true;
	this.speed = 1;

};


function init(level){
	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;


	var stormA = new storm();
	stormA.y = randomYPosition();
	enemyList.push(stormA);


	nextLevel = level + 1;
	currentLevel = level;

	let stormTimerLength = 3000;
	let sendStorms = true;
	let stormSpeed = 1;

	if(level === 2) gooseTimerLength = 5000;
	if(level === 3) gooseTimerLength = 2000;
	if(level === 4){
		planeImage.src = "graphics/One_eng_jet.png";
		gooseTimerLength = 1500;
		sendMissiles = true;
	}
	if(level === 5){
		planeImage.src = "graphics/One_eng_jet.png";
		gooseTimerLength = 1100;
		gooseSpeed = 2;
		sendMissiles = true;
		missileTimerLength = 5000;
	}
	if(level === 6){
		planeImage.src = "graphics/One_eng_jet.png";
		gooseTimerLength = 900;
		gooseSpeed = 2;
		sendMissiles = true;
		missileTimerLength = 4200;
		missileSpeed = 7;
	}
	if(level === 7){
		planeImage.src = "graphics/One_eng_jet.png";
		gooseTimerLength = 900;
		gooseSpeed = 3;
		sendMissiles = true;
		missileTimerLength = 3800;
		missileSpeed = 9;
	}

	if(level === 8){
		planeImage.src = "graphics/One_eng_jet.png";
		gooseTimerLength = 900;
		gooseSpeed = 3;
		sendMissiles = true;
		missileTimerLength = 3800;
		missileSpeed = 9;
	}

	if(sendStorms) setInterval(makeAStorm(stormSpeed),stormTimerLength);

	timer = setInterval(draw, 10);
	setInterval(domRedraw,500);

  	//console.log(ctx.canvas.height);

};




window.addEventListener('resize',function(event){
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.outerHeight;

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
	$('.casualtiesMeter').text(passengers.casualties + " of " + passengers.maxCasualties  + " crew have died");
}

if(passengers.casualties === 1){
	function youlose(){
		clearInterval(timer);
		window.location = 'lost.html';
}
}

if(happiness === 0){
	function youlose(){
	clearInterval(timer);
	window.location = 'lost.html';
}
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
	
	
	for(let i = 0;i < enemyList.length; i++){
		enemyList[i].x -=enemyList[i].speed;
		ctx.drawImage(enemyList[i].img, enemyList[i].x, enemyList[i].y, enemyList[i].width, enemyList[i].height);
		if(enemyList[i].x + enemyList[i].width < 0){
			enemyList.splice(i,1);
		}
		if(!enemyList[i].hasCollided && detectCollision(airplane,enemyList[i])){
			enemyList[i].hasCollided = true;
			if(enemyList[i].isMissile){
				youlose();
			}
			else if(enemyList[i].isStorm){
				airplaneDamage += Math.floor(30 * enemyList[i].strength);
				passengers.happiness -= 200;

				if(enemyList[i].strength > 0.5) passengers.casualties += 1;
				airplane.y+= 60

			} else{
				enemyList.splice(i,1);
				airplaneDamage +=50;
				passengers.happiness -= 200;
			}

			if(airplaneDamage >= maxCollisions){
				youlose();
			}
		} 
	}

	ctx.drawImage(airport.img, airport.x, airport.y, airport.width, airport.height); 
	ctx.drawImage(airport.img, airport.x, airport.y, airport.width, airport.height); 
	ctx.drawImage(xborder1.img, xborder1.x, xborder1.y, xborder1.width, xborder1.height);
	ctx.drawImage(yBorderTop.img, yBorderTop.x, yBorderTop.y, yBorderTop.width, yBorderTop.height);
	ctx.drawImage(yBorderBottom.img, yBorderBottom.x, window.outerHeight, yBorderBottom.width, yBorderBottom.height);
	ctx.drawImage(airplane.img, airplane.x, airplane.y, airplane.width, airplane.height);

	
	//CHECK IF THE PLANE HAS TOUCHED THE AIRPORT
	if(detectCollision(airplane,airport)){
		clearInterval(timer);
		if(nextLevel === 2) window.location = 'index.html';
		else window.location = 'index.html';	
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
	window.location = 'aare'+ currentLevel +'.html';
}
function makeAStorm(speed){
	var newStorm = new storm();
	newStorm.y = randomYPosition();
	newStorm.x = randomXPosition();
	newStorm.strength = Math.random();
	newStorm.width *= newStorm.strength;
	newStorm.height *= newStorm.strength;
	newStorm.speed = speed;
	enemyList.push(newStorm);
}

function randomYPosition(){
	return Math.floor(Math.random() * ctx.canvas.height);
}

function randomXPosition(){
	return Math.floor(Math.random() * ctx.canvas.width);
}

function detectCollision(object1, object2){
	if (object1.x < object2.x + object2.width &&
   object1.x + object1.width > object2.x &&
   object1.y < object2.y + object2.height &&
   object1.height + object1.y > object2.y) {
	    return true;
	}
};

function youlose(){
	clearInterval(timer);
	window.location = 'Alost.html';
}

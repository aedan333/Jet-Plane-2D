var canvas;
var ctx;
var timer;
var gooseTimer;
var stormTimer;
var domTimer;
var flyingKeys = false;
var airplaneDamage = 0;
var maxCollisions = 100;
var maxCasualties = 2;
var currentSpeed = 0

let params = new URLSearchParams(document.location.search.substring(1));
let planeName = params.get("plane");
let timeOfDay = params.get("time");
let airportName = params.get("airport");

var planeImage = new Image();
planeImage.src = "./graphics/"+ planeName +".png";

var timesOfDay = {
	"0800":{
		skyColour: "#d4a7ef"
	},
	"1200":{
		skyColour: "#b5d0ff"
	},
	"1700":{
		skyColour: "#ffbb68"
	},
	"2400":{
		skyColour: "#000611"
	}
}

var planes={
	"172": {
		width: 90,
		height: 40,
		maxCasualties: 4,
		maxSpeed: 160
	},
	"747": {
		width: 300,
		height: 75,
		maxCasualties: 410,
		maxSpeed: 495
	},
	"A318": {
		width: 200,
		height: 80,
		maxCasualties: 110,
		maxSpeed: 470
	},
	"p51": {
		width: 100,
		height: 40,
		maxCasualties: 1,
		maxSpeed: 380
	},
	"f22": {
		width: 200,
		height: 50,
		maxCasualties: 1,
		maxSpeed: 1300
	},
	"c130": {
		width: 200,
		height: 80,
		maxCasualties: 97,
		maxSpeed: 320
	}
}

var airports={
	"intlairport": {
		width: 512,
		height: 133,
	},
	"smallairport": {
		width: 479,
		height: 100,
	},
	"aareairport": {
		width: 479,
		height: 100,
	},
	"stmaarten": {
		width: 600,
		height: 100,
	}
}

var maxSpeed = planes[planeName].maxSpeed;

var airplane = {
	img: planeImage,
	width: planes[planeName].width,
	height: planes[planeName].height,
	x: 0,
	y: 0,
}

var passengers = {
	
	happiness: 2000,
	maxHappiness: 2000,
	
	casualties: 0,
	maxCasualties: planes[planeName].maxCasualties,
}

var airportImage = new Image();
airportImage.src = "./graphics/"+ airportName +".png";

var airport = {
	img: airportImage,
	width: airports[airportName].width,
	height: airports[airportName].height,
	x: 0,
	y: window.innerHeight
};



var enemyList = [];

var gooseImage = new Image();
gooseImage.src = "graphics/Goose2.png";

function goose(speed){
	this.img = gooseImage;
	this.width = 40;
	this.height = 29;
	this.x = 1242;
	this.y = 0;
	this.speed = 1;
};

var geese = [];


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

var missileImage = new Image();
missileImage.src = "graphics/Missile2.png";

function missile(speed){
	this.img = missileImage;
	this.width = 150;
	this.height = 30;
	this.x = 1242;
	this.y = 0;
	this.isMissile = true;
	this.speed = 5;
};


function init(level){
	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

	var gooseA = new goose();
	gooseA.y = randomYPosition();
	enemyList.push(gooseA);

	var stormA = new storm();
	stormA.y = randomYPosition();
	enemyList.push(stormA);

	let gooseTimerLength = 8000;
	let sendGeese = true;
	let gooseSpeed = 1;
	
	let stormTimerLength = 9000;
	let sendStorms = true;
	let stormSpeed = 1;

	gooseTimer = setInterval(function(){makeAGoose(gooseSpeed)},gooseTimerLength);
	stormTimer = setInterval(function(){makeAStorm(stormSpeed)},stormTimerLength);

	timer = setInterval(draw, 10);
	domTimer = setInterval(domRedraw,500);

  	adjustScreenSize();

  	airplane.y = ctx.canvas.height - airplane.height - 10;

  	document.querySelector('#canvas').style.backgroundColor = timesOfDay[timeOfDay].skyColour;

};

function adjustScreenSize(){
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;
  	airport.y = ctx.canvas.height - airport.height;
  	airport.x = 0;
}


window.addEventListener('resize',function(event){
	adjustScreenSize();
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
			currentSpeed -= maxSpeed / 3;
			if (currentSpeed < 0) currentSpeed = 0;
			//airplane.x -= 5;
			break;
		case 39:
			currentSpeed += maxSpeed / 3;
			if(currentSpeed > maxSpeed) maxSpeed;
			//airplane.x += 10;
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

if(passengers.casualties === planes[planeName].maxCasualties){
	youlose();
}

if(passengers.happiness === 0){
	youlose();
}



function draw(){ 
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(!flyingKeys){
		//airplane.y += 1;
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

	airplane.x += currentSpeed * 0.01;

	ctx.drawImage(airport.img, airport.x, airport.y, airport.width, airport.height); 
	ctx.drawImage(airport.img, airport.x, airport.y, airport.width, airport.height); 
	ctx.drawImage(airplane.img, airplane.x, airplane.y, airplane.width, airplane.height);


	//CHECK IF THE PLANE HAS TOUCHED THE BORDERS

}

function restartLevel(){
	clearInterval(timer);
	window.location = 'level'+ currentLevel +'.html';
}

function makeAGoose(speed){
	console.log('makeAGoose');
	var newGoose = new goose();
	newGoose.y = randomYPosition();
	newGoose.x = ctx.canvas.width;
	newGoose.speed = speed;
	newGoose.hasCollided = false;
	enemyList.push(newGoose);
}

function makeAStorm(speed){
	var newStorm = new storm();
	newStorm.y = randomYPosition();
	newStorm.x =  ctx.canvas.width;
	newStorm.strength = Math.random();
	newStorm.width *= newStorm.strength;
	newStorm.height *= newStorm.strength;
	newStorm.speed = speed;
	newStorm.hasCollided = false;
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
	window.location = 'crash.html';
}

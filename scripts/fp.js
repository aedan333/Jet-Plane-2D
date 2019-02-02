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
planeImage.src = "graphics/One_eng_jet.png";

var airplane = {
	img: planeImage,
	width: 75,
	height: 75,
	x: 0,
	y: 0,
}

var airportImage = new Image();
airportImage.src = "graphics/Banana_fields_airport.png";

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



var enemyList = [];


var gooseImage = new Image();
gooseImage.src = "graphics/Goose2.png";

function goose(speed){
	this.img = gooseImage;
	this.width = 40;
	this.height = 29;
	this.x = 1242;
	this.y = 0;
};

var geese = [];

var missileImage = new Image();
missileImage.src = "graphics/Missile2.png";

function missile(speed){
	this.img = missileImage;
	this.width = 150;
	this.height = 30;
	this.x = 1242;
	this.y = 0;
};

var missiles = [];


function init(Level){
	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

	setInterval(makeAGoose,900);
	setInterval(makeAMissile,2800);
	
	timer = setInterval(draw, 10);
	setInterval(domRedraw,500);

  	//console.log(ctx.canvas.height);

  	window.addEventListener('resize',function(event){
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

});

};

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

		moveEnemies(geese,3);
		moveEnemies(missiles,10);

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
	ctx.drawImage(yBorderBottom.img, yBorderBottom.x, window.innerHeight, yBorderBottom.width, yBorderBottom.height);
	ctx.drawImage(airplane.img, airplane.x, airplane.y, airplane.width, airplane.height);

	//CHECK IF THE PLANE HAS TOUCHED THE AIRPORT
	if(detectCollision(airplane,airport)){
		clearInterval(timer);
		if(nextLevel === 3) window.location = 'winner.html';
		else window.location = 'level'+ nextLevel +'.html';	
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
	window.location = 'fighterpilot'+ currentLevel +'.html';
}


function moveEnemies(enemyList,speed){
	for(let i = 0;i < enemyList.length; i++){
		enemyList[i].x -=speed;
		ctx.drawImage(enemyList[i].img, enemyList[i].x, enemyList[i].y, enemyList[i].width, enemyList[i].height);
		if(enemyList[i].x + enemyList[i].width < 0){
			enemyList.splice(i,1);
		}
		
	}
}


function makeAGoose(){
	var newGoose = new goose();
	newGoose.y = randomYPosition();
	newGoose.x = randomXPosition();
	geese.push(newGoose);
}

function makeAMissile(){
	var newMissile = new missile();
	newMissile.y = randomYPosition();
	missiles.push(newMissile);
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
	window.location = 'fighterpilot1.html';
}

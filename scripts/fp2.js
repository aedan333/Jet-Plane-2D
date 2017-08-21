var canvas;
var ctx;
var timer;

var squareImage = new Image();
squareImage.src = "f-14.png";

var square = {
	img: squareImage,
	width: 100,
	height: 100,
	x: 0,
	y: 0,
}

var airportImage = new Image();
airportImage.src = "Regular-Airport.png";

var airport = {
	img: airportImage,
	width: 124,
	height: 124,
	x: 1242,
	y: 538
};

var catImage = new Image();
catImage.src = "x-border.png";

var cat = {
	img: catImage,
	width: 6,
	height: 3000,
	x: 1366,
	y: 0
};

var cat2Image = new Image();
cat2Image.src = "x-border2.png";

var cat2 = {
	img: cat2Image,
	width: 6,
	height: 3000,
	x: -6,
	y: 0
};

var catsImage = new Image();
catsImage.src = "y-border.png";

var cats = {
	img: catsImage,
	width: 3000,
	height: 6,
	x: 0,
	y: 660
};


var cats2Image = new Image();
cats2Image.src = "y-border2.png";

var cats2 = {
	img: catsImage,
	width: 3000,
	height: 6,
	x: 0,
	y: -6
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

var missileImage = new Image();
missileImage.src = "missile_sm.png";

function missile(){
	this.img = missileImage;
	this.width = 83;
	this.height = 30;
	this.x = 1242;
	this.y = 0;
};

var missiles = [];

var badplaneImage = new Image();
badplaneImage.src = "collision-plane2_sm.png";

function badplane(){
	this.img = badplaneImage;
	this.width = 383;
	this.height = 330;
	this.x = 1242;
	this.y = 0;
};

var badplanes = [];


function init(){
	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

	setInterval(makeAGoose,800);
	setInterval(makeAMissile,2800);
	setInterval(makeABadplane,6800);
	
	timer = setInterval(draw, 10);

  	//console.log(ctx.canvas.height);

};

window.addEventListener('keydown', function(event){

	switch(event.keyCode){
		case 38:
			square.y -= 20;
			break;
		case 40:
			square.y += 20;
			break;
		case 37:
			square.x -= 20;
			break;
		case 39:
			square.x += 20;
			break;
	}

});

function draw(){ 
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	moveEnemies(geese,3);
	moveEnemies(missiles,10);
	moveEnemies(badplanes,8);

	ctx.drawImage(airport.img, airport.x, airport.y, airport.width, airport.height); 
	ctx.drawImage(cat.img, cat.x, cat.y, cat.width, cat.height);
	ctx.drawImage(cat2.img, cat2.x, cat2.y, cat2.width, cat2.height);
	ctx.drawImage(cats.img, cats.x, cats.y, cats.width, cats.height);
	ctx.drawImage(cats2.img, cats2.x, cats2.y, cats2.width, cats2.height);
	ctx.drawImage(square.img, square.x, square.y, square.width, square.height);
	
	//CHECK IF THE PLANE HAS TOUCHED THE AIRPORT
	if(detectCollision(square,airport)){
		clearInterval(timer);
		window.location = 'fp3.html';	
	} 


	//CHECK IF THE PLANE HAS TOUCHED THE BORDERS

	if(detectCollision(square,cat)){
		clearInterval(timer);
		window.location = 'fp2.html';	
	} 

	if(detectCollision(square,cat2)){
		clearInterval(timer);
		window.location = 'fp2.html';	
	} 

	if(detectCollision(square,cats)){
		clearInterval(timer);
		window.location = 'fp2.html';	
	} 

	if(detectCollision(square,cats2)){
		clearInterval(timer);
		window.location = 'fp2.html';	
	} 



}



function moveEnemies(enemyList,speed){
	for(let i = 0;i < enemyList.length; i++){
		enemyList[i].x -=speed;
		ctx.drawImage(enemyList[i].img, enemyList[i].x, enemyList[i].y, enemyList[i].width, enemyList[i].height);
		if(enemyList[i].x + enemyList[i].width < 0){
			enemyList.splice(i,1);
		}
		if(detectCollision(square,enemyList[i])){
			clearInterval(timer);
			window.location = 'fp2.html';	
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

function makeABadplane(){
	var newBadplane = new badplane();
	newBadplane.y = randomYPosition();
	badplanes.push(newBadplane);
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

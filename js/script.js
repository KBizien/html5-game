// déclaration des variables

var KEYCODE_SPACE = 32, KEYCODE_UP = 38, KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39;		
var canvas, stage, leftHeld, rightHeld, supports, rocks, perso, persoCenter;
var keyDown = false, play=true, dir="right";
var imgLoaded = 0, velocityY = 0, velocityX = 0;
var jumping = false, inAir = true, gravity = 2;
var imgPerso = new Image();
var supportLength = [960, 200, 500, 50, 100, 75];
var supportX = [0, 400, 500, 300, 400, 650];
var supportY = [500, 300, 400, 200, 100, 100];
//register key functions
document.onkeydown=handleKeyDown;
document.onkeyup=handleKeyUp;


// fonction déclarative de démarrage 
function init() {
	//find canvas and load images, wait for last image to load
	canvas = document.getElementById("demoCanvas");
	// create a new stage and point it at our canvas
	stage = new createjs.Stage(canvas);

	imgPerso.src = "img/perso.png";
	imgPerso.onload = handleImageLoad;
	imgPerso.onerror = handleImageError;
}

// fonction qui compte les images loader et amorce le jeu
function handleImageLoad(e) {
	imgLoaded++;
	if(imgLoaded == 1){
		startGame();
	}
}
// fonction alerte des erreurs, images mal loader
function handleImageError(e) {
	console.log("Error Loading Image : " + e.target.src);
}


// fonction début de jeu
function startGame(){

	perso = new Perso(imgPerso);
	perso.x = 180;
	perso.y = 490;
	stage.addChild(perso);
	rocks = new Array();
	supports = new Array();
	for(i=0; i < supportLength.length; i++){
		var support = new Support(supportLength[i],20);
		supports.push(support);
		stage.addChild(support);
		support.x = supportX[i];
		support.y = supportY[i];
	}
	for(j=0; j < 5; j++){
		var rock = new Rock();
		rocks.push(rock);
		stage.addChild(rock);
		resetRocks(rock);
	}

	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(30);
	stage.update();
}

// fonction qui écoute les events de la scène et permet les animations
function tick() {
	persoCenter = perso.y-40;
	if (play){
		velocityY+=gravity; // gravité
		if (inAir){
			perso.y+=velocityY;
		}
		if (velocityY>15){ // limite la velocitye de chute
			velocityY=15;
		}
		for(i=0; i < supports.length; i++){ // boucle sur chaque support
			// test si le perso est en constact d'un support
			if (perso.y >= supports[i].y && perso.y<= (supports[i].y+supports[i].height) && perso.x > supports[i].x && perso.x<(supports[i].x+supports[i].width)){
			 	perso.y=supports[i].y;
				velocityY=0;	
				jumping = false;
			 	inAir = false;
			 	break
			}
			else {
				inAir = true;
			}
		}	

		for(j=0; j < rocks.length; j++){ //move crates
			var rck = rocks[j];
			rck.x-=rck.speed;
			rck.rotation+=3;
			if (rck.x<0){
				resetRocks(rck);
			}
			if (collisionPerso (rck.x, rck.y, 20)){//collision detect hero with each falling box
				gameOver();
			}
		}

		if (leftHeld){
			velocityX = -10;	
		}
		if (rightHeld){
			velocityX = 10;
		}
		if(leftHeld && keyDown==false && inAir==false){
			perso.gotoAndPlay("walk_h");
			keyDown=true;
		}
		if(rightHeld && keyDown==false &&  inAir==false){
			perso.gotoAndPlay("walk");
			keyDown=true;
		}
		if (dir=="left" && keyDown==false && inAir==false){
			perso.gotoAndStop("idle_h");
		}
		if (dir=="right" && keyDown==false && inAir==false){
			perso.gotoAndStop("idle");
		}	
		if (perso.y>600 || perso.x<0 || perso.x>960){
			gameOver();
		}
		perso.x+=velocityX;			
		velocityX=velocityX*0.5; // inertie pour que le perso s'arrête aux relachements des touches
	}
	stage.update();
}

// fonction qui détecte les collisions entre les rochers et le personnage
function collisionPerso (xPos, yPos, Radius){
	var distX = xPos - perso.x;
	var distY = yPos - persoCenter;
	var distR = Radius + 20;
	if (distX * distX + distY * distY <= distR * distR){
		return true;	
	}
}

// fonction partie perdu
function gameOver(){
 	gameTxt = new createjs.Text("Game Over\n\n", "36px Arial", "#000");
 	gameTxt.text += "Clicker pour jouer à nouveau.";
 	gameTxt.textAlign = "center";
	gameTxt.x = canvas.width / 2;
 	gameTxt.y = canvas.height / 4;
 	stage.addChild(gameTxt);
 	end();
	canvas.onclick = handleClick;
}
// fonction fin du jeu
function end(){
 	play=false;
 	var l = rocks.length;
 	for (var i=0; i<l; i++) {
 		var r = rocks[i];
 		resetRocks(r);
 	}
 	perso.visible=false;
 	stage.update();
}
// fonction jeu remis à 0 au click
function handleClick() {
 	canvas.onclick = null;
 	perso.visible=true;
 	perso.x = 180;
 	perso.y = 490;
 	stage.removeChild(gameTxt);	
	play=true;
}

// fonction gérant les sauts du perso
function jump(){
	if (jumping == false && inAir == false){
		if (dir=="right"){
			perso.gotoAndStop("jump");
		}
		else{
			perso.gotoAndStop("jump_h");
		}
		perso.y -= 20;
		velocityY = -25;
		jumping = true;
		keyDown=false;
	}
}

// fonction qui remet à 0 les rochers
function resetRocks(rck) {
	rck.y = canvas.height * Math.random()|0;
	rck.x = 960 + Math.random()*500;
	rck.speed = (Math.random()*5)+8;
}

//fonctions contrôle du clavier
function handleKeyDown(e) {
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:	
			leftHeld = true;
			dir="left";
			break;

		case KEYCODE_RIGHT:
			rightHeld = true;
			dir="right";
			break;

		case KEYCODE_SPACE:
			jump();
			break;
	}
}
function handleKeyUp(e) {
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:
			leftHeld = false;
			keyDown=false;
			perso.gotoAndStop("idle_h");
			break;

		case KEYCODE_RIGHT:
			rightHeld = false;
			keyDown=false;
			perso.gotoAndStop("idle");
			break;
	}
}
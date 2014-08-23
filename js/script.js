// déclaration des variables

var KEYCODE_SPACE = 32, KEYCODE_UP = 38, KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39;		
var canvas, stage, leftHeld, rightHeld, supports, perso;
var keyDown = false, dir="right";
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

	supports = new Array();
	for(i=0; i < supportLength.length; i++){
		var support = new Support(supportLength[i],20);
		supports.push(support);
		stage.addChild(support);
		support.x = supportX[i];
		support.y = supportY[i];
	}

	createjs.Ticker.on("tick", tick);
	createjs.Ticker.setFPS(30);
	stage.update();
}

// fonction qui écoute les events de la scène et permet les animations
function tick() {
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
	perso.x+=velocityX;			
	velocityX=velocityX*0.5; // inertie pour que le perso s'arrête aux relachements des touches
	stage.update();
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
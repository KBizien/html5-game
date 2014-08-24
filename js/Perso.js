(function() {
	function Perso(imgPerso) {
 		this.initialize(imgPerso);
	}
	Perso.prototype = new createjs.Sprite();
	Perso.prototype.Animation_initialize = Perso.prototype.initialize;
	Perso.prototype.initialize = function(imgPerso) {
		this.Animation_initialize();
		var spriteSheet  = new createjs.SpriteSheet({
			images: [imgPerso],
			frames: {width: 77, height: 85, regX: 38.5, regY: 80},
			animations: {
				walk: [1, 8, "walk"], 
				idle: [0, 0, "idle"], 
				jump: [6, 6, "jump"],
				down: [9, 9, "down"],
			}
		});
		createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);
		this.Animation_initialize(spriteSheet);
		this.gotoAndStop("idle");
	}
	window.Perso = Perso;
}());
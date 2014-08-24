(function() {
	function Rock() {
  		this.initialize();
	}
	Rock.prototype = new createjs.Container();
	Rock.prototype.img = new Image();
	// constructor:
	Rock.prototype.Container_initialize = Rock.prototype.initialize;	//unique to avoid overiding base class
	
	Rock.prototype.initialize = function() {
		this.Container_initialize();
		var bmp = new createjs.Bitmap("img/pierre.png");
		bmp.x=-20;
		bmp.y=-20;
		this.addChild(bmp);
	}
	window.Rock = Rock;
}());
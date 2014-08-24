(function() {
	function Support(w,h) {
		this.width = w;
		this.height = h;
  		this.initialize();
	}
	Support.prototype = new createjs.Container();
	Support.prototype.supportBody = null;
	//Support.prototype.supportGraphic = null;
	Support.prototype.Container_initialize = Support.prototype.initialize;
	Support.prototype.initialize = function() {
		this.Container_initialize();
		this.supportBody = new createjs.Shape();
		//this.supportGraphic = new createjs.Shape();
		this.addChild(this.supportBody);
		//this.addChild(this.supportGraphic);
		this.makeShape();
	}
	Support.prototype.makeShape = function() {
		var realSupport = this.supportBody.graphics;
		realSupport.beginFill("#000").rect(0,0,this.width,this.height);
	}
	window.Support = Support;
}());
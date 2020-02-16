class Level{
	constructor(options) {
		//this.options = options;
		this.game = options.game;
		this.class = 'Level';
		this.canvas = options.canvas;
		this.context = options.context;
		this.background = options.background;
		this.width = options.width;
		this.height = options.height;
		this.viewPortX = this.width/2 - this.canvas.width/2
		this.viewPortY = this.height - this.canvas.height;
		this.destination = options.destination;
		this.destVel = options.destVel;
		this.destData = options.spaceData.frames[0].frame;
		this.spaceImage = options.spaceImage;
		this.states = ['onWin', 'onWallCol', 'onLose'];
		this.state;
		this.yOffset = 0;
		this.xOffset = 0;
		this.backXOffset = 0;
		this.backYOffset = 0;
		this.tilt = 0;
		this.walls = [];
		this.ships = [];
		this.players = [];
		this.meteors = [];
		this.pressedKeys = {};
		this.mapScale;
		
		// set mapScale to 1/4 of smallest dimention
		if (this.width > this.height) {
			if (this.canvas.width > this.canvas.height) {
				this.mapScale = this.width / (this.canvas.height/3);
			}else{
				this.mapScale = this.width / (this.canvas.width/3);
			}
		}else{
			if (this.canvas.width > this.canvas.height) {
				this.mapScale = this.height / (this.canvas.height/3);
			}else{
				this.mapScale = this.height / (this.canvas.width/3);
			}
		}
			
		const level = this;
		document.addEventListener('keydown', function(event) {
			if (event.defaultPrevented) {
				return;
			}
			let key = event.key || event.keyCode;
			level.pressedKeys[key] = true;
		});
		document.addEventListener('keyup', function(event) {
			if (event.defaultPrevented) {
				return;
			}
			let key = event.key || event.keyCode;
			level.pressedKeys[key] = false;

		});
	}
	
	refreshVars(objList) {
		this.walls = [];
		this.ships = [];
		this.players = [];
		this.meteors = [];
		for (let obj of objList) {
			if (obj.class == "Wall") {
				this.walls.push(obj);
			}
			if (obj.class == "Ship") {
				this.ships.push(obj);
			}
			if (obj.class == "Player") {
				this.players.push(obj);
			}
			if (obj.class == "Meteor") {
				this.meteors.push(obj);
			}
		}
	}
	
	refreshCanvas(oldW, oldH) {
		console.log("refresh");
		// renew position of viewports
		if (this.ships[0].state == "onGround"){
			this.viewPortX = this.width/2 - this.canvas.width/2;
			this.viewPortY = this.height - this.canvas.height;
		}else {
			console.log("this?");
			
			this.viewPortX -= oldW/2;
			this.viewPortY -= oldH/2;
		}
		
		
		// renew mapScale to 1/4 of smallest dimention
		if (this.width > this.height) {
			if (this.canvas.width > this.canvas.height) {
				this.mapScale = this.width / (this.canvas.height/3);
			}else{
				this.mapScale = this.width / (this.canvas.width/3);
			}
		}else{
			if (this.canvas.width > this.canvas.height) {
				this.mapScale = this.height / (this.canvas.height/3);
			}else{
				this.mapScale = this.height / (this.canvas.width/3);
			}
		}
	}

	update(dt, objList) {
		
		// create object lists
		if (this.ships.length == 0 && this.players.length == 0) {
			for (let obj of objList) {
				if (obj.class == "Wall") {
					this.walls.push(obj);
				}
				if (obj.class == "Ship") {
					this.ships.push(obj);
				}
				if (obj.class == "Player") {
					this.players.push(obj);
				}
				if (obj.class == "Meteor") {
					this.meteors.push(obj);
				}
			}
		}
		
		if (this.ships[0].state == 'onLaunch') {
			let ship = this.ships[0];
			this.backYOffset = (this.backYOffset - ship.alignSpeed) ;
		}
		
		if (this.ships[0].state == 'inSpace') {
			let ship = this.ships[0];	
			
			// x and y offset to control background scroll
			this.backXOffset = this.backXOffset - Math.sin(ship.tilt)*ship.velocity;
								 
			this.backYOffset = this.backYOffset + Math.cos(ship.tilt)*ship.velocity; 
			
			// x and y offset to control obj movement
			this.xOffset = Math.sin(ship.tilt)*ship.velocity;
			this.yOffset = -Math.cos(ship.tilt)*ship.velocity;

			this.viewPortX += this.xOffset;
			this.viewPortY += this.yOffset;

			// Calculate position of nose of ship 
			// set nose x to shipX and nose y to shipY
			let tilt = (Math.PI*2 - ship.tilt);
			let shipX = ship.x + ship.width/2;
			let shipY = ship.y;
			
			let shipRad = Math.sqrt(Math.pow(this.canvas.width/2 - shipX, 2) + Math.pow(this.canvas.height/2 - shipY, 2));
			if (ship.y > this.canvas.height/2) {
				var shipXOffset = Math.sin(tilt)*shipRad;
				var shipYOffset = Math.cos(tilt)*shipRad;
			}else{
				var shipXOffset = -Math.sin(tilt)*shipRad;
				var shipYOffset = -Math.cos(tilt)*shipRad;
			}
			shipX = this.viewPortX + this.canvas.width/2 + shipXOffset;
			shipY = this.viewPortY + this.canvas.height/2 + shipYOffset;
			
			let radius = Math.sqrt(Math.pow(this.destination.x - shipX,  2) + Math.pow(this.destination.y - shipY, 2));
			
			// Collision with border
			if (shipX < 0 || shipX > this.width ||
			   shipY < 0 || shipY > this.height) {
				this.state = 'onLose';
				this.ships[0].statesVal = 'static';
			}
			// Collision with destination
			if (radius < this.destination.radius) {
				this.state = 'onWin';
			}
			
			// Move destination
			this.destination.x += this.destVel.x;
			this.destination.y += this.destVel.y;
			
			// bounce destination
			if (this.destination.x < 0 ||
			   this.destination.x > this.width){
				this.destVel.x = -this.destVel.x;
			}
			if (this.destination.y < 0 ||
			   this.destination.y > this.height){
				this.destVel.y = -this.destVel.y;
			}
			
		}
		if (this.state == 'onWin') {	
			this.ships[0].state = 'onWin';
			if (this.pressedKeys[' ']) {
				this.game.level += 1;
				this.game.reset = true;
			}
		}
		if (this.state == 'onWallCol') {
			this.ships[0].statesVal = 'crash';
			this.state = 'onLose';
		}
		if (this.state == 'onLose') {
			this.ships[0].state = 'onLose';
			if (this.pressedKeys[' ']) {
				this.game.reset = true;
			}
		}
	}
	
	drawBackground(xOffset, yOffset, background, scale) {
		let x = ((xOffset %(background.width*scale)) +background.width*scale) %(background.width*scale);
		let y = ((yOffset %(background.height*scale)) +background.height*scale) %(background.height*scale);
		
		var i = -1;
		while (x + i*background.width*scale < this.canvas.width) {
			var j = -1;
			while (y + j*background.height*scale < this.canvas.width) {
				this.context.drawImage(background, x + i*background.width*scale, y + j*background.height*scale, background.width*scale, background.height*scale);
				j += 1;
			}
			i += 1;
		}
	}
	
	render() {
		// Draw background
		this.drawBackground(this.backXOffset/8, this.backYOffset/8, this.background[0], 1);
		this.drawBackground(this.backXOffset/4, this.backYOffset/4, this.background[1], 1);
		this.drawBackground(this.backXOffset/2, this.backYOffset/2, this.background[2], 1);
				
		//Draw boundary
		this.context.globalAlpha = 0.5;
		//left
		this.context.fillStyle = '#000000';
		this.context.fillRect(-this.viewPortX-this.canvas.width, -this.viewPortY-this.canvas.height, this.canvas.width, this.height+this.canvas.width*2);
		//right
		this.context.fillRect(this.width-this.viewPortX, -this.viewPortY-this.canvas.height, this.canvas.width, this.height+this.canvas.width*2);
		//top
		this.context.fillRect(-this.viewPortX-this.canvas.width, -this.viewPortY-this.canvas.height, this.width*this.canvas.width*2, this.canvas.height);
		//bottom
		this.context.fillRect(-this.viewPortX-this.canvas.width,this.height-this.viewPortY, this.width*this.canvas.width*2, this.canvas.height);
		this.context.globalAlpha = 1;
		
		//Draw destination
		this.context.drawImage(this.spaceImage, this.destData.x, this.destData.y, this.destData.w, this.destData.h, this.destination.x-this.destination.radius-this.viewPortX, this.destination.y-this.destination.radius-this.viewPortY, this.destination.radius*2, this.destination.radius*2);
		
		// Draw boost meter
		this.context.globalAlpha = 0.5;
		this.context.fillStyle = '#55ddff';
		this.context.fillRect(20, this.canvas.height/2 -this.players[0].boostMeter/2, 10, this.players[0].boostMeter);
		this.context.fillRect(this.canvas.width-30, this.canvas.height/2 -this.players[1].boostMeter/2, 10, this.players[1].boostMeter);
		this.context.globalAlpha = 1;
		
		
		
		// Draw map
		let scale = this.mapScale;
		this.context.globalAlpha = 0.5;
		
		this.context.fillStyle = '#888888';
		this.context.fillRect(this.canvas.width-this.width/scale-20, 20, this.width/scale, this.height/scale);
		
		// Draw view port on map
		this.context.fillStyle = '#000000';
		this.context.fillRect(this.canvas.width-this.width/scale-20+this.viewPortX/scale, 20+this.viewPortY/scale, this.canvas.width/scale, this.canvas.height/scale);
		
		// Draw destination on map
		this.context.beginPath();
		this.context.arc(this.canvas.width-this.width/scale-20+this.destination.x/scale, 20+this.destination.y/scale, this.destination.radius/scale, 0, 2*Math.PI);
		this.context.fillStyle = '#ffffff';
		this.context.fill();
		
		// Draw walls on map
		this.context.fillStyle = '#ff5555';
		for (let wall of this.walls) {
			this.context.fillRect(this.canvas.width-this.width/scale-20 + (this.viewPortX + wall.x)/this.mapScale, 20 + (this.viewPortY + wall.y)/this.mapScale, wall.width/this.mapScale, wall.height/this.mapScale);
		}
		
		// Draw meteors on map
		for (let meteor of this.meteors) {
			this.context.beginPath();
			this.context.arc(this.canvas.width-this.width/scale-20+(meteor.levelX+meteor.radius)/scale, 20+(meteor.levelY+meteor.radius)/scale, meteor.radius/scale, 0, 2*Math.PI);
			this.context.fillStyle = '#ff5555';
			this.context.fill();
		}
		this.context.globalAlpha = 1;
	}
}
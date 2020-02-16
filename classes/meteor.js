// Example Call:
//const meteor1 = new Meteor({
//	canvas: this.canvas,
//	context: this.context,
//	levelX: 1500,
//	levelY: 1500,
//	width: 400,
//	velocity: {x: -2, y: -1},
//	moving: false,
//	bounce: true,
//	spaceData: this.spaceData,
//	spaceImage: this.spaceImage,
//	states: {small: 3, medium: 2, large: 1}
//});

class Meteor{
	constructor(options){
		this.class = 'Meteor';
		this.canvas = options.canvas;
		this.context = options.context;
		this.x = false;
		this.y = false;
		this.levelX = options.levelX;
		this.levelY = options.levelY;
		this.width = options.width;
		this.height = options.width;
		this.velocity = options.velocity;
		this.moving = options.moving;
		this.bounce = options.bounce;
		this.spaceData = options.spaceData.frames;
		this.spaceImage = options.spaceImage;
		this.states = options.states;
		this.sprite;
		this.radius = this.width/2;
		this.level = false;
		this.ships = [];
		this.testX = 0;
		this.testY = 0;
		this.kill = false;
		
		// select sprite based on size
		if (this.width > 180) {
			this.sprite = this.spaceData[this.states.large].frame;
		}else if (this.width <= 60) {
			this.sprite = this.spaceData[this.states.small].frame;
		}else {
			this.sprite = this.spaceData[this.states.medium].frame;
		}
	}
	
	refreshVars(objList) {
		// unnecesarry
	}
	
	update(dt, objList) {	
		
		if (this.level == false) {
			for (let obj of objList) {
				if (obj.class == "Level") {
					this.level = obj;
				}
				if (obj.class == "Ship") {
					this.ships.push(obj);
				}
			}
		}
		// make meteor live and print on screen
		if (this.level.viewPortX < this.levelX+this.width && 
			this.level.viewPortX + this.canvas.width > this.levelX && 
			this.level.viewPortY < this.levelY+this.height && 
			this.level.viewPortY + this.canvas.height > this.levelY && 
			this.ships[0].state == 'inSpace') {
			this.moving = true;
		}
		if (this.moving){
			this.levelX += this.velocity.x;
			this.levelY += this.velocity.y;			
		}
		this.x = this.levelX - this.level.viewPortX;
		this.y = this.levelY - this.level.viewPortY;
		
		// Meteor moved out of bound?
		// Bounce:
		if (this.bounce) {
			if ((this.levelX + this.width/2 > this.level.width && this.velocity.x > 0) || (this.levelX + this.width/2 < 0 && this.velocity.x < 0)) {
				this.velocity.x = -this.velocity.x;
			}
			if ((this.levelY + this.height/2 > this.level.height && this.velocity.y > 0) || (this.levelY + this.height/2 < 0 && this.velocity.y < 0)) {
				this.velocity.y = -this.velocity.y;
			}
		}
		
		// Destroy:
		if (this.levelX > this.level.width || this.levelX + this.width < 0
		   || this.levelY > this.level.height || this.levelY + this.height < 0) {
			this.kill = true;
		}
	
		// pin point ship position for collision
		// create two points to detect collision
		// shipX1 and shipY1 is in the front center of ship
		// shipX2 and shipY2 is in the back center of ship
		let ship = this.ships[0];
		let tilt = (Math.PI*2 - ship.tilt);
		
		let boundingRad = ship.width/2;
		let shipX1 = ship.x + ship.width/2;
		let shipY1 = ship.y + boundingRad;
		let shipX2 = ship.x + ship.width/2;
		let shipY2 = ship.y + ship.height - boundingRad;

		let shipRad1 = Math.sqrt(Math.pow(this.canvas.width/2 - shipX1, 2) + Math.pow(this.canvas.height/2 - shipY1, 2));
		let shipRad2 = Math.sqrt(Math.pow(this.canvas.width/2 - shipX2, 2) + Math.pow(this.canvas.height/2 - shipY2, 2));
		if (shipY1 > this.canvas.height/2) {
			var shipXOffset1 = Math.sin(tilt)*shipRad1;
			var shipYOffset1 = Math.cos(tilt)*shipRad1;
		}else{
			var shipXOffset1 = -Math.sin(tilt)*shipRad1;
			var shipYOffset1 = -Math.cos(tilt)*shipRad1;
		}
		if (shipY2 > this.canvas.height/2) {
			var shipXOffset2 = Math.sin(tilt)*shipRad2;
			var shipYOffset2 = Math.cos(tilt)*shipRad2;
		}else{
			var shipXOffset2 = -Math.sin(tilt)*shipRad2;
			var shipYOffset2 = -Math.cos(tilt)*shipRad2;
		}

		shipX1 = this.canvas.width/2 + shipXOffset1;
		shipY1 = this.canvas.height/2 + shipYOffset1;
		shipX2 = this.canvas.width/2 + shipXOffset2;
		shipY2 = this.canvas.height/2 + shipYOffset2;

		let radius1 = Math.sqrt(Math.pow(this.x+this.width/2 - shipX1,  2) + Math.pow(this.y+this.height/2 - shipY1, 2));
		let radius2 = Math.sqrt(Math.pow(this.x+this.width/2 - shipX2,  2) + Math.pow(this.y+this.height/2 - shipY2, 2));
		
		// if either points collide with ship go to onLose
		if ((radius1 < this.radius + boundingRad ||
		   radius2 < this.radius +boundingRad) && this.ships[0].state == 'inSpace') {
			this.level.state = 'onLose';
			this.ships[0].statesVal = 'crash';
		}
	}
	
	render() {
		// Draw meteor
		this.context.drawImage(this.spaceImage, this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h, this.x, this.y, this.width, this.height);
	}
}
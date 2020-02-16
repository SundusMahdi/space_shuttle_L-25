class Wall{
	constructor(options){
		this.class = 'Wall';
		this.canvas = options.canvas;
		this.context = options.context;
		this.x = options.x;
		this.y = options.y;
		this.width = options.width;
		this.height = options.height;
		this.floor = (options.floor == null)? false: options.floor;
		this.level = false;
		this.ships = [];
		this.shipX = 0;
		this.shipY = 0;
		this.initUpdate = true;
	}
	
	refreshVars() {
		// unnecessary
	}
	
	update(dt, objList){
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
		
		if (this.initUpdate) {
			this.initUpdate = false;
			this.levelX = this.level.viewPortX + this.x;
			this.levelY = this.level.viewPortY + this.y;
			
			if (this.floor) {
				this.levelX = 0;
				this.width = this.level.width;
				console.log(this.width);
			}
		}
		
		// use level coordinates tp allow for canvas resize
		this.x = this.levelX - this.level.viewPortX;
		this.y = this.levelY - this.level.viewPortY;
		console.log(this.width);
		
		if (this.ships[0].state == 'inSpace'){
			this.x = this.x-this.level.xOffset;
			this.y = this.y-this.level.yOffset;
			
			// Collision with ship
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
			
			this.shipX = shipX1;
			this.shipY = shipY1;
			
			let shipRad = this.ships[0].width/2;
			if ((this.shipX + shipRad > this.x && 
				this.shipX - shipRad < this.x+this.width) &&
				(this.shipY + shipRad > this.y && 
				this.shipY - shipRad < this.y+this.height)) {
				this.level.state = 'onLose';
				this.ships[0].statesVal = 'crash';
			}
		}	
	}
	
	render(){
			this.context.fillStyle = '#bbbbbb';
			this.context.fillRect(this.x, this.y, this.width, this.height);
	}
}
class Player{
	constructor(options){
		this.class = 'Player';
		this.canvas = options.canvas;
		this.context = options.context;
		this.x = options.x;
		this.y = options.y;
		this.width = options.width;
		this.height = options.height;
		this.anchor = options.anchor;
		this.colour = options.colour;
		this.trailColour = options.trailColour;
		this.controls = options.controls;
		this.charData = options.charData;
		this.charImage = options.charImage;
		this.states = options.states;
		this.state = 'onGround';
		this.pressedKeys = {};
		this.velocity = 5;
		this.gravity = 0;
		this.oldX;
		this.oldY;
		this.elevation = 0.57;
		this.elevationSpeed = 2;
		this.walls = [];
		this.ships = [];
		this.level = false;
		this.iterator;
		this.frameI = 0;
		this.sprite = 0;
		this.statesVal = 'static';
		this.boost = 5;
		this.boostMeter = 100;
		this.initUpdate = true;
	
		
		const player = this;
		document.addEventListener('keydown', function(event) {
			if (event.defaultPrevented) {
				return;
			}
			let key = event.key || event.keyCode;
			player.pressedKeys[key] = true;
			
		});
		document.addEventListener('keyup', function(event) {
			if (event.defaultPrevented) {
				return;
			}
			let key = event.key || event.keyCode;
			player.pressedKeys[key] = false;
		});
	}
	
	refreshVars(objList) {
		this.walls = [];
		this.ships = [];
		for (let obj of objList) {
			if (obj.class == "Wall") {
				this.walls.push(obj);
			}
			if (obj.class == "Ship") {
				this.ships.push(obj);
			}
		}
	}
	
	
	update(dt, objList){
		if (this.ships.length == 0) {
			for (let obj of objList) {
				if (obj.class == "Wall") {
					this.walls.push(obj);
				}
				if (obj.class == "Ship") {
					this.ships.push(obj);
				}
				if (obj.class == "Level") {
					this.level = obj;
				}
			}
			this.iterator = this.ships[0].height*this.elevation/this.elevationSpeed;
		}
		
		if (this.initUpdate) {
			this.initUpdate = false;
			this.levelX = this.level.viewPortX + this.x;
			this.levelY = this.level.viewPortY + this.y;
		}
		
		// use level coordinates tp allow for canvas resize
		this.x = this.levelX - this.level.viewPortX;
		this.y = this.levelY - this.level.viewPortY;
		
		switch (this.state) {
			case 'onGround':
				// TODO: allow diagonal movement for both players at the same time 
				this.oldX = this.x;
				this.oldY = this.y;

				if (this.pressedKeys[this.controls.lt]) {
					this.x -= this.velocity;
					this.statesVal = 'moving';
				}
				if (this.pressedKeys[this.controls.rt]) {
					this.x += this.velocity;
					this.statesVal = 'moving';
				}
				if (this.x == this.oldX) {
					this.statesVal = 'static';
				}
				if (this.pressedKeys[this.controls.up]) {
					if (this.x == this.oldX) {
						this.statesVal = 'happy';
					}
				}
				if (!this.pressedKeys[this.controls.up] && this.statesVal == 'happy') {
					this.statesVal = 'static';
				}


				this.gravity += 1;
				this.y += this.gravity;

				// Collisions:
				// Collisions with canvas
				if (this.x < 0) {
					this.x = 0;
				}
				if ((this.x+this.width) > this.canvas.width) {
					this.x = this.canvas.width-this.width;
				}
				if (this.y < 0) {
					this.y = 0;
				}
				if ((this.y+this.height) > this.canvas.height) {
					this.y = this.canvas.height-this.height;
				}

				// Collisions with walls
				let inchBackX = (this.x - this.oldX)/this.velocity;
				let inchBackY = (this.y - this.oldY)/this.velocity;

				for (let wall of this.walls) {
					while (this.x <= wall.x+wall.width && this.x+this.width >= wall.x &&
						  this.y <= wall.y+wall.height && this.y+this.height >= wall.y) {
						if (!(this.oldX <= wall.x+wall.width && this.oldX+this.width >= wall.x)){
							this.x -= inchBackX;
						}
						else if (!(this.oldY <= wall.y+wall.height && this.oldY+this.height >= wall.y)) {
							this.y -= inchBackY;
							this.gravity = 0;
						}
						// if wall moved towards player, not the other way around
						else{
							if (this.x <= wall.x+wall.width && this.x+this.width >= wall.x) {
								if (this.y + this.height/2 < wall.y + wall.height/2) {
									while (this.y + this.height >= wall.y) {
										this.y -= 1;
									}
								}else{
									while (this.y <= wall.y + wall.height) {
										this.y += 1;
									}
								}
							}else{
								if(this.x + this.width/2 < wall.x +wall.width/2) {
									while(this.x + this.width >= wall.x) {
										this.x -= 1;
									}
								}else{
									while (this.x <= wall.x + wall.width) {
										this.x += 1;
									}
								}
							}
						}
					}
				}
				break;
				
			case 'elevate':
				this.statesVal = 'static';
				if (this.y+this.height > this.ships[0].y+(1-this.elevation)*this.ships[0].height) {
					this.y -= this.elevationSpeed;
				}else{
					this.state = 'onShip';
				}
				break;
				
			case 'onShip':
				this.oldX = this.x;
				this.oldY = this.y;

				if (this.pressedKeys[this.controls.lt]) {
					this.x -= this.velocity;
					this.statesVal = 'moving';
				}
				if (this.pressedKeys[this.controls.rt]) {
					this.x += this.velocity;
					this.statesVal = 'moving';
				}
				if (this.pressedKeys[this.controls.up] && this.ships[0].state == 'inSpace' && this.level.state != 'onLose') {
					if (this.boostMeter > 0){
						this.ships[0].velocity += this.boost;
						this.ships[0].statesVal = 'boost';
						this.boost = 0;
						this.boostMeter -= 1;
					}else if (this.boost == 0){
						this.boost = 5;
						this.ships[0].velocity -= this.boost;
						this.ships[0].statesVal = 'moving';
					}
				}
				if (!this.pressedKeys[this.controls.up] && this.ships[0].state == 'inSpace' && this.level.state != 'onLose') {
					if (this.boost == 0) {
						this.boost = 5;
						this.ships[0].velocity -= this.boost;
						this.ships[0].statesVal = 'moving';
					}
				}
				if (this.x == this.oldX) {
					this.statesVal = 'static';
				}
				
				// Wave arms
				if (this.pressedKeys[this.controls.up] && this.ships[0].state != 'inSpace' && this.ships[0].state != 'onLose') {
					if (this.x == this.oldX) {
						this.statesVal = 'happy';
					}
				}
				if (!this.pressedKeys[this.controls.up] && this.statesVal == 'happy') {
					this.statesVal = 'static';
				}
				
				this.gravity += 1;
				
				for (let ship of this.ships) {
					if (this.x < ship.x-10) {
						this.x = ship.x-10;
					}
					if (this.x+this.width > ship.x+ship.width+10) {
						this.x = ship.x+ship.width-this.width+10;
					}
				}
				
				
				break;
		}
		
		// update levelX and levelY with new found x and y
		if (this.ships[0].state == 'inSpace') {
			this.levelX = this.level.viewPortX + this.x + this.level.xOffset;
			this.levelY = this.level.viewPortY + this.y + this.level.yOffset;
		}else{
			this.levelX = this.level.viewPortX + this.x;
			this.levelY = this.level.viewPortY + this.y;
		}
		
		if (this.level.state == 'onLose') {
				this.statesVal = 'sad'; 
		}
	}
	
	render(){
			// swap sprites based on fps
			let fps = this.states[this.statesVal].fps;
			let frameCount = 100/fps;
			let frames = this.states[this.statesVal].frames;
			if (this.sprite >= frames.length) {
				this.sprite = 0;
			}
		
			if (this.frameI > frameCount) {
				this.frameI = 0;
				let frames = this.states[this.statesVal].frames;
				this.sprite += 1;
				if (this.sprite >= frames.length) {
					this.sprite = 0;
				}
			}else{
				this.frameI += 1;
			}		
		
		// if ship is loaded
		if(this.ships.length>0) {
			// Rotate canvas to match player with ship
			let ship = this.ships[0]  
			let rotation = (ship.tilt %(2*Math.PI) + (2*Math.PI)) %(2*Math.PI);
			this.context.translate(this.canvas.width/2, this.canvas.height/2);
			this.context.rotate(rotation);
			
//			this.context.fillStyle = this.colour;
//			this.context.fillRect(this.x-this.canvas.width/2, this.y-this.canvas.height/2, this.width, this.height);
			
			// draw player running left
			if (this.pressedKeys[this.controls.lt] && !this.pressedKeys[this.controls.rt]) {
				this.context.scale(-1, 1);
				let frame = this.states[this.statesVal].frames[this.sprite];
				let x = this.charData.frames[frame].frame.x;
				let y = this.charData.frames[frame].frame.y;
				let w = this.charData.frames[frame].frame.w;
				let h = this.charData.frames[frame].frame.h;
				this.context.drawImage(this.charImage, x, y, w, h, -this.x +this.canvas.width/2-50, this.y-this.canvas.height/2, this.width, this.height);	

				this.context.scale(-1, 1);
				
			// draw player running right
			}else{
				let frame = this.states[this.statesVal].frames[this.sprite];
				let x = this.charData.frames[frame].frame.x;
				let y = this.charData.frames[frame].frame.y;
				let w = this.charData.frames[frame].frame.w;
				let h = this.charData.frames[frame].frame.h;
				this.context.drawImage(this.charImage, x, y, w, h, this.x-this.canvas.width/2, this.y-this.canvas.height/2, this.width, this.height);	
			}
			// Rotate canvas back 
			this.context.rotate(-rotation);
			this.context.translate(-this.canvas.width/2, -this.canvas.height/2);
		}
	}
}
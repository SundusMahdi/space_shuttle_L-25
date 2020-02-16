class Ship{
	constructor(options) {
		this.class = 'Ship';
		this.canvas = options.canvas;
		this.context = options.context;
		this.x = options.x;
		this.y = options.y;
		this.width = options.width;
		this.height = options.height;
		this.velocity = options.velocity;
		this.yAnchor = options.yAnchor;
		this.shipData = options.shipData;
		this.shipImage = options.shipImage;
		this.states = options.states;
		this.state = 'onGround';
		this.players = [];
		this.level = false;
		this.walls = [];
		this.tilt = 0;
		this.alignSpeed = 2;
		this.frameI = 0;
		this.sprite = 0;
		this.statesVal = 'onGround';
		this.initUpdate = true;
		this.levelX;
		this.levelY;
	}
	
	refreshVars(objList) {
		this.players = [];
		this.walls = [];
		this.level = [];
		for (let obj of objList) {
			if (obj.class == "Player") {
				this.players.push(obj);
			}
			if (obj.class == "Wall") {
				this.walls.push(obj);
			}
			if (obj.class == "Level") {
				this.level = obj;
			}
		}
	}
	
	update(dt, objList){
		if (this.players.length == 0) {
			for (let obj of objList) {
				if (obj.class == "Player") {
					this.players.push(obj);
				}
				if (obj.class == "Wall") {
					this.walls.push(obj);
				}
				if (obj.class == "Level") {
					this.level = obj;
				}
			}
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
				this.statesVal = 'onGround';
				
				// check for elevate state
				for (let player of this.players) {
					if (player.x > this.x && player.x+player.width < this.x+this.width
					   && player.state == 'onGround') {
						player.state = 'elevate';
					}
				}
				let launch = true;
				for (let player of this.players){
					if (player.state != "onShip") {
						launch = false;
					}
				}
				if (launch) {
					this.state = "onLaunch";
				}
				break;
				
			case 'onLaunch':
				this.statesVal = 'static';
				// Move everything on canvas up as yViewPort shifts down
				if (this.y+this.height/2 > this.canvas.height/2) {
					this.level.viewPortY += this.alignSpeed;
					for (let player of this.players) {
						player.y -= this.alignSpeed;
					}
					for (let wall of this.walls) {
						// if wall is drawn on canvas
						if (wall.x < this.canvas.width && 
							wall.x+wall.width > 0 && 
							wall.y < this.canvas.height && 
							wall.y+wall.height > 0) {
							wall.y -= this.alignSpeed;
						}
					}
					this.y -=this.alignSpeed;
				}
				else{
					this.state = "inSpace";
					this.statesVal = 'moving';
				}
				break;
				
			case 'inSpace':
				//this.tilt = 0;
				this.levelX += this.level.xOffset;
				this.levelY += this.level.yOffset;
				for (let player of this.players){
					this.tilt += (((player.x+(player.width/2))-(this.x+this.width/2))/1000);
					this.tilt = (this.tilt %(2*Math.PI) + (2*Math.PI)) %(2*Math.PI);
				}
				break;
				
			case 'onWin':
				this.statesVal = 'static';
				break;
				
			case 'onLose':
				break;
		}
	}
	
	render() {
		this.context.translate(this.canvas.width/2, this.canvas.height/2);
		this.context.rotate(this.tilt);
		
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
		
		let frame = this.states[this.statesVal].frames[this.sprite];
		let x = this.shipData.frames[frame].frame.x;
		let y = this.shipData.frames[frame].frame.y;
		let w = this.shipData.frames[frame].frame.w;
		let h = this.shipData.frames[frame].frame.h;
		
		this.context.drawImage(this.shipImage, x, y, w, h, this.x-this.canvas.width/2-45, this.y-this.canvas.height/2-17, this.width+90, this.height+100);
//		this.context.fillStyle = '#9999bb';
//		this.context.fillRect(this.x-this.canvas.width/2,this.y-this.canvas.height/2, this.width, this.height);

		this.context.rotate(-this.tilt);	
		this.context.translate(-this.canvas.width/2, -this.canvas.height/2);
	}
}
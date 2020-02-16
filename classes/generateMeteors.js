class GenerateMeteors{
	constructor(options) {
		this.class = 'GenerateMeteors';
		this.game = options.game;
		this.canvas = options.canvas;
		this.context = options.context;
		this.count = options.count;
		this.interval = options.interval;
		this.maxVel = options.maxVel;
		this.bounce = options.bounce;
		this.spaceData = options.spaceData;
		this.spaceImage = options.spaceImage;
		this.states = options.states;
		this.timer = 0;
		this.sizeLimit = {min: 20, max: 400};
		this.level = false;
		this.ships = [];
	}
	
	refreshVars(objList) {
		// Referesh unecessary
	}
	
	update(dt, objList) {
		this.timer += 1;
		
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
		if (this.ships[0].state == 'inSpace') {
			if (this.timer >= this.interval) {
				this.timer = 0;
				// set count to -1 for infinite spawn, otherwise stop at count == 0
				if (this.count != 0) {
					this.count -= 1;
				
					var xVel = Math.random()*this.maxVel*2 - this.maxVel;
					var yVel = Math.random()*this.maxVel*2 - this.maxVel;
					var width = this.sizeLimit.min + Math.random()
						 * (this.sizeLimit.max-this.sizeLimit.min);
					var levelX; 
					var levelY; 
					
					// place meteor on top, bottom, left or right of boundary 
					// depending on the highest velocity
					if (Math.abs(xVel) > Math.abs(yVel)) {
						if (xVel < 0) {
							levelX = this.level.width;
							levelY = Math.random()*(this.level.height - width);
						}else{
							levelX = -width;
							levelY = Math.random()*(this.level.height - width);
						}
					}else{
						if (yVel < 0) {
							levelY = this.level.height;
							levelX = Math.random()*(this.level.width - width);
						}else{
							levelY = -width;
							levelX = Math.random()*(this.level.width - width);
						}
					}
					// create meteor
					let meteor = new Meteor({
						canvas: this.canvas,
						context: this.context,
						levelX: levelX,
						levelY: levelY,
						width: width,
						velocity: {x: xVel, y: yVel},
						moving: true,
						bounce: this.bounce,
						spaceData: this.spaceData,
						spaceImage: this.spaceImage,
						states: {small: 3, medium: 2, large: 1}			
					});
					this.game.objects.push(meteor);
					this.game.refreshVars();
					
				}
			}
		}
	}
	
	render() {
		
	}
}

class DrawMsg {
	constructor(options) {
		this.class = 'DrawMsg';
		this.game = options.game;
		this.canvas = options.canvas;
		this.context = options.context;
		this.msgData = options.msgData.frames;
		this.msgImage = options.msgImage;
		this.tutorial = options.tutorial;
		this.msgStates = {crash:[0], goal:[1], level1:[2], 
						  level2:[3], level3:[4], level4:[5], 
						  level5:[6], level6:[7], level7:[8], 
						  level8:[9], level9:[10], level10:[11], 
						  lost:[12], space:[13], title:[14], 
						  tutorial_arrows:[15], tutorial_ko:[16], 
						  tutorial_wad:[17], win:[18]};
		this.msgLength = 400;
		this.msgLength2 = 400;
		this.ships = [];
		this.players = [];
	}
	
	// TODO: make refresh vars run once from constructor
	refreshVars() {
		// unnecessary
	}
	
//	refreshCanvas(canvas) {
//		this.canvas = canvas;
//		this.context = this.canvas.getContext("2d");
//	}
	
	update(dt, objList) {
		if (this.ships.length == 0) {
			for (let obj of objList) {
				if (obj.class == "Ship") {
					this.ships.push(obj);
				}
				if (obj.class == "Player") {
					this.players.push(obj);
				}
			}
		}
	}
	
	render() {
		// Draw tutorial and level msg
		if (this.ships[0].state == 'inSpace') {
			this.msgLength -= 10;
		}
		if (this.msgLength > 0) {
			if (this.msgLength2 - this.msgLength < 50) {
				this.context.globalAlpha = (this.msgLength2 - this.msgLength)/50;
			}
			else if (this.msgLength < 50) {
				this.context.globalAlpha = this.msgLength/50;
			}else{
				this.context.globalAlpha = 1;
			}
			this.msgLength -= 1;
			
			let level = 'level'+this.game.level;
			
			let frame = this.msgData[this.msgStates[level]].frame;
			this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - frame.w/2, 50, frame.w, frame.h);
			
			if (this.tutorial) {
				let frame = this.msgData[this.msgStates['goal']].frame;						  
				this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - frame.w/4, this.canvas.height/2-140, frame.w/2, frame.h/2);

				frame = this.msgData[this.msgStates['tutorial_ko']].frame;
				this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.players[0].x + this.players[0].width/2 - frame.w/4, this.canvas.height-frame.h/2-200, frame.w/2, frame.h/2);

				frame = this.msgData[this.msgStates['tutorial_wad']].frame;
				this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.players[1].x + this.players[0].width/2 - frame.w/4, this.canvas.height-frame.h/2-200, frame.w/2, frame.h/2);
			}
		}
		this.context.globalAlpha = 1;
		
		// Draw win and lose msg
		if (this.ships[0].statesVal == 'static' && this.ships[0].state == 'onLose') {
			let frame = this.msgData[this.msgStates['lost']].frame;						  
			this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - frame.w/4, 80, frame.w/2, frame.h/2);

			frame = this.msgData[this.msgStates['space']].frame;
			this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - frame.w/4, this.canvas.height-frame.h/2-80, frame.w/2, frame.h/2);
		}
		if (this.ships[0].statesVal == 'crash') {
			let frame = this.msgData[this.msgStates['crash']].frame;						  
			this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - frame.w/4, 80, frame.w/2, frame.h/2);

			frame = this.msgData[this.msgStates['space']].frame;
			this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - frame.w/4, this.canvas.height-frame.h/2-80, frame.w/2, frame.h/2);
		}
		if (this.ships[0].state == 'onWin') {
			let frame = this.msgData[this.msgStates['win']].frame;						  
			this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - frame.w/4, 80, frame.w/2, frame.h/2);

			frame = this.msgData[this.msgStates['space']].frame;
			this.context.drawImage(this.msgImage,frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - frame.w/4, this.canvas.height-frame.h/2-80, frame.w/2, frame.h/2);
		}
	}
}
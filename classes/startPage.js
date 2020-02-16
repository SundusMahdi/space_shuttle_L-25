// displays start pages then goes to level one 
class StartPage {
	constructor(options) {
		this.game = options.game;
		this.canvas = options.canvas;
		this.context = options.context;
		this.background = options.background;
		this.theoryImage = options.theoryImage;
		this.charData = options.charData;
		this.charImage = options.charImage;
		this.shipData = options.shipData;
		this.shipImage = options.shipImage;
		this.msgData = options.msgData;
		this.msgImage = options.msgImage;
		this.msgStates = {crash:[0], goal:[1], level1:[2], 
						  level2:[3], level3:[4], level4:[5], 
						  level5:[6], level6:[7], level7:[8], 
						  level8:[9], level9:[10], level10:[11], 
						  lost:[12], space:[13], title:[14], 
						  tutorial_arrows:[15], tutorial_ko:[16], 
						  tutorial_wad:[17], win:[18]};
		this.page = 1;
		this.maxPage = 1;
		this.nextLevel = false;
		this.initial = true;
		this.ships = [];
		this.players = [];
		this.frameI = 0
		this.fps = 10;
		this.sprites = {playerA: [18, 19], playerB: [8, 9], ship: [4, 5]};
		this.sprite = 0;
		
		// listen for space
		const startPage = this;
		document.addEventListener('keyup', function(event) {
			if (event.defaultPrevented) {
				return;
			}
			let key = event.key || event.keyCode;
			if (key == ' ') {
				startPage.page += 1;
				startPage.initial = true;
				if (startPage.page > startPage.maxPage) {
					startPage.page = startPage.maxPage;
					startPage.nextLevel = true;
				}
			}
			
		});
	}
	
	refreshVars() {
		// unnecessary
	}
	
	update(dt, objList) {
		if (this.ships.length <= 0) {
			for (let obj of objList) {
				if (obj.class == "Player") {
					this.players.push(obj);
				}
				if (obj.class == "Ship") {
					this.ships.push(obj);
				}
			}
		}
		
		if (this.nextLevel) {
			this.game.level = 1;
			this.game.reset = true;
		}
	}
	
	render() {
		if(this.page == 1) {
			// Draw background
			if (this.canvas.width >= this.canvas.height) {
				this.context.drawImage(this.background[0], 0, 0, this.background[0].width, this.canvas.height/this.canvas.width*this.background[0].width, 0, 0, this.canvas.width, this.canvas.height);
				this.context.drawImage(this.background[1], 0, 0, this.background[0].width, this.canvas.height/this.canvas.width*this.background[0].width, 0, 0, this.canvas.width, this.canvas.height);
			}else{
				this.context.drawImage(this.background[0], 0, 0, this.canvas.width/this.canvas.height*this.background[0].height, this.background[0].height, 0, 0, this.canvas.width, this.canvas.height);
				this.context.drawImage(this.background[1], 0, 0, this.canvas.width/this.canvas.height*this.background[0].height, this.background[0].height, 0, 0, this.canvas.width, this.canvas.height);
			}
			
			// Draw title and space
			let index = this.msgStates['title'];
			let frame = this.msgData.frames[index].frame;
			
			// Scale based on canvas aspect ratio 
			if ((this.canvas.width/this.canvas.height)+.5 > frame.w/frame.h) {
				let index = this.msgStates['title'];
				let frame = this.msgData.frames[index].frame;
				let height = this.canvas.height - this.canvas.height/4;
				let width = frame.w * height/frame.h;
				this.context.drawImage(this.msgImage, frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - width/2, 0, width, height);

				index = this.msgStates['space'];
				frame = this.msgData.frames[index].frame;
				width = width - 20;
				height = width * frame.h/frame.w;
				this.context.drawImage(this.msgImage,
									   frame.x, frame.y, frame.w, frame.h,
									   this.canvas.width/2 - width/2, this.canvas.height - height, width, height);

			}else{
				let index = this.msgStates['title'];
				let frame = this.msgData.frames[index].frame;
				let width = this.canvas.width;
				let height = frame.h * width / frame.w
				this.context.drawImage(this.msgImage, frame.x, frame.y, frame.w, frame.h, 0, 0, width, height);

				index = this.msgStates['space'];
				frame = this.msgData.frames[index].frame;
				width = width - 20;
				height = frame.h * width/frame.w;
				this.context.drawImage(this.msgImage,
									   frame.x, frame.y, frame.w, frame.h,
									   10, this.canvas.height - height, width, height);
			}
			
			// Draw character and ship sprites
			let frameCount = 100/this.fps;

			if (this.frameI > frameCount) {
				this.frameI = 0;
				this.sprite += 1;
				if (this.sprite >= 8) {
					this.sprite = 0;
				}
			}else{
				this.frameI += 1;
			}
			if (this.sprite >= 4){
				this.context.transform(1,.3,-.3,1, 90 *this.canvas.height/580, -90 * this.canvas.width/600);
	
			}else{
				this.context.transform(1,-.3,.3,1,-110 *this.canvas.height/580 ,90 *this.canvas.width/600);
			}
			
			// Draw playerA
			frame = this.charData.frames[this.sprites.playerA[this.sprite%2]].frame;
			let height = (this.canvas.height/5);
			let width = frame.w * height/frame.h;
			let shipH = this.canvas.height*0.75;
			
			this.context.drawImage(this.charImage, frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - shipH/16 - width/2, this.canvas.height/2 - height, width, height);
			
			// Draw playerB
			frame = this.charData.frames[this.sprites.playerB[this.sprite%2]].frame;
			this.context.drawImage(this.charImage, frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 + shipH/16 - width/2, this.canvas.height/2 - height, width, height);
			
			// Draw ship
			frame = this.shipData.frames[this.sprites.ship[this.sprite%2]].frame;
			height = shipH
			width = frame.w * (this.canvas.height*0.75)/frame.h + this.canvas.height/8;
			this.context.drawImage(this.shipImage, frame.x, frame.y, frame.w, frame.h, this.canvas.width/2 - width/2, this.canvas.height/2 - this.canvas.height/4, width, height);
			
			this.context.setTransform(1,0,0,1,0,0);
		}
	}
}
// TODO: kick mobile users out
class Game{
	constructor(){
		this.canvas = document.getElementById("game");
		this.context = this.canvas.getContext("2d");
		this.objects = [];
		this.lastUpdateTime = Date.now();
		this.init = false;
		this.reset = false;
		this.level = 0;
		this.tutorial = true;
		
		this.theoryImage = new Image();
		this.theoryImage.src = 'sprites/theory.png';
		this.background1 = new Image();
		this.background1.src = 'sprites/background_bottom.png';
		this.background2 = new Image();
		this.background2.src = 'sprites/background_middle.png';
		this.background3 = new Image();
		this.background3.src = 'sprites/background_top.png';
		this.background = [this.background1, this.background2, this.background3];

		
		const game = this;
		this.loadJSON("characters", function(data, game) {
			game.charData = JSON.parse(data);
			game.charImage = new Image();
			game.charImage.src = game.charData.meta.image;
			game.charImage.onload = function() {
				game.loadShip();
			}
		});
	}
	
	loadJSON(json, callback) {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', json + '.json', true);
		const game = this;
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == '200') {
				callback(xobj.responseText, game);
			}
		};
		xobj.send(null);
	}
	
	loadShip() {
		this.loadJSON("ship", function(data, game) {
			game.shipData = JSON.parse(data);
			game.shipImage = new Image();
			game.shipImage.src = game.shipData.meta.image;
			game.shipImage.onload = function() {
				game.loadSpace();
			}
		});
	}
	
	loadSpace() {
		this.loadJSON("space_bodies", function(data, game) {
			game.spaceData = JSON.parse(data);
			game.spaceImage = new Image();
			game.spaceImage.src = game.spaceData.meta.image;
			game.spaceImage.onload = function() {
				game.loadMsgs();
			}
		});
	}
	
	loadMsgs() {
		this.loadJSON("msgs", function(data, game) {
			game.msgData = JSON.parse(data);
			game.msgImage = new Image();
			game.msgImage.src = game.msgData.meta.image;
			game.msgImage.onload = function() {
				game.refresh();
			}
		});
	}
	
	initObj() {
		switch (this.level){
			case 0:
				const startPage = new StartPage({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					theoryImage: this.theoryImage,
					charData: this.charData,
					charImage: this.charImage,
					shipData: this.shipData,
					shipImage: this.shipImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
				});
				this.spawn(startPage);
				break;
				
			case 1:
				const drawMsg1 = new DrawMsg({
					game: this,
					canvas: this.canvas,
					context: this.context,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});
				const floor1 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: 0,
					y: this.canvas.height-100,
					width: this.canvas.width,
					height: 100,
					floor: true
				});
				const meteorGenerator1 = new GenerateMeteors({
					game: this,
					canvas: this.canvas,
					context: this.context,
					count: -1,
					interval: 150,
					maxVel: 5,
					bounce: false,
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					states: {small: 3, medium: 2, large: 1}
				});
				const playerA1 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: 90,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#00ffcc',
					trailColour: '#ccfff5',
					controls: {up:'w', lt:'a', rt:'d', dn:'s'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [18, 19], loop: true, fps: 12}, 
							 moving: {frames: [12, 13, 14, 15], loop: true, fps: 30},
							happy: {frames: [10, 11], loop: false, fps: 12},
							sad: {frames: [16, 17], loop: true, fps: 12}}
				});
				const playerB1 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width-110,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#e60000',
					trailColour: '#ffe6e6',
					controls: {up: 'o', lt: 'k', 
							   rt: ';', dn: 'l'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [8, 9], loop: true, fps: 12}, 
							 moving: {frames: [2, 3, 4, 5], loop: true, fps: 30},
							happy: {frames: [0, 1], loop: false, fps: 12},
							sad: {frames: [6, 7], loop: true, fps: 12}}
				});
				const ship1 = new Ship({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width/2 - 45,
					y: this.canvas.height-100-170,
					width: 90,
					height: 170,
					velocity: 5,
					yAnchor: 0.5,
					shipData: this.shipData,
					shipImage: this.shipImage,
					states: {onGround: {frames: [6], loop: true, fps: 10},
							 static: {frames: [6, 7], loop: true, fps: 10},
							 moving: {frames: [4, 5], loop: true, fps: 10},
							 boost: {frames: [2, 3], loop: true, fps: 10},
							crash: {frames: [0, 1], loop: true, fps: 10}}
				});
				const level1 = new Level({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					width: 2000,
					height: 3000,
					destination: {x: 1000, y: 500, radius: 300},
					destVel: {x: 0, y: 0},
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});

				this.spawn(level1);
				this.spawn(meteorGenerator1);
				this.spawn(floor1);				
				this.spawn(playerB1);
				this.spawn(playerA1);
				this.spawn(ship1);
				this.spawn(drawMsg1);
				break;
				
			case 2:
				const drawMsg2 = new DrawMsg({
					game: this,
					canvas: this.canvas,
					context: this.context,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});
				const floor2 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: 0,
					y: this.canvas.height-100,
					width: this.canvas.width,
					height: 100,
					floor: true
				});
				const wallA2 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -1000 + this.canvas.width/2,
					y: -2000 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const meteorGenerator2 = new GenerateMeteors({
					game: this,
					canvas: this.canvas,
					context: this.context,
					count: -1,
					interval: 150,
					maxVel: 10,
					bounce: false,
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					states: {small: 3, medium: 2, large: 1}
				});
				const playerA2 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: 90,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#00ffcc',
					trailColour: '#ccfff5',
					controls: {up:'w', lt:'a', rt:'d', dn:'s'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [18, 19], loop: true, fps: 12}, 
							 moving: {frames: [12, 13, 14, 15], loop: true, fps: 30},
							happy: {frames: [10, 11], loop: false, fps: 12},
							sad: {frames: [16, 17], loop: true, fps: 12}}
				});
				const playerB2 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width-110,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#e60000',
					trailColour: '#ffe6e6',
					controls: {up: 'o', lt: 'k', 
							   rt: ';', dn: 'l'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [8, 9], loop: true, fps: 12}, 
							 moving: {frames: [2, 3, 4, 5], loop: true, fps: 30},
							happy: {frames: [0, 1], loop: false, fps: 12},
							sad: {frames: [6, 7], loop: true, fps: 12}}
				});
				const ship2 = new Ship({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width/2 - 45,
					y: this.canvas.height-100-170,
					width: 90,
					height: 170,
					velocity: 5,
					yAnchor: 0.5,
					shipData: this.shipData,
					shipImage: this.shipImage,
					states: {onGround: {frames: [6], loop: true, fps: 10},
							 static: {frames: [6, 7], loop: true, fps: 10},
							 moving: {frames: [4, 5], loop: true, fps: 10},
							 boost: {frames: [2, 3], loop: true, fps: 10},
							crash: {frames: [0, 1], loop: true, fps: 10}}
				});
				const level2 = new Level({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					width: 2000,
					height: 4000,
					destination: {x: 1000, y: 500, radius: 300},
					destVel: {x: 0, y: 0},
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});

				this.spawn(level2);
				this.spawn(meteorGenerator2);
				this.spawn(floor2);	
				this.spawn(wallA2);
				this.spawn(playerB2);
				this.spawn(playerA2);
				this.spawn(ship2);
				this.spawn(drawMsg2);
				break;
				
			case 3:
				const drawMsg3 = new DrawMsg({
					game: this,
					canvas: this.canvas,
					context: this.context,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});
				const floor3 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: 0,
					y: this.canvas.height-100,
					width: this.canvas.width,
					height: 100,
					floor: true
				});
				const wallA3 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -250 + this.canvas.width/2,
					y: -2000 + this.canvas.height,
					width: 500,
					height: 100
				});
				const meteorGenerator3 = new GenerateMeteors({
					game: this,
					canvas: this.canvas,
					context: this.context,
					count: -1,
					interval: 70,
					maxVel: 10,
					bounce: false,
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					states: {small: 3, medium: 2, large: 1}
				});
				const playerA3 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: 90,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#00ffcc',
					trailColour: '#ccfff5',
					controls: {up:'w', lt:'a', rt:'d', dn:'s'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [18, 19], loop: true, fps: 12}, 
							 moving: {frames: [12, 13, 14, 15], loop: true, fps: 30},
							happy: {frames: [10, 11], loop: false, fps: 12},
							sad: {frames: [16, 17], loop: true, fps: 12}}
				});
				const playerB3 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width-110,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#e60000',
					trailColour: '#ffe6e6',
					controls: {up: 'o', lt: 'k', 
							   rt: ';', dn: 'l'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [8, 9], loop: true, fps: 12}, 
							 moving: {frames: [2, 3, 4, 5], loop: true, fps: 30},
							happy: {frames: [0, 1], loop: false, fps: 12},
							sad: {frames: [6, 7], loop: true, fps: 12}}
				});
				const ship3 = new Ship({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width/2 - 45,
					y: this.canvas.height-100-170,
					width: 90,
					height: 170,
					velocity: 5,
					yAnchor: 0.5,
					shipData: this.shipData,
					shipImage: this.shipImage,
					states: {onGround: {frames: [6], loop: true, fps: 10},
							 static: {frames: [6, 7], loop: true, fps: 10},
							 moving: {frames: [4, 5], loop: true, fps: 10},
							 boost: {frames: [2, 3], loop: true, fps: 10},
							crash: {frames: [0, 1], loop: true, fps: 10}}
				});
				const level3 = new Level({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					width: 2000,
					height: 4000,
					destination: {x: 1000, y: 500, radius: 300},
					destVel: {x: 5, y: 0},
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});

				this.spawn(level3);
				this.spawn(meteorGenerator3);
				this.spawn(floor3);		
				this.spawn(wallA3);
				this.spawn(playerB3);
				this.spawn(playerA3);
				this.spawn(ship3);
				this.spawn(drawMsg3);
				break;
				
			case 4:
				const drawMsg4 = new DrawMsg({
					game: this,
					canvas: this.canvas,
					context: this.context,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});
				const floor4 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: 0,
					y: this.canvas.height-100,
					width: this.canvas.width,
					height: 100,
					floor: true
				});
				const meteorGenerator4 = new GenerateMeteors({
					game: this,
					canvas: this.canvas,
					context: this.context,
					count: -1,
					interval: 100,
					maxVel: 10,
					bounce: true,
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					states: {small: 3, medium: 2, large: 1}
				});
				const playerA4 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: 90,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#00ffcc',
					trailColour: '#ccfff5',
					controls: {up:'w', lt:'a', rt:'d', dn:'s'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [18, 19], loop: true, fps: 12}, 
							 moving: {frames: [12, 13, 14, 15], loop: true, fps: 30},
							happy: {frames: [10, 11], loop: false, fps: 12},
							sad: {frames: [16, 17], loop: true, fps: 12}}
				});
				const playerB4 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width-110,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#e60000',
					trailColour: '#ffe6e6',
					controls: {up: 'o', lt: 'k', 
							   rt: ';', dn: 'l'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [8, 9], loop: true, fps: 12}, 
							 moving: {frames: [2, 3, 4, 5], loop: true, fps: 30},
							happy: {frames: [0, 1], loop: false, fps: 12},
							sad: {frames: [6, 7], loop: true, fps: 12}}
				});
				const ship4 = new Ship({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width/2 - 45,
					y: this.canvas.height-100-170,
					width: 90,
					height: 170,
					velocity: 5,
					yAnchor: 0.5,
					shipData: this.shipData,
					shipImage: this.shipImage,
					states: {onGround: {frames: [6], loop: true, fps: 10},
							 static: {frames: [6, 7], loop: true, fps: 10},
							 moving: {frames: [4, 5], loop: true, fps: 10},
							 boost: {frames: [2, 3], loop: true, fps: 10},
							crash: {frames: [0, 1], loop: true, fps: 10}}
				});
				const level4 = new Level({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					width: 2000,
					height: 6000,
					destination: {x: 1000, y: 500, radius: 300},
					destVel: {x: 5, y: 0},
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});

				this.spawn(level4);
				this.spawn(meteorGenerator4);
				this.spawn(floor4);				
				this.spawn(playerB4);
				this.spawn(playerA4);
				this.spawn(ship4);
				this.spawn(drawMsg4);
				break;
				
			case 5:
				const drawMsg5 = new DrawMsg({
					game: this,
					canvas: this.canvas,
					context: this.context,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});
				const floor5 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: 0,
					y: this.canvas.height-100,
					width: this.canvas.width,
					height: 100,
					floor: true
				});
				const wallA5 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -1000 + this.canvas.width/2,
					y: -2500 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const wallB5 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -500 + this.canvas.width/2,
					y: -1500 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const meteorGenerator5 = new GenerateMeteors({
					game: this,
					canvas: this.canvas,
					context: this.context,
					count: -1,
					interval: 100,
					maxVel: 10,
					bounce: false,
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					states: {small: 3, medium: 2, large: 1}
				});
				const playerA5 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: 90,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#00ffcc',
					trailColour: '#ccfff5',
					controls: {up:'w', lt:'a', rt:'d', dn:'s'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [18, 19], loop: true, fps: 12}, 
							 moving: {frames: [12, 13, 14, 15], loop: true, fps: 30},
							happy: {frames: [10, 11], loop: false, fps: 12},
							sad: {frames: [16, 17], loop: true, fps: 12}}
				});
				const playerB5 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width-110,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#e60000',
					trailColour: '#ffe6e6',
					controls: {up: 'o', lt: 'k', 
							   rt: ';', dn: 'l'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [8, 9], loop: true, fps: 12}, 
							 moving: {frames: [2, 3, 4, 5], loop: true, fps: 30},
							happy: {frames: [0, 1], loop: false, fps: 12},
							sad: {frames: [6, 7], loop: true, fps: 12}}
				});
				const ship5 = new Ship({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width/2 - 45,
					y: this.canvas.height-100-170,
					width: 90,
					height: 170,
					velocity: 5,
					yAnchor: 0.5,
					shipData: this.shipData,
					shipImage: this.shipImage,
					states: {onGround: {frames: [6], loop: true, fps: 10},
							 static: {frames: [6, 7], loop: true, fps: 10},
							 moving: {frames: [4, 5], loop: true, fps: 10},
							 boost: {frames: [2, 3], loop: true, fps: 10},
							crash: {frames: [0, 1], loop: true, fps: 10}}
				});
				const level5 = new Level({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					width: 2000,
					height: 4000,
					destination: {x: 1000, y: 500, radius: 300},
					destVel: {x: 0, y: 0},
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});

				this.spawn(level5);
				this.spawn(meteorGenerator5);
				this.spawn(floor5);	
				this.spawn(wallA5);
				this.spawn(wallB5);
				this.spawn(playerB5);
				this.spawn(playerA5);
				this.spawn(ship5);
				this.spawn(drawMsg5);
				break;
				
			case 6:
				const drawMsg6 = new DrawMsg({
					game: this,
					canvas: this.canvas,
					context: this.context,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});
				const floor6 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: 0,
					y: this.canvas.height-100,
					width: this.canvas.width,
					height: 100,
					floor: true
				});
				const wallA6 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -1000 + this.canvas.width/2,
					y: -3000 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const wallB6 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -500 + this.canvas.width/2,
					y: -2000 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const wallC6 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -1000 + this.canvas.width/2,
					y: -1000 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const meteor6 = new Meteor({
					canvas: this.canvas,
					context: this.context,
					levelX: 250,
					levelY: 4000,
					width: 1500,
					velocity: {x: 0, y: -2.5},
					moving: false,
					bounce: false,
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					states: {small: 3, medium: 2, large: 1}
				});
				const playerA6 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: 90,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#00ffcc',
					trailColour: '#ccfff5',
					controls: {up:'w', lt:'a', rt:'d', dn:'s'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [18, 19], loop: true, fps: 12}, 
							 moving: {frames: [12, 13, 14, 15], loop: true, fps: 30},
							happy: {frames: [10, 11], loop: false, fps: 12},
							sad: {frames: [16, 17], loop: true, fps: 12}}
				});
				const playerB6 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width-110,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#e60000',
					trailColour: '#ffe6e6',
					controls: {up: 'o', lt: 'k', 
							   rt: ';', dn: 'l'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [8, 9], loop: true, fps: 12}, 
							 moving: {frames: [2, 3, 4, 5], loop: true, fps: 30},
							happy: {frames: [0, 1], loop: false, fps: 12},
							sad: {frames: [6, 7], loop: true, fps: 12}}
				});
				const ship6 = new Ship({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width/2 - 45,
					y: this.canvas.height-100-170,
					width: 90,
					height: 170,
					velocity: 5,
					yAnchor: 0.5,
					shipData: this.shipData,
					shipImage: this.shipImage,
					states: {onGround: {frames: [6], loop: true, fps: 10},
							 static: {frames: [6, 7], loop: true, fps: 10},
							 moving: {frames: [4, 5], loop: true, fps: 10},
							 boost: {frames: [2, 3], loop: true, fps: 10},
							crash: {frames: [0, 1], loop: true, fps: 10}}
				});
				const level6 = new Level({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					width: 2000,
					height: 4000,
					destination: {x: 1000, y: 500, radius: 300},
					destVel: {x: 0, y: 0},
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});

				this.spawn(level6);
				this.spawn(floor6);	
				this.spawn(wallA6);
				this.spawn(wallB6);
				this.spawn(wallC6);
				this.spawn(playerB6);
				this.spawn(playerA6);
				this.spawn(ship6);
				this.spawn(meteor6);
				this.spawn(drawMsg6);
				
				break;
				
				case 7:
				const drawMsg7 = new DrawMsg({
					game: this,
					canvas: this.canvas,
					context: this.context,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});
				const floor7 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: 0,
					y: this.canvas.height-100,
					width: this.canvas.width,
					height: 100,
					floor: true
				});
				const wallA7 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -500 + this.canvas.width/2,
					y: -3000 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const wallB7 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -1000 + this.canvas.width/2,
					y: -2000 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const wallC7 = new Wall({
					canvas: this.canvas,
					context: this.context,
					x: -500 + this.canvas.width/2,
					y: -1000 + this.canvas.height,
					width: 1500,
					height: 100
				});
				const meteor7 = new Meteor({
					canvas: this.canvas,
					context: this.context,
					levelX: 350,
					levelY: 4000,
					width: 1300,
					velocity: {x: 0, y: -4},
					moving: false,
					bounce: false,
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					states: {small: 3, medium: 2, large: 1}
				});
				const playerA7 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: 90,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#00ffcc',
					trailColour: '#ccfff5',
					controls: {up:'w', lt:'a', rt:'d', dn:'s'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [18, 19], loop: true, fps: 12}, 
							 moving: {frames: [12, 13, 14, 15], loop: true, fps: 30},
							happy: {frames: [10, 11], loop: false, fps: 12},
							sad: {frames: [16, 17], loop: true, fps: 12}}
				});
				const playerB7 = new Player({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width-110,
					y: 308,
					width: 50,
					height: 72,
					anchor: {x: 0.5, y: 0.5},
					colour: '#e60000',
					trailColour: '#ffe6e6',
					controls: {up: 'o', lt: 'k', 
							   rt: ';', dn: 'l'},
					charData: this.charData,
					charImage: this.charImage,
					states: {static: {frames: [8, 9], loop: true, fps: 12}, 
							 moving: {frames: [2, 3, 4, 5], loop: true, fps: 30},
							happy: {frames: [0, 1], loop: false, fps: 12},
							sad: {frames: [6, 7], loop: true, fps: 12}}
				});
				const ship7 = new Ship({
					canvas: this.canvas,
					context: this.context,
					x: this.canvas.width/2 - 45,
					y: this.canvas.height-100-170,
					width: 90,
					height: 170,
					velocity: 5,
					yAnchor: 0.5,
					shipData: this.shipData,
					shipImage: this.shipImage,
					states: {onGround: {frames: [6], loop: true, fps: 10},
							 static: {frames: [6, 7], loop: true, fps: 10},
							 moving: {frames: [4, 5], loop: true, fps: 10},
							 boost: {frames: [2, 3], loop: true, fps: 10},
							crash: {frames: [0, 1], loop: true, fps: 10}}
				});
				const level7 = new Level({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					width: 2000,
					height: 4000,
					destination: {x: 1000, y: 500, radius: 300},
					destVel: {x: 0, y: 0},
					spaceData: this.spaceData,
					spaceImage: this.spaceImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
					tutorial: this.tutorial
				});

				this.spawn(level7);
				this.spawn(floor7);	
				this.spawn(wallA7);
				this.spawn(wallB7);
				this.spawn(wallC7);
				this.spawn(playerB7);
				this.spawn(playerA7);
				this.spawn(ship7);
				this.spawn(meteor7);
				this.spawn(drawMsg7);
				
				break;
				
			case 8:
				const winScreen = new WinScreen({
					game: this,
					canvas: this.canvas,
					context: this.context,
					background: this.background,
					theoryImage: this.theoryImage,
					charData: this.charData,
					charImage: this.charImage,
					shipData: this.shipData,
					shipImage: this.shipImage,
					msgData: this.msgData,
					msgImage: this.msgImage,
				});
				this.spawn(winScreen);
				break;
		}
	}
		
	spawn(obj) {
		this.objects.push(obj);
	}
	
	refresh(){
		if (this.reset) {
			this.objects = [];
			this.init = false;
			this.reset = false;
		}
		if (!this.init){
			this.init = true;
			this.initObj();
			if (this.level >= 1) {
				this.tutorial = false;	
			}
		}
		const now = Date.now();
		const dt = ((now - this.lastUpdateTime)/10);
		if (dt >= 1){
			// refresh canvas for each object
			if (this.canvas.width != innerWidth || this.canvas.height != innerHeight){
				let oldW = innerWidth - this.canvas.width;
				let oldH = innerHeight - this.canvas.height;
				this.context.canvas.width = innerWidth;
				this.context.canvas.height = innerHeight;
				this.refreshCanvas(oldW, oldH);
			}
			
			// update objects
			this.update(dt, this.objects);
			this.lastUpdateTime = now;
		}
		this.render();
				
		const game = this;
		requestAnimationFrame(function() {
			game.refresh();
		});
	}
	
	update(dt, objects) {
		for (let i=0; i<this.objects.length; i++) {
			this.objects[i].update(dt, objects);
			
			// update all object lists
			if (this.objects[i].kill) {
				this.objects.splice(i, 1);
				this.refreshVars();
			}
		}
	}
	
	render() {
		for (let obj of this.objects) {
			obj.render();
		}
	}

	// recreate object lists
	refreshVars() {
		for (let obj of this.objects) {
			obj.refreshVars(this.objects);
		}
	}
	
	// dynamically changes canvas size
	refreshCanvas(oldW, oldH) {
		for (let obj of this.objects) {
			if (obj.class == 'Level') {
				obj.refreshCanvas(oldW, oldH);
				break;
			}
		}
	}
}
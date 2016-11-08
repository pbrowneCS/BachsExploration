$(document).ready(function(){
	var playerSize = 40;
	var MinWidth = 0;
	var MinHeight = 0;
	var MaxWidth = 1000 - playerSize;
	var MaxHeight = 600 - playerSize;
	var xVelocity = 0;
	var yVelocity = 0;
	var coordinates = [];
	var projectiles = [];
	var mageProjectiles = []; //upgrade
	var archerProjectiles = []; //upgrade
	var wall = [];
	//enemy vars
	var soldiers = [];
	var mages = []; //upgrade
	var archers = []; //upgrade
	var deadSoldiers = [];
	var deadMages = []; //upgrade
	var deadArchers = []; //upgrade
	var soldierHealth = 100;
	var archerHealth = 100; //upgrade
	var mageHealth = 100; //upgrade
	var boss = {};
	var bossStunTimer = 0;
	//player vars
	var playerMouseDown = false;
	var score = 0;
	var currentLevel = 0;
	var readyUpTimer = 120;
	var paused = false;
	
	//new
	var knockX = 0;
	var knockY = 0;
	var canMove = true;
	var bonusTime = 0;
	var bonusTimeMax = 0;
	var bonusTimePoints = 0;
	// var bonusShots = 0;
	var bonusScreenTime = 0;
	
	// SAVE GAME

	function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
        	var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
		if (cookie.substring(0, name.length + 1) == (name + '=')) {
			cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
			break;
			}
		}
      }
	return cookieValue;
	}
	

	$("#savebtn").click(function(){
		var game_id = $('#game_id').data('value');
		var URL = "/save/"+game_id;
		var prompt = window.prompt("Please provide a name for your quest:");
		var csrftoken = getCookie('csrftoken');

		
		if(prompt != null){
			$.ajax({
				url: URL,
				type: "POST",
				data: {
					save_name: prompt,
					level: currentLevel,
					score: score,
					csrfmiddlewaretoken : csrftoken
				}
			});
		}

	});

	player = {
				x: 0,
				y: 0,
				velocity:{
					x:0,
					y:0
				},
				height: 40,
				width: 40,
				radius: 20,
				attackTimer: 0,
				chargeTimer: 0,
				damagedTimer: 0,
				takesDamage: true,
				step: 0,
				attacking: 0,
				health: 100
			};

			levels = [
				//level 1
				{
					wall: [
						{x: 750, y: 350, height: 150, width: 50},
						{x: 200, y: 350, height: 150, width: 50},
					],
					soldier: [
						{x: 820, y: 400, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0},
					],
					mage: [],
					archer: [],
					boss: {},
					spawnPoint: {
						x: 100,
						y: 100
					}
				},
				//level 2
				// {
				// 	wall: [
				// 		{x: 750, y: 350, height: 150, width: 50},
				// 		{x: 200, y: 350, height: 150, width: 50},
				// 		{x: 300, y: 300, height: 50, width: 150},
				// 		{x: 650, y: 100, height: 50, width: 300},
				// 		{x: 550, y: 100, height: 250, width: 50},
				// 	],
				// 	soldier: [],
				// 	mage: [],
				// 	archer: [
				// 	{x: 820, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 	],
				// 	boss: {},
				// 	spawnPoint: {
				// 		x: 100,
				// 		y: 200
				// 	}
				// },
				// //level 3
				// {
				// 	wall: [
				// 		{x: 750, y: 350, height: 150, width: 50},
				// 		{x: 200, y: 350, height: 150, width: 50},
				// 		{x: 300, y: 300, height: 50, width: 150},
				// 		{x: 650, y: 100, height: 50, width: 300},
				// 		{x: 550, y: 100, height: 250, width: 50},
				// 	],
				// 	soldier: [
				// 		{x: 820, y: 400, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 320, y: 450, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 	],
				// 	mage: [],
				// 	archer: [
				// 		{x: 820, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 	],
				// 	boss: {},
				// 	spawnPoint: {
				// 		x: 100,
				// 		y: 300
				// 	}
				// },
				// //level 4
				// {
				// 	wall: [
				// 		{x: 750, y: 350, height: 150, width: 50},
				// 		{x: 200, y: 350, height: 150, width: 50},
				// 		{x: 300, y: 300, height: 50, width: 150},
				// 		{x: 650, y: 100, height: 50, width: 300},
				// 		{x: 550, y: 100, height: 250, width: 50},
				// 	],
				// 	soldier: [
				// 		{x: 820, y: 400, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 820, y: 50, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 320, y: 500, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 120, y: 150, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 	],
				// 	mage: [],
				// 	archer: [
				// 		{x: 820, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 	],
				// 	boss: {},
				// 	spawnPoint: {
				// 		x: 100,
				// 		y: 400
				// 	}
				// },
				// //level 5
				// {
				// 	wall: [
				// 		{x: 200, y: 50, height: 50, width: 50},
				// 		{x: 600, y: 50, height: 150, width: 50},
				// 		{x: 50, y: 200, height: 50, width: 150},
				// 		{x: 100, y: 300, height: 50, width: 300},
				// 		{x: 350, y: 50, height: 150, width: 50},
				// 		{x: 650, y: 300, height: 50, width: 300},
				// 		{x: 50, y: 450, height: 50, width: 250},
				// 		{x: 400, y: 450, height: 150, width: 50},
				// 		{x: 750, y: 350, height: 150, width: 50}
				// 	],
				// 	soldier: [
				// 		{x: 820, y: 90, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 600, y: 430, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 400, y: 210, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0}
				// 	],
				// 	mage: [],
				// 	archer: [
				// 		{x: 820, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 		{x: 220, y: 400, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 	],
				// 	boss: {},
				// 	spawnPoint: {
				// 		x: 100,
				// 		y: 100
				// 	}
				// },
				// //level 6
				// {
				// 	wall: [
				// 		{x: 100, y: 50, height: 50, width: 50},
				// 		{x: 500, y: 50, height: 150, width: 50},
				// 		{x: 150, y: 200, height: 50, width: 150},
				// 		{x: 150, y: 300, height: 50, width: 300},
				// 		{x: 250, y: 50, height: 150, width: 50},
				// 		{x: 550, y: 300, height: 50, width: 300},
				// 		{x: 150, y: 450, height: 50, width: 250},
				// 		{x: 450, y: 450, height: 150, width: 50},
				// 		{x: 650, y: 350, height: 150, width: 50}
				// 	],
				// 	soldier: [
				// 		{x: 820, y: 90, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 600, y: 430, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 400, y: 210, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0}
				// 	],
				// 	mage: [],
				// 	archer: [
				// 		{x: 420, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 		{x: 620, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 		{x: 820, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 	],
				// 	boss: {},
				// 	spawnPoint: {
				// 		x: 100,
				// 		y: 100
				// 	}
				// },
				// //level 7
				// {
				// 	wall: [
				// 		{x: 100, y: 50, height: 400, width: 50},
				// 		{x: 250, y: 100, height: 400, width: 50},
				// 		{x: 400, y: 50, height: 400, width: 50},
				// 		{x: 550, y: 100, height: 400, width: 50},
				// 		{x: 700, y: 50, height: 400, width: 50},
				// 		{x: 850, y: 100, height: 400, width: 50},
				// 	],
				// 	soldier: [
				// 		{x: 50, y: 450, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 50, y: 50, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 350, y: 550, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 600, y: 300, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 900, y: 450, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 950, y: 50, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 200, y: 50, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 	],
				// 	mage: [
				// 		{x: 600, y: 400, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300, teleRadius: 500,},
				// 	],
				// 	archer: [
				// 		{x: 520, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 		{x: 820, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 	],
				// 	boss: {},
				// 	spawnPoint: {
				// 		x: 150,
				// 		y: 300
				// 	}
				// },
				// //level 8
				// {
				// 	wall: [
				// 		{x: 100, y: 50, height: 200, width: 250},
				// 		{x: 100, y: 350, height: 200, width: 250},
				// 		{x: 650, y: 50, height: 200, width: 250},
				// 		{x: 650, y: 350, height: 200, width: 250},
				// 		{x: 500, y: 100, height: 400, width: 50},
				// 	],
				// 	soldier: [
				// 		{x: 50, y: 50, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 350, y: 550, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 600, y: 300, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 950, y: 50, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 	],
				// 	mage: [
				// 		{x: 600, y: 400, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300, teleRadius: 500,},
				// 	],
				// 	archer: [
				// 		{x: 420, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 		{x: 820, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 	],
				// 	boss: {},
				// 	spawnPoint: {
				// 		x: 150,
				// 		y: 300
				// 	}
				// },
				// //level 9
				// {
				// 	wall: [
				// 		{x: 100, y: 75, height: 100, width: 100},
				// 		{x: 275, y: 175, height: 100, width: 100},
				// 		{x: 100, y: 250, height: 100, width: 100},
				// 		{x: 275, y: 350, height: 100, width: 100},
				// 		{x: 100, y: 425, height: 100, width: 100},
				// 		{x: 450, y: 75, height: 100, width: 100},
				// 		{x: 625, y: 175, height: 100, width: 100},
				// 		{x: 450, y: 250, height: 100, width: 100},
				// 		{x: 625, y: 350, height: 100, width: 100},
				// 		{x: 450, y: 425, height: 100, width: 100},
				// 		{x: 800, y: 75, height: 100, width: 100},
				// 		{x: 800, y: 250, height: 100, width: 100},
				// 		{x: 800, y: 425, height: 100, width: 100},
						
				// 	],
				// 	soldier: [
				// 		{x: 50, y: 450, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 50, y: 50, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 350, y: 550, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 600, y: 300, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 900, y: 450, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 		{x: 950, y: 50, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove: true, canMoveTimer:0},
				// 	],
				// 	mage: [
				// 		{x: 600, y: 400, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300, teleRadius: 500,},
				// 		{x: 800, y: 400, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300, teleRadius: 500,},
				// 	],
				// 	archer: [
				// 		{x: 220, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 		{x: 420, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 		// {x: 620, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 		// {x: 820, y: 200, velocity:{x: 0, y: 0,}, height: 40, width: 40, radius: 20, health: 100, canMove:true, canMoveTimer:0, canShoot:0, shotRadius: 300,},
				// 	],
				// 	boss: {},
				// 	spawnPoint: {
				// 		x: 275,
				// 		y: 275
				// 	}
				// },
				//level 10
				{
					wall: [
						{x: 300, y: 75, height: 50, width: 400},
						{x: 300, y: 475, height: 50, width: 400},
						{x: 100, y: 100, height: 400, width: 50},
						{x: 850, y: 100, height: 400, width: 50},
						{x: 350, y: 200, height: 50, width: 300},
						{x: 230, y: 170, height: 250, width: 50},
						{x: 350, y: 350, height: 50, width: 300},
						{x: 730, y: 170, height: 250, width: 50},
						
					],
					soldier: [],
					mage: [	
					],
					archer: [
					],
					boss: {x: 900, y: 500, velocity:{x: 0, y: 0,}, height: 80, width: 80, radius: 40, health: 1500},
					spawnPoint: {
						x: 10,
						y: 10
					}
				}
			];

			var keys = {};

			window.addEventListener('keydown',function(e){
				keys[e.keyCode || e.which] = true;
			},true);

			window.addEventListener('keyup',function(e){
				//left
				keys[e.keyCode || e.which] = false;
				if (e.keyCode == 65 || e.keyCode ==  97){
					player.velocity.x = 0;
				}
				//right
				if (e.keyCode == 68 || e.keyCode == 100){
					player.velocity.x = 0;
				}
				//up
				if (e.keyCode == 87 || e.keyCode ==  119){
					player.velocity.y = 0;
				}
				//down
				if (e.keyCode == 83 || e.keyCode == 115){ 
					player.velocity.y = 0;
				}
			},true);

			function playerMove(){
				//left
				if (canMove){
					var count = 0;
					if (keys[65] || keys[97]){
						count++;
						player.step++;
						player.velocity.x = -3;
					}
					//right
					if (keys[68] || keys[100]){
						count++;
						player.step++;
						player.velocity.x = +3;
					}
					//up
					if (keys[87] || keys[119]){
						count++;
						player.velocity.y = -3;
					}
					//down
					if (keys[83] || keys[115]){
						count++;
						player.velocity.y = +3;
					}
					if (count > 1){
						player.velocity.x = player.velocity.x * .7071;
						player.velocity.y = player.velocity.y * .7071;
					}
					if (player.step > 10){
						document.getElementById("player").style.padding = "0px 0px 0px 0px";
					}
					if (player.step < 10){
						document.getElementById("player").style.padding = "2px 0px 0px 0px";
					}
					if (player.step > 20){
						player.step = 0;
					}
				}
			}

// START WALL/BORDER COLLISION MECHANICS

			function borderCollision(unit){
				//make it so stuff can't go outside the border
				if (unit.x > MaxWidth){
					unit.x = MaxWidth
				}
				if (unit.x < MinWidth){
					unit.x = MinWidth
				}
				if (unit.y > MaxHeight){
					unit.y = MaxHeight
				}
				if (unit.y < MinHeight){
					unit.y = MinHeight
				}
			}

			function wallCollision(unit){
				for(var i = 0; i < wall.length; i++){
					
					// x,y
					if (((unit.x+unit.velocity.x > wall[i].x) && (unit.x+unit.velocity.x < wall[i].x+wall[i].width)) && (((unit.y > wall[i].y) && (unit.y< wall[i].y+wall[i].height))||((unit.y + unit.height > wall[i].y) && (unit.y + unit.height< wall[i].y+wall[i].height)))){
						if (unit.y + unit.height - unit.velocity.y <= wall[i].y){
						}else if (unit.y - unit.velocity.y >= wall[i].y + wall[i].height){
						}else if (unit.velocity.x < 0) {
							unit.x = wall[i].x + wall[i].width;
						}else if (unit.velocity.x > 0) {
							unit.x = wall[i].x;
						}
					}
					if (((unit.x + unit.width+unit.velocity.x > wall[i].x) && (unit.x + unit.width+unit.velocity.x < wall[i].x+wall[i].width)) && (((unit.y > wall[i].y) && (unit.y< wall[i].y+wall[i].height))||((unit.y + unit.height > wall[i].y) && (unit.y + unit.height< wall[i].y+wall[i].height)))){
						if (unit.y + unit.height - unit.velocity.y <= wall[i].y){
						}else if (unit.y - unit.velocity.y >= wall[i].y + wall[i].height){
						}else if (unit.velocity.x < 0) {
							unit.x = wall[i].x + wall[i].width - unit.width;
						}else if (unit.velocity.x > 0) {
							unit.x = wall[i].x - unit.width;
						}
					}
					if ((((unit.x > wall[i].x) && (unit.x < wall[i].x+wall[i].width))||((unit.x + unit.width > wall[i].x) && (unit.x + unit.width< wall[i].x+wall[i].width))) && ((unit.y + unit.velocity.y > wall[i].y) && (unit.y + unit.velocity.y< wall[i].y+wall[i].height))){
						if (unit.velocity.y < 0) {

							unit.y = wall[i].y + wall[i].height;
						}
						if (unit.velocity.y > 0) {
							unit.y = wall[i].y;
						}
					}
					if ((((unit.x > wall[i].x) && (unit.x < wall[i].x+wall[i].width))||((unit.x + unit.width > wall[i].x) && (unit.x + unit.width< wall[i].x+wall[i].width))) && ((unit.y + unit.height+ unit.velocity.y > wall[i].y) && (unit.y + unit.height+ unit.velocity.y< wall[i].y+wall[i].height))){
						if (unit.velocity.y < 0) {
							unit.y = wall[i].y - unit.height;
						}
						if (unit.velocity.y > 0) {
							unit.y = wall[i].y - unit.height;
						}
					}
					}
			}				
			function displayWalls(){
				var string = "";
				for(var i = 0; i < wall.length; i++){
					string += "<div class='wall' style='top:" + wall[i].y + "px; left:" + wall[i].x + "px; height:" + wall[i].height + "px; width:" + wall[i].width + "px;'></div>"
				}
				document.getElementById("walls").innerHTML=string;
			}
// START PROJECTILES
			$("#gameRegion").mousedown(function(e){
				e.preventDefault;
				if(e.which == 1){
					playerMouseDown = true;
				}else if(e.which == 3){
					e.preventDefault;
				}
			});

			$("#gameRegion").mouseup(function(e){
				if (e.which == 1){
					var mouseX = e.pageX;
					var mouseY = e.pageY;
					coordinates = [mouseX,mouseY];
					if(player.attackTimer == 0){
						projectile(player,coordinates);
						player.attackTimer = 20;
					}
					playerMouseDown = false;
				}
			});

			function projectile(unit, target){
				var centerX = unit.x + (unit.width/2);
				var centerY = unit.y + (unit.height/2);
				var targetX = target[0]-6; //compensate for center radial -6
				var targetY = target[1]-6; //compensate for center radial -6
				var distanceX = targetX - centerX;
				var distanceY = targetY - centerY;
				var projWidth = 25;
				var projHeight = 10;
				var theta = Math.atan2(distanceY, distanceX);
				var xSpeed = Math.cos(theta) * 5;
				var ySpeed = Math.sin(theta) * 5;
				var r = Math.sqrt((Math.pow(projWidth/2,2))+(Math.pow(projHeight/2,2)));
				var newX = centerX + r*Math.cos(theta);
				var newY = centerY + r*Math.sin(theta);
				var damage = 20*player.chargeTimer/10;
				if(damage < 20){
					damage = 20;
				}
				projectiles.push({currentX: centerX, currentY: centerY, velX: xSpeed ,velY: ySpeed, type: "arrow", angle: theta*(180/Math.PI), pxm: newX, pym: newY, damage: damage})
			}

			function archerProjectile(unit, player){
				var centerX = unit.x + (unit.width/2);
				var centerY = unit.y + (unit.height/2);
				var targetX = player.x;
				var targetY = player.y;
				var distanceX = targetX - centerX;
				var distanceY = targetY - centerY;
				var projWidth = 25;
				var projHeight = 10;
				var theta = Math.atan2(distanceY, distanceX);
				var xSpeed = Math.cos(theta) * 10;
				var ySpeed = Math.sin(theta) * 10;
				var r = Math.sqrt((Math.pow(projWidth/2,2))+(Math.pow(projHeight/2,2)));
				var newX = centerX + r*Math.cos(theta);
				var newY = centerY + r*Math.sin(theta);
				var damage = 20;
				archerProjectiles.push({currentX: centerX, currentY: centerY, velX: xSpeed ,velY: ySpeed, type: "arrow", angle: theta*(180/Math.PI), pxm: newX, pym: newY, damage: damage})
			}

			function mageProjectile(unit, player){
				var centerX = unit.x + (unit.width/2);
				var centerY = unit.y + (unit.height/2);
				var targetX = player.x;
				var targetY = player.y;
				var distanceX = targetX - centerX;
				var distanceY = targetY - centerY;
				var projWidth = 25;
				var projHeight = 10;
				var theta = Math.atan2(distanceY, distanceX);
				var xSpeed = Math.cos(theta) * 10;
				var ySpeed = Math.sin(theta) * 10;
				var r = Math.sqrt((Math.pow(projWidth/2,2))+(Math.pow(projHeight/2,2)));
				var newX = centerX + r*Math.cos(theta);
				var newY = centerY + r*Math.sin(theta);
				var damage = 20;
				mageProjectiles.push({currentX: centerX, currentY: centerY, velX: xSpeed ,velY: ySpeed, type: "arrow", angle: theta*(180/Math.PI), pxm: newX, pym: newY, damage: damage})
			}
			function projectilePlayerCollision(projectile){
				var dx = (player.x+20)-projectile.pxm;
				var dy = (player.y+20)-projectile.pym;
				var distance = Math.sqrt((dx*dx)+(dy*dy));
				if(distance < player.radius){
					player.health -= projectile.damage;
					return true;
				}
			}

			//soldier collision
			function projectileUnitCollision(projectile){
				for (var i=0;i<soldiers.length;i++){
					var dx = (soldiers[i].x+20)-projectile.pxm;
					var dy = (soldiers[i].y+20)-projectile.pym;
					var distance = Math.sqrt((dx*dx)+(dy*dy));
					if(distance < soldiers[i].radius){
						soldiers[i].health -= projectile.damage;
						if(soldiers[i].health<1){
							var coords = {x:soldiers[i].x, y:soldiers[i].y};
							score+=100;
							if(i!=soldiers.length-1){
								soldiers[i] = soldiers.pop();
								deadSoldiers.push(coords);
								i--;
							}
							else{
								deadSoldiers.push(coords);
								soldiers.pop();
							}

						}
						return true;
					}
				}
				for (var j=0;j<mages.length;j++){
					var dx = (mages[j].x+20)-projectile.pxm;
					var dy = (mages[j].y+20)-projectile.pym;
					var distance = Math.sqrt((dx*dx)+(dy*dy));
					if(distance < mages[j].radius){
						mages[j].health -= projectile.damage;
						if(mages[j].health<1){
							var coord = {x:mages[j].x, y:mages[j].y};
							score+=100;
							if(j!=mages.length-1){
								mages[j] = mages.pop();
								deadMages.push(coord);
								j--;
							}
							else{
								deadMages.push(coord);
								mages.pop();
							}

						}
						return true;
					}
				}
				for (var k=0;k<archers.length;k++){
					var dx = (archers[k].x+20)-projectile.pxm;
					var dy = (archers[k].y+20)-projectile.pym;
					var distance = Math.sqrt((dx*dx)+(dy*dy));
					if(distance < archers[k].radius){
						archers[k].health -= projectile.damage;
						if(archers[k].health<1){
							var coor = {x:archers[k].x, y:archers[k].y};
							score+=100;
							if(k!=archers.length-1){
								archers[k] = archers.pop();
								deadArchers.push(coor);
								k--;
							}
							else{
								deadArchers.push(coor);
								archers.pop();
							}

						}
						return true;
					}
				}
				if (jQuery.isEmptyObject(boss) == false){
					var dx = (boss.x+20)-projectile.pxm;
					var dy = (boss.y+20)-projectile.pym;
					var distance = Math.sqrt((dx*dx)+(dy*dy));
					if(distance < boss.radius){
						boss.health -= projectile.damage;
						if(boss.health<1){
							var coords = {x:boss.x, y:boss.y};
							score+=100;
							if(i!=boss.length-1){
								boss = {};								// deadSoldiers.push(coords);
								i--;
								document.getElementById("boss").innerHTML="";
							}
							else{
								// deadSoldiers.push(coords);
								boss = {};
								document.getElementById("boss").innerHTML="";
							}

						}
						return true;
					}
				}
				return false;
			}

			function projectileMove(){
				var string = "";
				for (var i=0; i<projectiles.length;i++){
					projectiles[i].currentX += projectiles[i].velX;
					projectiles[i].currentY += projectiles[i].velY;
					projectiles[i].pxm += projectiles[i].velX;
					projectiles[i].pym += projectiles[i].velY;
					if ((projectiles[i].currentX > MaxWidth+playerSize || projectiles[i].currentX < 0) || (projectiles[i].currentY > MaxHeight + playerSize || projectiles[i].currentY < 0)){
						projectiles[i] = projectiles[projectiles.length-1];
						projectiles.pop();
						i--;	
					}else if(projectileCollision(projectiles[i]) || projectileUnitCollision(projectiles[i])){
						projectiles[i] = projectiles[projectiles.length-1];
						projectiles.pop();
						i--;	
					}else{
						var arrowType = '';
						if (projectiles[i].damage > 100){
							string += "<div id='arrow2'";
						}else if(projectiles[i].damage <= 100){
							string += "<div id='arrow'";
						}
						string += "' style='top:" + (projectiles[i].currentY-2.5) + "px; left:" + (projectiles[i].currentX-6.25) + "px; transform: rotate(" + projectiles[i].angle + "deg); '></div>";
					}
				}
				document.getElementById("projectiles").innerHTML=string;
			}

			function mageProjectileMove(){
				var string = "";
				for (var i=0; i<mageProjectiles.length;i++){
					mageProjectiles[i].currentX += mageProjectiles[i].velX;
					mageProjectiles[i].currentY += mageProjectiles[i].velY;
					mageProjectiles[i].pxm += mageProjectiles[i].velX;
					mageProjectiles[i].pym += mageProjectiles[i].velY;
					if ((mageProjectiles[i].currentX > MaxWidth+playerSize || mageProjectiles[i].currentX < 0) || (mageProjectiles[i].currentY > MaxHeight + playerSize || mageProjectiles[i].currentY < 0)){
						mageProjectiles[i] = mageProjectiles[mageProjectiles.length-1];
						mageProjectiles.pop();
						i--;	
					}

					else if(projectileCollision(mageProjectiles[i]) || projectilePlayerCollision(mageProjectiles[i])){
						mageProjectiles[i] = mageProjectiles[mageProjectiles.length-1];
						mageProjectiles.pop();
						i--;	
					}

					else{
					string += "<div id='lightning_bolt' style='top:" + (mageProjectiles[i].currentY-2.5) + "px; left:" + (mageProjectiles[i].currentX-6.25) + "px; transform: rotate(" + mageProjectiles[i].angle + "deg); '></div>";
					}
				}
				document.getElementById("mageProjectiles").innerHTML=string;
			}

			function archerProjectileMove(){
				var string = "";
				for (var i=0; i<archerProjectiles.length;i++){
					archerProjectiles[i].currentX += archerProjectiles[i].velX;
					archerProjectiles[i].currentY += archerProjectiles[i].velY;
					archerProjectiles[i].pxm += archerProjectiles[i].velX;
					archerProjectiles[i].pym += archerProjectiles[i].velY;
					if ((archerProjectiles[i].currentX > MaxWidth+playerSize || archerProjectiles[i].currentX < 0) || (archerProjectiles[i].currentY > MaxHeight + playerSize || archerProjectiles[i].currentY < 0)){
						archerProjectiles[i] = archerProjectiles[archerProjectiles.length-1];
						archerProjectiles.pop();
						i--;	
					}

					else if(projectileCollision(archerProjectiles[i]) || projectilePlayerCollision(archerProjectiles[i])){
						archerProjectiles[i] = archerProjectiles[archerProjectiles.length-1];
						archerProjectiles.pop();
						i--;	
					}

					else{
					string += "<div id='bolt' style='top:" + (archerProjectiles[i].currentY-2.5) + "px; left:" + (archerProjectiles[i].currentX-6.25) + "px; transform: rotate(" + archerProjectiles[i].angle + "deg); '></div>";
					}
				}
				document.getElementById("archerProjectiles").innerHTML=string;
			}


			function projectileCollision(projectile){
				for(var i = 0; i < wall.length; i++){
					// x,y
					if (((projectile.pxm+12.5 > wall[i].x) && (projectile.pxm+12.5 < wall[i].x+wall[i].width)) && ((projectile.pym > wall[i].y) && (projectile.pym < wall[i].y+wall[i].height))){
						return true;
					}
					// x+width, y
					if ((projectile.pxm+12.5+projectile.width > wall[i].x && projectile.pxm+12.5+projectile.width < wall[i].x+wall[i].width) && (projectile.pym > wall[i].y && projectile.pym < wall[i].y+wall[i].height)){
						return true;
					}
					// x+width, y+height
					if ((projectile.pxm+12.5+projectile.width > wall[i].x && projectile.pxm+12.5+projectile.width < wall[i].x+wall[i].width) && (projectile.pym+projectile.height > wall[i].y && projectile.pym+projectile.height < wall[i].y+wall[i].height)){
						return true;
					}
					// x, y+height
					if ((projectile.pxm+12.5 > wall[i].x && projectile.pxm+12.5 < wall[i].x+wall[i].width) && (projectile.pym+projectile.height > wall[i].y && projectile.pym+projectile.height < wall[i].y+wall[i].height)){
						return true;
					}
				}
				return false;
			}

			function checkProjectileWallCollision(){
				for(var i = 0; i < projectiles.length; i++){
					if(projectileCollision(projectiles[i])){
						projectiles[i] = projectiles[projectiles.length-1];
						projectiles.pop();
						i--;	
					}
					// else{
					// string += "<div id='arrow' style='top:" + projectiles[i].currentY + "px; left:" + projectiles[i].currentX + "px;'></div>"
					// }
				}
			}
			function checkMageProjectileWallCollision(){
				for(var i = 0; i < projectiles.length; i++){
					if(projectileCollision(mageProjectiles[i])){
						mageProjectiles[i] = mageProjectiles[mageProjectiles.length-1];
						mageProjectiles.pop();
						i--;	
					}
					else{
					string += "<div id='lightning_bolt' style='top:" + mageProjectiles[i].currentY + "px; left:" + mageProjectiles[i].currentX + "px;'></div>"
					}
				}
			}
			

// START NPCs HERE

	
			function lineOfSight(unit, player){
				var playerCoord = [player.x, player.y];
				for(var i = 0; i < wall.length; i++){
					var npcCoord = [unit.x, unit.y];
					
					if(player[0] != unit[0]){
						var slope = (player[1]-unit[1])/(player[0] - unit[0]);
					
						// for Player left of NPC
						if((unit[0]-player[0])>0){
							if(wall[i].x+wall[i].width < unit[0] && wall[i].x+wall[i].width > player[0]){
								var vPos = ((unit[0]-wall[i].x+wall[i].width)*slope)+unit[1];
								if((wall[i].y >= vPos) && (vPos <= (wall[i].y+wall[i].height))){
									return false;	
								}	
							}
						}
						// for Player right of NPC
						else if((unit[0]-player[0])<0){
							if(wall[i].x < unit[0] && wall[i].x > player[0]){
								var vPos = ((unit[0]-wall[i].x)*slope)+unit[1];
								if((wall[i].y >= vPos) && (vPos <= (wall[i].y+wall[i].height))){
									return false;	
								}	
							}		
						}
					}

					else if((unit[0]-player[0]) === 0){
					// for Player Above NPC and Slope === 0
						if(unit[0] < wall[i].x+wall[i].width && unit[0] > wall[i].x){
							if(wall[i].y > unit[1] && wall[i].y < player[1]){
								return false;
							}
						}
			
					// for Player Below NPC and Slope === 0
						if(unit[0] < wall[i].x+wall[i].width && unit[0] > wall[i].x){
							if(wall[i].y < unit[1] && wall[i].y > player[1]){
								return false;
							}
						}		
					}
				}
				return true;
			}	

			function displaySoldiers(){
				var string = "";
				for(var i = 0; i<soldiers.length; i++){
					var healthBar = "";
					if (soldiers[i].health != 100){
						healthBar = "<div style='height: 3px;width:" + (soldiers[i].health * .4) + "px; background-color: red;'></div>"
					}
					string += "<div class='soldiers' style='top:" + soldiers[i].y + "px; left:" + soldiers[i].x + "px; height:" + soldiers[i].height + "px; width:" + soldiers[i].width + "px;'><img id='soldierImg' src='../../static/gamePlay/img/sword_idle.png'>" + healthBar + "</div>";
				}
				document.getElementById("soldiers").innerHTML=string;
			}

			function displayMages(){
				var string = "";
				for(var i = 0; i<mages.length; i++){
					var healthBar = "";
					if (mages[i].health != 100){
						healthBar = "<div style='height: 3px;width:" + (mages[i].health * .4) + "px; background-color: red;'></div>"
					}
					string += "<div class='mages' style='top:" + mages[i].y + "px; left:" + mages[i].x + "px; height:" + mages[i].height + "px; width:" + mages[i].width + "px;'><img id='mageImg' src='../../static/gamePlay/img/mage_idle.png'>" + healthBar + "</div>";
				}
				document.getElementById("mages").innerHTML=string;
			}

			function displayArchers(){
				var string = "";
				for(var i = 0; i<archers.length; i++){
					var healthBar = "";
					if (archers[i].health != 100){
						healthBar = "<div style='height: 3px;width:" + (archers[i].health * .4) + "px; background-color: red;'></div>"
					}
					string += "<div class='archers' style='top:" + archers[i].y + "px; left:" + archers[i].x + "px; height:" + archers[i].height + "px; width:" + archers[i].width + "px;'><img id='archerImg' src='../../static/gamePlay/img/archer_red_idle.png'>" + healthBar + "</div>";
				}
				document.getElementById("archers").innerHTML=string;
			}

			function displayBoss(){
				var string = "";
				var healthBar = "";
				var bossDirection = "../../static/gamePlay/img/minotaur_left.png";
				if (boss.velocity.x > 1){
					bossDirection = "../../static/gamePlay/img/minotaur_right.png";
				}
				if (boss.health != 100){
					healthBar = "<div style='height: 3px;width:" + (boss.health * .08) + "px; background-color: red;'></div>"
				}
				string += "<div class='boss' style='top:" + boss.y + "px; left:" + boss.x + "px; height:" + boss.height + "px; width:" + boss.width + "px;'><img id='bossImg' src='"+ bossDirection +"'>" + healthBar + "</div>";
				document.getElementById("boss").innerHTML=string;
				console.log(boss.health);
			}

			function soldierMove(player){
				target = [player.x, player.y];
				for (var i = 0; i < soldiers.length; i++) {
					if(soldiers[i].canMove){
						var centerX = soldiers[i].x + ((player.width/2)-10);
						var centerY = soldiers[i].y + (player.height/2);
						var targetX = target[0];
						var targetY = target[1];
						var distanceX = targetX - centerX;
						var distanceY = targetY - centerY;
						var theta = (Math.atan2(distanceY, distanceX));

						// right**********************
						if(theta >= (-Math.PI/8) && theta <= (Math.PI/8)){
							soldiers[i].velocity.x = 2;
							soldiers[i].velocity.y = 0;
						// down right ***********
						}else if((Math.PI/8) < theta && theta <= (3*Math.PI/8)){
							soldiers[i].velocity.x = 1.41;
							soldiers[i].velocity.y = 1.41;
						// down *************
						}else if((3*Math.PI/8) < theta && theta <= (5*Math.PI/8)){
							soldiers[i].velocity.x = 0;
							soldiers[i].velocity.y = 2;
						// down left *******************
						}else if((5*Math.PI/8) < theta && theta <= (7*Math.PI/8)){
							soldiers[i].velocity.x = -1.41;
							soldiers[i].velocity.y = 1.41;
						// down left***************
						}else if((-7*Math.PI/8) < theta && theta <= (-5*Math.PI/8)){
							soldiers[i].velocity.x = -1.41;
							soldiers[i].velocity.y = -1.41;
						// up**************
						}else if((-5*Math.PI/8) < theta && theta <= (-3*Math.PI/8)){
							soldiers[i].velocity.x = 0;
							soldiers[i].velocity.y = -2;
						// up right ***********
						}else if((-3*Math.PI/8) < theta && theta <= (-1*Math.PI/8)){
							soldiers[i].velocity.x = 1.41;
							soldiers[i].velocity.y = -1.41;
						// left 
						}else{
							soldiers[i].velocity.x = -2;
							soldiers[i].velocity.y = 0;
						}
					}
				}

				for(var i = 0; i < soldiers.length; i++){
					soldiers[i].x += soldiers[i].velocity.x;
					soldiers[i].y += soldiers[i].velocity.y;
					borderCollision(soldiers[i]);
				}
			}

			function mageMove(player){
				target = [player.x, player.y];
				for (var i = 0; i < mages.length; i++) {
					if(mages[i].canMove){
						var centerX = mages[i].x + ((player.width/2)-10);
						var centerY = mages[i].y + (player.height/2);
						var targetX = target[0];
						var targetY = target[1];
						var distanceX = targetX - centerX;
						var distanceY = targetY - centerY;
						var dx = Math.abs(mages[i].x-player.x);
						var dy = Math.abs(mages[i].y-player.y);
						var theta = (Math.atan2(distanceY, distanceX));
						var distance = Math.sqrt((dx*dx)+(dy*dy));

						// right**********************
						if(distance>mages[i].teleRadius){
							if(theta >= (-Math.PI/8) && theta <= (Math.PI/8)){
								mages[i].velocity.x = 2;
								mages[i].velocity.y = 0;
							// down right ***********
							}else if((Math.PI/8) < theta && theta <= (3*Math.PI/8)){
								mages[i].velocity.x = 1.41;
								mages[i].velocity.y = 1.41;
							// down *************
							}else if((3*Math.PI/8) < theta && theta <= (5*Math.PI/8)){
								mages[i].velocity.x = 0;
								mages[i].velocity.y = 2;
							// down left *******************
							}else if((5*Math.PI/8) < theta && theta <= (7*Math.PI/8)){
								mages[i].velocity.x = -1.41;
								mages[i].velocity.y = 1.41;
							// down left***************
							}else if((-7*Math.PI/8) < theta && theta <= (-5*Math.PI/8)){
								mages[i].velocity.x = -1.41;
								mages[i].velocity.y = -1.41;
							// up**************
							}else if((-5*Math.PI/8) < theta && theta <= (-3*Math.PI/8)){
								mages[i].velocity.x = 0;
								mages[i].velocity.y = -2;
							// up right ***********
							}else if((-3*Math.PI/8) < theta && theta <= (-1*Math.PI/8)){
								mages[i].velocity.x = 1.41;
								mages[i].velocity.y = -1.41;
							// left 
							}else{
								mages[i].velocity.x = -2;
								mages[i].velocity.y = 0;
							}
						}
						else if(distance<mages[i].teleRadius && distance> mages[i].shotRadius || distance < 100){
							mages[i].x = (player.x - 200) + ((Math.random()*400)+1);
							mages[i].y = (player.y - 200) + ((Math.random()*400)+1);
							
						}
						else{
							if(mages[i].canShoot==0){
								mageProjectile(mages[i], player);
								mages[i].canShoot = 120;
							}
							if(theta >= (-Math.PI/8) && theta <= (Math.PI/8)){
								mages[i].velocity.x = -1.33;
								mages[i].velocity.y = 0;
							// down right ***********
							}else if((Math.PI/8) < theta && theta <= (3*Math.PI/8)){
								mages[i].velocity.x = -.94;
								mages[i].velocity.y = -.94;
							// down *************
							}else if((3*Math.PI/8) < theta && theta <= (5*Math.PI/8)){
								mages[i].velocity.x = 0;
								mages[i].velocity.y = 1.33;
							// down left *******************
							}else if((5*Math.PI/8) < theta && theta <= (7*Math.PI/8)){
								mages[i].velocity.x = .94;
								mages[i].velocity.y = -.94;
							// down left***************
							}else if((-7*Math.PI/8) < theta && theta <= (-5*Math.PI/8)){
								mages[i].velocity.x = .94;
								mages[i].velocity.y = .94;
							// up**************
							}else if((-5*Math.PI/8) < theta && theta <= (-3*Math.PI/8)){
								mages[i].velocity.x = 0;
								mages[i].velocity.y = 1.33;
							// up right ***********
							}else if((-3*Math.PI/8) < theta && theta <= (-1*Math.PI/8)){
								mages[i].velocity.x = -.94;
								mages[i].velocity.y = .94;
							// left 
							}else{
								mages[i].velocity.x = 1.33;
								mages[i].velocity.y = 0;
							}
						}
					}
				}

				for(var i = 0; i < mages.length; i++){
					mages[i].x += mages[i].velocity.x;
					mages[i].y += mages[i].velocity.y;
					borderCollision(mages[i]);
				}
			}
			
			function archerMove(player){
				target = [player.x, player.y];
				for (var i = 0; i < archers.length; i++) {
					if(archers[i].canMove){
						var centerX = archers[i].x + ((player.width/2)-10);
						var centerY = archers[i].y + (player.height/2);
						var targetX = target[0];
						var targetY = target[1];
						var distanceX = targetX - centerX;
						var distanceY = targetY - centerY;
						var dx = Math.abs(archers[i].x-player.x);
						var dy = Math.abs(archers[i].y-player.y);
						var theta = (Math.atan2(distanceY, distanceX));
						var distance = Math.sqrt((dx*dx)+(dy*dy));

						// right**********************
						if(distance>archers[i].shotRadius){
							if(theta >= (-Math.PI/8) && theta <= (Math.PI/8)){
								archers[i].velocity.x = 2;
								archers[i].velocity.y = 0;
							// down right ***********
							}else if((Math.PI/8) < theta && theta <= (3*Math.PI/8)){
								archers[i].velocity.x = 1.41;
								archers[i].velocity.y = 1.41;
							// down *************
							}else if((3*Math.PI/8) < theta && theta <= (5*Math.PI/8)){
								archers[i].velocity.x = 0;
								archers[i].velocity.y = 2;
							// down left *******************
							}else if((5*Math.PI/8) < theta && theta <= (7*Math.PI/8)){
								archers[i].velocity.x = -1.41;
								archers[i].velocity.y = 1.41;
							// down left***************
							}else if((-7*Math.PI/8) < theta && theta <= (-5*Math.PI/8)){
								archers[i].velocity.x = -1.41;
								archers[i].velocity.y = -1.41;
							// up**************
							}else if((-5*Math.PI/8) < theta && theta <= (-3*Math.PI/8)){
								archers[i].velocity.x = 0;
								archers[i].velocity.y = -2;
							// up right ***********
							}else if((-3*Math.PI/8) < theta && theta <= (-1*Math.PI/8)){
								archers[i].velocity.x = 1.41;
								archers[i].velocity.y = -1.41;
							// left 
							}else{
								archers[i].velocity.x = -2;
								archers[i].velocity.y = 0;
							}
						}
						else{
							if(archers[i].canShoot==0){
								archerProjectile(archers[i], player);
								archers[i].canShoot = 40;
							}
							if(theta >= (-Math.PI/8) && theta <= (Math.PI/8)){
								archers[i].velocity.x = -2;
								archers[i].velocity.y = 0;
							// down right ***********
							}else if((Math.PI/8) < theta && theta <= (3*Math.PI/8)){
								archers[i].velocity.x = -1.41;
								archers[i].velocity.y = -1.41;
							// down *************
							}else if((3*Math.PI/8) < theta && theta <= (5*Math.PI/8)){
								archers[i].velocity.x = 0;
								archers[i].velocity.y = 2;
							// down left *******************
							}else if((5*Math.PI/8) < theta && theta <= (7*Math.PI/8)){
								archers[i].velocity.x = 1.41;
								archers[i].velocity.y = -1.41;
							// down left***************
							}else if((-7*Math.PI/8) < theta && theta <= (-5*Math.PI/8)){
								archers[i].velocity.x = 1.41;
								archers[i].velocity.y = 1.41;
							// up**************
							}else if((-5*Math.PI/8) < theta && theta <= (-3*Math.PI/8)){
								archers[i].velocity.x = 0;
								archers[i].velocity.y = 2;
							// up right ***********
							}else if((-3*Math.PI/8) < theta && theta <= (-1*Math.PI/8)){
								archers[i].velocity.x = -1.41;
								archers[i].velocity.y = 1.41;
							// left 
							}else{
								archers[i].velocity.x = 2;
								archers[i].velocity.y = 0;
							}
						}
					}
				}

				for(var i = 0; i < archers.length; i++){
					archers[i].x += archers[i].velocity.x;
					archers[i].y += archers[i].velocity.y;
					borderCollision(archers[i]);
				}
			}

			function bossMove(player){
				target = [player.x, player.y];
					var centerX = boss.x + ((player.width/2)-10);
					var centerY = boss.y + (player.height/2);
					var targetX = target[0];
					var targetY = target[1];
					var distanceX = targetX - centerX;
					var distanceY = targetY - centerY;
					var theta = (Math.atan2(distanceY, distanceX));

					// right**********************
					if(theta >= (-Math.PI/8) && theta <= (Math.PI/8)){
						boss.velocity.x = 3.5;
						boss.velocity.y = 0;
					// down right ***********
					}else if((Math.PI/8) < theta && theta <= (3*Math.PI/8)){
						boss.velocity.x = 2.4675;
						boss.velocity.y = 2.4675;
					// down *************
					}else if((3*Math.PI/8) < theta && theta <= (5*Math.PI/8)){
						boss.velocity.x = 0;
						boss.velocity.y = 3.5;
					// down left *******************
					}else if((5*Math.PI/8) < theta && theta <= (7*Math.PI/8)){
						boss.velocity.x = -2.4675;
						boss.velocity.y = 2.4675;
					// down left***************
					}else if((-7*Math.PI/8) < theta && theta <= (-5*Math.PI/8)){
						boss.velocity.x = -2.4675;
						boss.velocity.y = -2.4675;
					// up**************
					}else if((-5*Math.PI/8) < theta && theta <= (-3*Math.PI/8)){
						boss.velocity.x = 0;
						boss.velocity.y = -3.5;
					// up right ***********
					}else if((-3*Math.PI/8) < theta && theta <= (-1*Math.PI/8)){
						boss.velocity.x = 2.4675;
						boss.velocity.y = -2.4675;
					// left 
					}else{
						boss.velocity.x = -3.5;
						boss.velocity.y = 0;
					}
					boss.x += boss.velocity.x;
					boss.y += boss.velocity.y;
			}

			function npcCollision(unit,player){
				//attack
				var dx = unit.x-player.x;
				var dy = unit.y-player.y;
				var distance = Math.sqrt((dx*dx)+(dy*dy));
				if (distance<unit.radius+player.radius) {
					//collision
					var theta = Math.atan2(dy,dx)
					knockX = -4*Math.cos(theta);
					knockY = -4*Math.sin(theta);
					if(player.takesDamage){
						canMove = false;
						player.damagedTimer = 60;
						player.health -= 20;
						player.attackTimer = 60;
					}
				}
			}

			function enemyWallCollision(unit){
				for(var i = 0; i < wall.length; i++){
					
					//coming from top
					if ((unit.x < wall[i].x + wall[i].width) && (unit.x +unit.width > wall[i].x) && (unit.y + unit.height + unit.velocity.y > wall[i].y) && (unit.y < wall[i].y)){
						if (unit.x + unit.width - unit.velocity.x <= wall[i].x){
						}else if (unit.x - unit.velocity.x >= wall[i].x + wall[i].width){
						}
						else if (unit.velocity.y < 0) {
						}
						else if (unit.velocity.y > 0) {
							unit.y = wall[i].y-unit.height-unit.velocity.y;
							unit.canMove = false;
							unit.canMoveTimer = 10;
							findEndofWall(unit, wall[i]);
						}
					}
					//coming from bottom
					if ((unit.x < wall[i].x + wall[i].width) && (unit.x +unit.width > wall[i].x) && (unit.y + unit.velocity.y < wall[i].y +wall[i].height) && (unit.y + unit.height> wall[i].y)){
						if (unit.x + unit.width - unit.velocity.x <= wall[i].x){
						}else if (unit.x - unit.velocity.x >= wall[i].x + wall[i].width){
						}
						else if (unit.velocity.y < 0) {
							unit.y = wall[i].y + wall[i].height - unit.velocity.y;
							unit.canMove = false;
							unit.canMoveTimer = 10;
							findEndofWall(unit, wall[i]);
						}
						else if (unit.velocity.y > 0) {
						}
					}
					//coming from left
					if ((unit.x+unit.width+unit.velocity.x > wall[i].x) && (unit.x < wall[i].x+wall[i].width) && (unit.y < wall[i].y + wall[i].height) && (unit.y + unit.height > wall[i].y)){
						if (unit.y + unit.height - unit.velocity.y <= wall[i].y){
						}else if (unit.y - unit.velocity.y >= wall[i].y + wall[i].height){
						}else if (unit.velocity.x < 0) {
						}else if (unit.velocity.x > 0) {
							unit.x = wall[i].x - unit.width - unit.velocity.x;
							unit.canMove = false;
							unit.canMoveTimer = 10;
							findEndofWall(unit, wall[i]);
						}
					}
					// coming from right
					if (((unit.x + unit.velocity.x < wall[i].x +wall[i].width) && (unit.x + unit.width > wall[i].x)) && (unit.y < wall[i].y + wall[i].height) && (unit.y + unit.height > wall[i].y)){
						if (unit.y + unit.height - unit.velocity.y <= wall[i].y){
						}else if (unit.y - unit.velocity.y >= wall[i].y + wall[i].height){
						}else if (unit.velocity.x < 0) {
							unit.x = wall[i].x + wall[i].width - unit.velocity.x;
							unit.canMove = false;
							unit.canMoveTimer = 10;
							findEndofWall(unit, wall[i]);
						}else if (unit.velocity.x > 0) {
						}
					}
				}
			}


			function bossWallCollision(unit){
				for(var i = 0; i < wall.length; i++){
					
					//coming from top
					if ((unit.x < (wall[i].x + wall[i].width) && unit.x +unit.width > wall[i].x) && ((unit.y + unit.height + unit.velocity.y > wall[i].y) && (unit.y < wall[i].y))){
						if (unit.x + unit.width - unit.velocity.x <= wall[i].x){
						}else if (unit.x - unit.velocity.x >= wall[i].x + wall[i].width){
						}
						else if (unit.velocity.y < 0) {
						}
						else if (unit.velocity.y > 0) {
							if(i!=wall.length-1){
								wall[i] = wall.pop();
								i--;
								bossStunTimer = 120;
							}
							else{
								wall.pop();
								bossStunTimer = 120;
							}
						}
					}
					//coming from bottom
					if ((unit.x < (wall[i].x + wall[i].width) && unit.x +unit.width > wall[i].x) && ((unit.y + unit.velocity.y < wall[i].y +wall[i].height) && (unit.y + unit.height> wall[i].y))){
						if (unit.x + unit.width - unit.velocity.x <= wall[i].x){
							// console.log("&&&&&&&1")
						}else if (unit.x - unit.velocity.x >= wall[i].x + wall[i].width){
							// console.log("&&&&&&&2")
						}
						else if (unit.velocity.y < 0) {
							if(i!=wall.length-1){
								wall[i] = wall.pop();
								i--;
								bossStunTimer = 120;
							}
							else{
								wall.pop();
								bossStunTimer = 120;
							}
						}
						else if (unit.velocity.y > 0) {
							// console.log("&&&&&&&3")
						}
					}
					//coming from left
					if ((unit.x+unit.width+unit.velocity.x > wall[i].x) && (unit.x < wall[i].x+wall[i].width) && (unit.y < wall[i].y + wall[i].height && unit.y + unit.height > wall[i].y)){
						if (unit.y + unit.height - unit.velocity.y <= wall[i].y){
							// console.log("#######1")
						}else if (unit.y - unit.velocity.y >= wall[i].y + wall[i].height){
							// console.log("#######2")
						}else if (unit.velocity.x < 0) {
							// console.log("#######3")
						}else if (unit.velocity.x > 0) {
							if(i!=wall.length-1){
								wall[i] = wall.pop();
								i--;
								bossStunTimer = 120;
							}
							else{
								wall.pop();
								bossStunTimer = 120;
							}
						}
					}
					// coming from right
					if (((unit.x + unit.velocity.x < wall[i].x +wall[i].width) && (unit.x + unit.width > wall[i].x)) && (unit.y < wall[i].y + wall[i].height && unit.y + unit.height > wall[i].y)){
						if (unit.y + unit.height - unit.velocity.y <= wall[i].y){
							// console.log("AHHHHHH1")
						}else if (unit.y - unit.velocity.y >= wall[i].y + wall[i].height){
							// console.log("AHHHHHH2")
						}else if (unit.velocity.x < 0) {
							if(i!=wall.length-1){
								wall[i] = wall.pop();
								i--;
								bossStunTimer = 120;
							}
							else{
								wall.pop();
								bossStunTimer = 120;
							}
						}else if (unit.velocity.x > 0) {
							// console.log("AHHHHHH3")
						}
					}
				}
			}

			function displayDead(){
				var string = "";
				for(var i = 0; i<deadSoldiers.length;i++){
					string += "<div class='deadSoldiers' style='top:" + deadSoldiers[i].y + "px; left:" + deadSoldiers[i].x + "px;'></div>";
				}
				document.getElementById("deadSoldiers").innerHTML=string;
			}
			function displayDeadM(){
				var string = "";
				for(var i = 0; i<deadMages.length;i++){
					string += "<div class='deadMages' style='top:" + deadMages[i].y + "px; left:" + deadMages[i].x + "px;'></div>";
				}
				document.getElementById("deadMages").innerHTML=string;
			}
			function displayDeadA(){
				var string = "";
				for(var i = 0; i<deadArchers.length;i++){
					string += "<div class='deadArchers' style='top:" + deadArchers[i].y + "px; left:" + deadArchers[i].x + "px;'></div>";
				}
				document.getElementById("deadArchers").innerHTML=string;
			}

			function findEndofWall(unit, wall){
				//unit above and left
				if(unit.y<player.y && unit.x < player.x){
					if (Math.abs(player.x-wall.x) < Math.abs((player.x+player.width)-(wall.x+wall.width))){
						unit.velocity.x = -1.41;
						unit.velocity.y = 1.41;
					}else{
						unit.velocity.x = 1.41;
						unit.velocity.y = 1.41;
					}
				}
				//unit above and right
				else if(unit.y<player.y && unit.x > player.x){
					if (Math.abs(player.x-wall.x) < Math.abs((player.x+player.width)-(wall.x+wall.width))){
						unit.velocity.x = -1.41;
						unit.velocity.y = 1.41;
					}else{
						unit.velocity.x = 1.41;
						unit.velocity.y = 1.41;
					}
				}
				
				//unit below and right
				else if (unit.y>player.y && unit.x>player.x) {
					if (Math.abs(player.x-wall.x) < Math.abs((player.x+player.width)-(wall.x+wall.width))){
						unit.velocity.x = -1.41;
						unit.velocity.y = 1.41;
					}else{
						unit.velocity.x = 1.41;
						unit.velocity.y = 1.41;
					}
				}
				//unit below and left
				else{
					if( Math.abs(player.y-wall.y) < Math.abs((player.y+player.height)-(wall.y+wall.height))){
						unit.velocity.x = -1.41;
						unit.velocity.y = -1.41;
					}else{
						unit.velocity.x = -1.41;
						unit.velocity.y = 1.41;
					}
				}
			}

			// function npcTonpcCollision(){
			// 	for (var i = 0; i < soldiers.length; i++){
			// 		for (var j = 0; j < soldiers.length; j++){
			// 			var dx = soldiers[i].x-soldiers[j].x;
			// 			var dy = soldiers[i].y-soldiers[j].y;
			// 			var distance = Math.sqrt((dx*dx)+(dy*dy));
			// 			if (distance<soldiers[i].radius+soldiers[j].radius && i != j) {
			// 				var theta = Math.atan2(dy,dx);
			// 				soldiers[i].x = soldiers[i].x + (2 * Math.cos(theta));
			// 				soldiers[i].y = soldiers[i].y + (2 * Math.sin(theta));
			// 			}
			// 		}
			// 		if (jQuery.isEmptyObject(boss) == false){
			// 			var dx = soldiers[i].x-boss.x;
			// 			var dy = soldiers[i].y-boss.y;
			// 			var distance = Math.sqrt((dx*dx)+(dy*dy));
			// 			if (distance<soldiers[i].radius+boss.radius) {
			// 				var theta = Math.atan2(dy,dx);
			// 				soldiers[i].x = soldiers[i].x + (2 * Math.cos(theta));
			// 				soldiers[i].y = soldiers[i].y + (2 * Math.sin(theta));
			// 			}
			// 		}
			// 	}
			// }

			function npcTonpcCollision(){
				for (var i = 0; i < soldiers.length; i++){
					for (var j = 0; j < soldiers.length; j++){
						var dx = soldiers[i].x-soldiers[j].x;
						var dy = soldiers[i].y-soldiers[j].y;
						var distance = Math.sqrt((dx*dx)+(dy*dy));
						if (distance<soldiers[i].radius+soldiers[j].radius && i != j) {
							var theta = Math.atan2(dy,dx);
							soldiers[i].x = soldiers[i].x + (2 * Math.cos(theta));
							soldiers[i].y = soldiers[i].y + (2 * Math.sin(theta));
						}
					}
					for(var k = 0; k < mages.length; k++){
						var dx = soldiers[i].x-mages[k].x;
						var dy = soldiers[i].y-mages[k].y;
						var distance = Math.sqrt((dx*dx)+(dy*dy));
						if (distance<soldiers[i].radius+mages[k].radius) {
							var theta = Math.atan2(dy,dx);
							soldiers[i].x = soldiers[i].x + (2 * Math.cos(theta));
							soldiers[i].y = soldiers[i].y + (2 * Math.sin(theta));
						}
					}
					for(var l = 0; l < archers.length; l++){
						var dx = soldiers[i].x-archers[l].x;
						var dy = soldiers[i].y-archers[l].y;
						var distance = Math.sqrt((dx*dx)+(dy*dy));
						if (distance<soldiers[i].radius+archers[l].radius) {
							var theta = Math.atan2(dy,dx);
							soldiers[i].x = soldiers[i].x + (2 * Math.cos(theta));
							soldiers[i].y = soldiers[i].y + (2 * Math.sin(theta));
						}
					}
					if (jQuery.isEmptyObject(boss) == false){
						var dx = soldiers[i].x-boss.x;
						var dy = soldiers[i].y-boss.y;
						var distance = Math.sqrt((dx*dx)+(dy*dy));
						if (distance<soldiers[i].radius+boss.radius) {
							var theta = Math.atan2(dy,dx);
							soldiers[i].x = soldiers[i].x + (2 * Math.cos(theta));
							soldiers[i].y = soldiers[i].y + (2 * Math.sin(theta));
						}
					}
				}
				for (var a = 0; a < archers.length; a++){
					for (var b = 0; b < archers.length; b++){
						var dx = archers[a].x-archers[b].x;
						var dy = archers[a].y-archers[b].y;
						var distance = Math.sqrt((dx*dx)+(dy*dy));
						if (distance<archers[a].radius+archers[b].radius && a != b) {
							var theta = Math.atan2(dy,dx);
							archers[a].x = archers[a].x + (2 * Math.cos(theta));
							archers[a].y = archers[a].y + (2 * Math.sin(theta));
						}
					}
					for(var c = 0; c < mages.length; c++){
						var dx = archers[a].x-mages[c].x;
						var dy = archers[a].y-mages[c].y;
						var distance = Math.sqrt((dx*dx)+(dy*dy));
						if (distance<archers[a].radius+mages[c].radius) {
							var theta = Math.atan2(dy,dx);
							archers[a].x = archers[a].x + (2 * Math.cos(theta));
							archers[a].y = archers[a].y + (2 * Math.sin(theta));
						}
					}
				}
				for (var m = 0; m < mages.length; m++){
					for (var n = 0; n < mages.length; n++){
						var dx = mages[m].x-mages[n].x;
						var dy = mages[m].y-mages[n].y;
						var distance = Math.sqrt((dx*dx)+(dy*dy));
						if (distance<mages[m].radius+mages[n].radius && m != n) {
							var theta = Math.atan2(dy,dx);
							mages[m].x = mages[m].x + (2 * Math.cos(theta));
							mages[m].y = mages[m].y + (2 * Math.sin(theta));
						}
					}
				}
			}
// START GAMEPLAY

	$("#gameRegion").mousemove(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		coordinates = [mouseX,mouseY];
		if(mouseX < player.x+(player.width/2)){
			document.getElementById("player").style.transform = "rotateY(0deg)";
		}
		if(mouseX > player.x+(player.width/2)){
			document.getElementById("player").style.transform = "rotateY(180deg)";
		}
	});

	function loadUI(){
		var health = player.health;
		var healthBar = health *2;
		var healthColor = 'green';
		if (health < 30){
			healthColor = 'red';
		}else if (health > 31 && health < 60){
			healthColor = 'yellow';
		}
		var charge = player.chargeTimer;
		var chargeBar = charge*10/3;
		if(healthBar < 0){
			healthBar = 0;
		}
		document.getElementById("health").style.backgroundColor = healthColor;
		document.getElementById("score").innerHTML="<h2>Score: " + score + "</h2>";
		document.getElementById("currentHealth").innerHTML="<div id='healthBar' style='height: 30px; width: " + (200 - healthBar) + "px; left: " + healthBar + "px;'> </div>";
		document.getElementById("currentCharge").innerHTML="<div id='chargeBar' style='height: 30px; width: " + (200 - chargeBar) + "px; left: " + chargeBar + "px;'> </div>";
	}
// RESTART METHOD 	
	function restart(){

		console.log("true")
		soliders = [];
		currentLevel = 0;
		score = 0; 
		$("#pause").toggle();
		$("#gameRegion").toggle();
		gameloop = setInterval(loop, (16+(2/3)));
	}

	// function setLevel(){
	// 	readyUpTimer = 120;
	// 	wall = levels[currentLevel].wall;
	// 	soldiers = levels[currentLevel].soldier;
	// 	boss = levels[currentLevel].boss;
	// 	projectiles = [];
	// 	if (boss == {}){

	// 	}
	// 	player.x = levels[currentLevel].spawnPoint.x;
	// 	player.y = levels[currentLevel].spawnPoint.y;
	// 	player.health = 100;
	// 	player.chargeTimer = 0;
	// 	deadSoldiers = [];
	// 	currentLevel++;
	// 	bonusTimeMax = 300 * soldiers.length;
	// 	bonusTime = bonusTimeMax;
	// }
	function setLevel(){
		readyUpTimer = 120;
		wall = levels[currentLevel].wall;
		soldiers = levels[currentLevel].soldier;
		mages = levels[currentLevel].mage;
		archers = levels[currentLevel].archer;
		boss = levels[currentLevel].boss;
		if (boss == {}){

		}
		player.x = levels[currentLevel].spawnPoint.x;
		player.y = levels[currentLevel].spawnPoint.y;
		player.health = 100;
		deadSoldiers = [];
		deadMages = [];
		deadArchers = [];
		currentLevel++;
		bonusTimeMax = 300 * (soldiers.length + mages.length + archers.length);
		bonusTime = bonusTimeMax;
		player.chargeTimer = 0;
	}

	function leaderBoard(){
		var csrftoken = getCookie('csrftoken');
		$.post("/leaderboard", {
			score: score,
			csrfmiddlewaretoken : csrftoken
		});
		string='GAME OVER'
		document.getElementById("readyScreen").innerHTML=string;
	}
	// function bonusPoints(){
	// 	bonusScreenTime = 240
	// 	bonusTimePoints = Math.floor(((bonusTime/bonusTimeMax)*deadSoldiers.length)*100);
	// }
	function bonusPoints(){
		bonusScreenTime = 240;
		bonusTimePoints = Math.floor(((bonusTime/bonusTimeMax)*(deadSoldiers.length + deadMages.length + deadArchers.length))*100);
	}


	function gameOverCheck(){ //upgrade
		if(player.health<1){
			leaderBoard();
			return true;
		}else if(jQuery.isEmptyObject(boss) && soldiers.length == 0 && archers.length == 0 && mages.length == 0 && currentLevel == levels.length){
			score += 1500;
			leaderBoard();
			document.getElementById('readyScreen').innerHTML="<h1>You Win!</h1><h3>Go to the Home page to start a new game.</h3>"
			clearInterval(gameloop);
		}
		return false;
	}

	function loop(){ //upgraded
		if(soldiers.length === 0 && mages.length === 0 && archers.length === 0 && currentLevel > 0 && bonusScreenTime < 1 && jQuery.isEmptyObject(boss)){
			if(currentLevel == levels.length){
				console.log("you win");
				clearInterval(gameloop);
			}else{
				bonusPoints();
			}

		}
		if(soldiers.length === 0 && mages.length === 0 && archers.length === 0 && bonusScreenTime < 2 && jQuery.isEmptyObject(boss)){
			setLevel();
			bonusScreenTime=0;
		}
		if (bonusScreenTime > 0){
			if (bonusScreenTime > 140){
				string="Time Bonus: " + bonusTimePoints;
				document.getElementById("bonusScreen").innerHTML=string;
			}
			else if (bonusScreenTime === 139){
				score += bonusTimePoints;
			}
			else if (bonusScreenTime > 40){
				string="Health Bonus: " + player.health;
				document.getElementById("bonusScreen").innerHTML=string;
			}
			else if (bonusScreenTime === 39){
				score += player.health;
			}
			else {
				string="";
				document.getElementById("bonusScreen").innerHTML=string;
			}
			bonusScreenTime--;
		}
		if(readyUpTimer > 0){
			if(readyUpTimer > 40){
				string="Ready?";
				document.getElementById("readyScreen").innerHTML=string;
			}
			else{
				string="Go!";
				document.getElementById("readyScreen").innerHTML=string;
			}	
			document.getElementById('player').style.left = player.x+"px";
			document.getElementById('player').style.top = player.y+"px";
			displayWalls();
			displaySoldiers();
			displayMages();
			displayArchers();
			if (jQuery.isEmptyObject(boss) == false){
				displayBoss();
			}
			displayDead();
			displayDeadM();
			displayDeadA();
			loadUI();
			readyUpTimer--;
		}
		else{
			string="";
			document.getElementById("readyScreen").innerHTML=string;
			playerMove();
			projectileMove();
			mageProjectileMove(); //upgrade
			archerProjectileMove(); //upgrade
			displayWalls();
			mageMove(player); //upgrade
			archerMove(player); //upgrade
			soldierMove(player);
			if (bossStunTimer === 0 && jQuery.isEmptyObject(boss) == false){
				bossMove(player);
			}
			else if (jQuery.isEmptyObject(boss) == false) {
				bossStunTimer--;
			}
			for(var i = 0; i < soldiers.length; i++){
				npcCollision(soldiers[i], player);
			}
			for(var i = 0; i < mages.length; i++){
				npcCollision(mages[i], player);
			}
			for(var i = 0; i < archers.length; i++){
				npcCollision(archers[i], player);
			}
			for (var i = 0; i<soldiers.length; i++){
				enemyWallCollision(soldiers[i]);
			}
			for (var i = 0; i<mages.length; i++){
				enemyWallCollision(mages[i]);
			}
			for (var i = 0; i<archers.length; i++){
				enemyWallCollision(archers[i]);
			}
			if (jQuery.isEmptyObject(boss) == false){
				npcCollision(boss, player);
				bossWallCollision(boss);
			}
			npcTonpcCollision();
			displaySoldiers();
			displayMages();
			displayArchers();
			if (jQuery.isEmptyObject(boss) == false){
				displayBoss();
			}
			displayDead();
			displayDeadM();
			displayDeadA();
			player.x += player.velocity.x;
			wallCollision(player);
			player.y += player.velocity.y;
			wallCollision(player);
			document.getElementById('player').style.left = player.x+"px";
			document.getElementById('player').style.top = player.y+"px";
			if(player.attackTimer !=0){
				player.attackTimer--;
				document.getElementById("playerImg").src = "../../static/gamePlay/img/archer_attack.png";
				player.chargeTimer=0;
			}
			else if(playerMouseDown == false && player.attackTimer == 0){
				document.getElementById("playerImg").src = "../../static/gamePlay/img/archer_idle.png";
			}
			if(playerMouseDown == true && player.attackTimer == 0){
				if(player.chargeTimer < 60){
					player.chargeTimer++;
				}
				if(player.chargeTimer > 5 && player.chargeTimer < 60){
					document.getElementById("playerImg").src = "../../static/gamePlay/img/archer_draw.png";
				}
				if(player.chargeTimer >= 60){
					document.getElementById("playerImg").src = "../../static/gamePlay/img/archer_fully_charged.png";
				}
			}
			for(var i = 0; i<mages.length;i++){ //upgrade
				if(mages[i].canShoot>0){
					mages[i].canShoot--;
				}
			}
			for(var i = 0; i<archers.length;i++){ //upgrade
				if(archers[i].canShoot>0){
					archers[i].canShoot--;
				}
			}
			if(player.damagedTimer > 1){
				player.takesDamage = false;
				player.damagedTimer--;
				player.velocity.x = knockX;
				player.velocity.y = knockY;
				document.getElementById("playerImg").src = "../../static/gamePlay/img/archer_idle_hit.png";
			}
			else if (player.damagedTimer == 1){
				player.damagedTimer--;
				player.velocity.x = 0;
				player.velocity.y = 0;
			}
			else{
				player.takesDamage = true;
				canMove = true;
			}
			if (player.health>0){ //remove?
				// console.log("health " + player.health);
			}
			else { //remove?
				// console.log("dead");
			}
			for(var i = 0; i<soldiers.length;i++){
				if (soldiers[i].canMoveTimer>0) {
					soldiers[i].canMoveTimer--;
				}else{
					soldiers[i].canMove = true;
				}
			}
			for(var i = 0; i<mages.length;i++){ //upgrade
				if (mages[i].canMoveTimer>0) {
					mages[i].canMoveTimer--;
				}else{
					mages[i].canMove = true;
				}
			}
			for(var i = 0; i<archers.length;i++){ //upgrade
				if (archers[i].canMoveTimer>0) {
					archers[i].canMoveTimer--;
				}else{
					archers[i].canMove = true;
				}
			}
			wallCollision(player);
			borderCollision(player);

			//remove?
			// for (var i = 0; i<soldiers.length; i++){
			// 	enemyWallCollision(soldiers[i]);
			// }
			
			if (gameOverCheck()) {
				string="Game Over!"
				document.getElementById("readyScreen").innerHTML=string;
				clearInterval(gameloop);
			}
			if(bonusTime > 0){
				bonusTime--;
			}
			loadUI();
		}
	}
	var gameloop = setInterval(loop, (16+(2/3)));

	window.addEventListener('keypress',function(e){
		if(paused == false && e.keyCode == 32){
			e.preventDefault();
			clearInterval(gameloop);
			paused = true;
			$("#pause").toggle();
			$("#gameRegion").toggle();
		}
		else if (paused == true && e.keyCode == 32){
			e.preventDefault();
			gameloop = setInterval(loop, (16+(2/3)));
			paused = false;
			$("#pause").toggle();
			$("#gameRegion").toggle();
		}
	});
});
var score = 0;
var objects = [];
var waves;
var pauseActive = false;
var end = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	waves = new Waves();
	waves.chrono.start -= 14000;
	pausefunction();
}

function draw() {
	if (!pauseActive) 
		tickGame();
	render();
}

function tickGame() {
	waves.tick();
	GameOver();
	for(let i = 0; i < objects.length;){
		objects[i].tick();
		if(!objects[i].alive)
			objects.splice(i, 1);
		else
			i++;
	}
	
}

function pausefunction() {
	if(pauseActive)
		waves.chrono.resume();
	else
		waves.chrono.stop();
	pauseActive = !pauseActive;
}

function keyPressed() {
if (keyCode == ESCAPE && !end) {
	pausefunction();
}
}

function render() {
	background(0)
	for(let i = 0; i < objects.length;){
		objects[i].draw();
		if(!objects[i].alive)
			objects.splice(i, 1);
		else
			i++;
	}
	textSize(32);
	fill(255);
	textAlign(CENTER, TOP);
	textStyle(BOLD);
	text("Score: "+score, windowWidth/2, windowHeight/17);
	text("Vague: "+waves.waveNumber, windowWidth/10, windowHeight/17);
	text("Suivante : "+(17-floor(waves.chrono.time()/1000))+" s", windowWidth/10*8, windowHeight/17);
	if(pauseActive){
		push();
		rectMode(CORNER)
		fill(127,127,127,100);
		rect(0,0,width, height);
		pop();
		if (!end)
			text ("Appuyez sur escape pour resumer le jeu", windowWidth/2, windowHeight/2);
	}
	if (end) 
		text ("Vous avez perdu", windowWidth/2, windowHeight/2);
}

function Objet(color) {
	switch(color){
		case "RED":
		this.score = 1;
		this.taille = height*0.05;
		this.r = 255;
		this.g = 0;
		this.b = 0;
		break;
		
		case "GREEN":
		this.taille = height*0.05;
		this.score = 2;
		this.yv = 2;
		this.xv = 2;
		this.r = 0;
		this.g =  255;
		this.b =  0;
		break;
		
		case "PURPLE":
		this.taille = height*0.1;
		this.score = 3;
		this.shrink = 4;
		this.r = 191;
		this.g = 0;
		this.b = 191;
		break;
		
		case "RAINBOW":
		this.taille = height*0.15;
		this.score = 10;
		this.yv = 20;
		this.xv = 20;
		this.r = 255;
		this.g = 0;
		this.b = 0;
		break;
		
		default:
		console.log("couleur invalide");
		
	}
	this.x = random(this.taille/2, width-this.taille/2);
	this.y = random(this.taille/2, height-this.taille/2);
	this.alive = true;
	this.color = color;
	
	this.draw = function(){
		if(this.alive){
			rectMode(CENTER);
			fill(this.r, this.g, this.b);
			rect(this.x, this.y, this.taille, this.taille);
		}
	}
	
	this.tick = function(){
		if(this.color == "GREEN" || this.color == "RAINBOW"){
			this.x += this.xv;
			this.y += this.yv;
			if(this.x < this.taille/2 || this.x > width - this.taille/2){
				this.xv *= -1;
			}
			if(this.y < this.taille/2 || this.y > height - this.taille/2){
				this.yv *= -1;
			}
		}
		if(this.color == "PURPLE"){
			if(this.hover() && mouseIsPressed){
				this.taille -= this.shrink;
			}
			if(this.taille < 1/2.3*height*0.1 && this.alive){
				this.alive = false;
				score += this.score;
			}
		}
		if(this.color == "RAINBOW")
			this.cycleColor();
	}
	
	this.hover = function(){
		return (abs(mouseX - this.x) < this.taille/2 && abs(mouseY - this.y) < this.taille/2);
	}
	
	this.cycleColor = function() {
		let step = 25;
		if(this.r >= 255 && this.b <= 0 && this.g < 255)
			this.g += step;
		if(this.g >= 255 && this.r > 0)
			this.r -= step;
		if(this.g >= 255 && this.r <= 0 && this.b < 255)
			this.b += step;
		if(this.b >= 255 && this.g > 0)
			this.g -= step;
		if(this.b >= 255 && this.g <= 0 && this.g < 255)
			this.r += step;
		if(this.r >= 255 && this.b > 0)
			this.b -= step;
	}
}

function mousePressed() {
	if (!pauseActive) {
	for(O of objects){
		if (O.hover() && O.alive){
			if(!(O.color == "PURPLE")){
				O.alive = false;
				score += O.score;
			}
		}
	}
}
}

function Timer() {
	this.start = new Date().getTime();
	this.pause = undefined;
	
	this.time = function() {
		if(this.pause == undefined)
			return new Date().getTime() - this.start
		else
			return this.pause;
	}
	
	this.reset = function() {
		this.start = new Date().getTime();
	}
	
	this.stop = function() {
		this.pause = this.time();
	}
	
	this.resume = function() {
		this.start = new Date().getTime() - this.pause;
		this.pause = undefined;
	}
}

function Waves() {
	this.chrono = new Timer();
	this.waveNumber = 0;
	
	this.tick = function() {
		if (this.chrono.time() > 17000) {
			this.waveNumber++;
			let mauve = 0;
			for(let i = 0; i < (9+1*this.waveNumber); i++){
				randomObject();
				if(objects[objects.length-1].color == "PURPLE"){
					mauve++;
					if(mauve > 6)
						objects.splice(objects.length-1, 1)
				}
			}
			if(this.waveNumber == 1)
				objects.push(new Objet("RAINBOW"));
			this.chrono.reset();
		}
	}
}

function GameOver() {
	if(objects.length > 50) {
		pausefunction();
		end = true;
}
}

function randomObject(){
	var pixel = floor(random(0,2.8));
		switch(pixel){
			case 0:
				objects.push(new Objet("RED"));
				break;
			case 1:
				objects.push(new Objet("GREEN"));
				break;
			case 2:
				objects.push(new Objet("PURPLE"));
				break;
			default:
				console.log("pixel incorrect");
		}
}

function dist(a, b){
	return abs(a - b);
}

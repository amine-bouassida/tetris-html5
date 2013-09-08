/**
***********************************
* Project: HTML5 Tetris           *
* Author: Mohamed Amine BOUASSIDA *
* Email: amine.bouassida@ieee.org *
* Version: 1.0 Beta               *
* Release date: 31/03/2013        *
***********************************
Bugs to fix:
- More tests for game over conditions
- **Fixed: Set conditions on rotation near edges
- **Fixed: Set conditions on rotation near filled squares
*/
var canvasScreen;
var ctxtScreen;
var squareSize;
var screenColor = '#5C5C5C';
var width = 10, height;
var refreshInterval;
var points;
var shapes;
var currentShape;
var gameOver = false;
var removing = false;
var score = 0;
var paused = false;

// class Shape
function Shape(_p1, _p2, _p3, _p4, _color) {
	var p1 = { 'x': 0, 'y': 0 }, p2 = { 'x': 0, 'y': 0 }, p3 = { 'x': 0, 'y': 0 }, p4 = { 'x': 0, 'y': 0 };
	var color;
	var rotations, rotPosition;
	
	// constructor
	this.color = _color;
	this.p1 = _p1;
	this.p2 = _p2;
	this.p3 = _p3;
	this.p4 = _p4;
	rotations = new Array(4);
	for(i = 0; i < 4; i++)
		rotations[i] = new Array(4);
	rotPosition = 0;
	
	this.initialize = function() {
		this.draw(4, -1);
		this.rotate(0);
	}
	this.draw = function(x, y) {
		p1.x = x;
		p1.y = y;
		ctxtScreen.fillStyle = this.color;
		ctxtScreen.fillRect(squareSize * p1.x + 1, p1.y * squareSize + 1, squareSize - 2, squareSize - 2);
		ctxtScreen.fillRect(squareSize * (p1.x + p2.x) + 1, (p1.y + p2.y) * squareSize + 1, squareSize - 2, squareSize - 2);
		ctxtScreen.fillRect(squareSize * (p1.x + p3.x) + 1, (p1.y + p3.y) * squareSize + 1, squareSize - 2, squareSize - 2);
		ctxtScreen.fillRect(squareSize * (p1.x + p4.x) + 1, (p1.y + p4.y) * squareSize + 1, squareSize - 2, squareSize - 2);
	}
	this.clear = function() {
		ctxtScreen.fillStyle = screenColor;
		ctxtScreen.fillRect(squareSize * p1.x + 1, p1.y * squareSize + 1, squareSize - 2, squareSize - 2);
		ctxtScreen.fillRect(squareSize * (p1.x + p2.x) + 1, (p1.y + p2.y) * squareSize + 1, squareSize - 2, squareSize - 2);
		ctxtScreen.fillRect(squareSize * (p1.x + p3.x) + 1, (p1.y + p3.y) * squareSize + 1, squareSize - 2, squareSize - 2);
		ctxtScreen.fillRect(squareSize * (p1.x + p4.x) + 1, (p1.y + p4.y) * squareSize + 1, squareSize - 2, squareSize - 2);
	}
	this.moveDown = function() {
		var stop = false;
		if(gameOver == false) {
			if(p1.y + 1 == height)
				stop = true;
			else {
					if(p1.x >= 0 && p1.y + 1 >= 0)
						if(points[p1.y + 1][p1.x] != screenColor)
							stop = true;
					if(p2.x + p1.x >= 0 && p2.y + p1.y + 1 >= 0)
						if(points[p2.y + p1.y + 1][p2.x + p1.x] != screenColor)
							stop = true;
					if(p3.x + p1.x >= 0 && p3.y + p1.y + 1 >= 0)
						if(points[p3.y + p1.y + 1][p3.x + p1.x] != screenColor)
							stop = true;
					if(p4.x + p1.x >= 0 && p4.y + p1.y + 1 >= 0)
						if(points[p4.y + p1.y + 1][p4.x + p1.x] != screenColor)
							stop = true;
			}
			if(stop == true) {
				var endOfGame = false;
				
				if(p1.x >= 0 && p1.y >= 0)
					points[p1.y][p1.x] = this.color;
				else
					endOfGame = true;
				if(p2.x + p1.x >= 0 && p2.y + p1.y >= 0)
					points[p2.y + p1.y][p2.x + p1.x] = this.color;
				else
					endOfGame = true;
				if(p3.x + p1.x >= 0 && p3.y + p1.y >= 0)
					points[p3.y + p1.y][p3.x + p1.x] = this.color;
				else
					endOfGame = true;
				if(p4.x + p1.x >= 0 && p4.y + p1.y >= 0)
					points[p4.y + p1.y][p4.x + p1.x] = this.color;
				else
					endOfGame = true;
				if((endOfGame == true) && (points[p1.y + 1][p1.x] != screenColor)) {
					clearInterval(refreshInterval);
					gameOver = true;
					ctxtScreen.font = '60pt Calibri';
					ctxtScreen.lineWidth = 2;
					ctxtScreen.strokeStyle = 'white';
					ctxtScreen.fillStyle = 'rgba(0, 0, 0, 1)';
					ctxtScreen.fillText('Game over!', 10, ctxtScreen.canvas.height / 2);
					ctxtScreen.strokeText('Game over!', 10, ctxtScreen.canvas.height / 2);
					$(".buttons").removeClass("inline");
				}
				currentShape = Math.floor((Math.random()*10)) % 7; 
				shapes[currentShape].initialize();
			}
			else {
				this.clear();
				this.draw(p1.x, p1.y + 1);
			}
		}
						
		return stop;
	}
	this.moveLeft = function() {
		var obstaclesLeft = false;
		if(p1.x - 1 >= 0 && p1.y >= 0)
			if(points[p1.y][p1.x - 1] != screenColor)
				obstaclesLeft = true;
		if(p2.x + p1.x - 1 >= 0 && p2.y + p1.y >= 0)
			if(points[p2.y + p1.y][p2.x + p1.x - 1] != screenColor)
				obstaclesLeft = true;
		if(p3.x + p1.x - 1 >= 0 && p3.y + p1.y >= 0)
			if(points[p3.y + p1.y][p3.x + p1.x - 1] != screenColor)
				obstaclesLeft = true;
		if(p4.x + p1.x - 1 >= 0 && p4.y + p1.y >= 0)
			if(points[p4.y + p1.y][p4.x + p1.x - 1] != screenColor)
				obstaclesLeft = true;
		if((p1.x > 0) && ((p1.x + p2.x) > 0) && ((p1.x + p3.x) > 0) && ((p1.x + p4.x) > 0) && (obstaclesLeft == false)) {
			this.clear();
			this.draw(p1.x - 1, p1.y);
		}
	}
	this.moveRight = function() {
		var obstaclesRight = false;
		if(p1.x + 1 >= 0 && p1.y >= 0)
			if(points[p1.y][p1.x + 1] != screenColor)
				obstaclesRight = true;
		if(p2.x + p1.x + 1 >= 0 && p2.y + p1.y >= 0)
			if(points[p2.y + p1.y][p2.x + p1.x + 1] != screenColor)
				obstaclesRight = true;
		if(p3.x + p1.x + 1 >= 0 && p3.y + p1.y >= 0)
			if(points[p3.y + p1.y][p3.x + p1.x + 1] != screenColor)
				obstaclesRight = true;
		if(p4.x + p1.x + 1 >= 0 && p4.y + p1.y >= 0)
			if(points[p4.y + p1.y][p4.x + p1.x + 1] != screenColor)
				obstaclesRight = true;
		if((p1.x < width - 1) && ((p1.x + p2.x) < width - 1) && ((p1.x + p3.x) < width - 1) && ((p1.x + p4.x) < width - 1) && (obstaclesRight == false)) {
			this.clear();
			this.draw(p1.x + 1, p1.y);
		}
	}
	this.setRotation = function(i, __p1, __p2, __p3, __p4) {
		rotations[i][0] = __p1;
		rotations[i][1] = __p2;
		rotations[i][2] = __p3;
		rotations[i][3] = __p4;
	}
	this.rotate = function(pos) {
		var posSave = rotPosition;
		var p1xSave = p1.x;
		
		if(pos == -1)
			rotPosition = (rotPosition + 1) % 4;
		else
			rotPosition = pos;
		this.clear();
		p2.x = rotations[rotPosition][1].x;
		p2.y = rotations[rotPosition][1].y;
		p3.x = rotations[rotPosition][2].x;
		p3.y = rotations[rotPosition][2].y;
		p4.x = rotations[rotPosition][3].x;
		p4.y = rotations[rotPosition][3].y;
		// Cleaning edges
		if(p1.x + p2.x < 0)
			p1.x = -p2.x;
		if(p1.x + p3.x < 0)
			p1.x = -p3.x;
		if(p1.x + p4.x < 0)
			p1.x = -p4.x;
		if(p1.x + p2.x > width - 1)
			p1.x = width - p2.x - 1;
		if(p1.x + p3.x > width - 1)
			p1.x = width - p3.x - 1;
		if(p1.x + p4.x > width - 1)
			p1.x = width - p4.x - 1;
		// Checking if we can rotate
		if(((p1.y > -1) && (points[p1.y][p1.x] != screenColor)) || ((p1.y + p2.y > -1) && (points[p1.y + p2.y][p1.x + p2.x] != screenColor)) || ((p1.y + p3.y > -1) && (points[p1.y + p3.y][p1.x + p3.x] != screenColor)) || ((p1.y + p4.y > -1) && (points[p1.y + p4.y][p1.x + p4.x] != screenColor))) {
			rotPosition = posSave;
			p1.x = p1xSave;
			p2.x = rotations[rotPosition][1].x;
			p2.y = rotations[rotPosition][1].y;
			p3.x = rotations[rotPosition][2].x;
			p3.y = rotations[rotPosition][2].y;
			p4.x = rotations[rotPosition][3].x;
			p4.y = rotations[rotPosition][3].y;
		}
		this.draw(p1.x, p1.y);
	}
}
function stdShape(i) {
	var col;
	var _p1 = { 'x': 0, 'y': 0 }, _p2 = { 'x': 0, 'y': 0 }, _p3 = { 'x': 0, 'y': 0 }, _p4 = { 'x': 0, 'y': 0 };
	var _r10 = { 'x': 0, 'y': 0 }, _r11 = { 'x': 0, 'y': 0 }, _r12 = { 'x': 0, 'y': 0 }, _r13 = { 'x': 0, 'y': 0 };
	var _r20 = { 'x': 0, 'y': 0 }, _r21 = { 'x': 0, 'y': 0 }, _r22 = { 'x': 0, 'y': 0 }, _r23 = { 'x': 0, 'y': 0 };
	var _r30 = { 'x': 0, 'y': 0 }, _r31 = { 'x': 0, 'y': 0 }, _r32 = { 'x': 0, 'y': 0 }, _r33 = { 'x': 0, 'y': 0 };
	switch (i) {
		case 0: // line-1-2-3*fixed
			_p1 = { 'x': 0, 'y': 0 }; _p2 = { 'x': 0, 'y': -1 }; _p3 = { 'x': 0, 'y': -2 }; _p4 = { 'x': 0, 'y': -3 };
			col = 'yellow';
			_r10 = { 'x': 0, 'y': 0 }; _r11 = { 'x': -2, 'y': 0 }; _r12 = { 'x': -1, 'y': 0 }; _r13 = { 'x': 1, 'y': 0 };
			_r20 = { 'x': 0, 'y': 0 }; _r21 = { 'x': 0, 'y': -1 }; _r22 = { 'x': 0, 'y': -2 }; _r23 = { 'x': 0, 'y': -3 };
			_r30 = { 'x': 0, 'y': 0 }; _r31 = { 'x': -2, 'y': 0 }; _r32 = { 'x': -1, 'y': 0 }; _r33 = { 'x': 1, 'y': 0 };
			break;
		case 1: // square-1-2-3
			_p1 = { 'x': 0, 'y': 0 }; _p2 = { 'x': 1, 'y': 0 }; _p3 = { 'x': 0, 'y': -1 }; _p4 = { 'x': 1, 'y': -1 };
			col = 'red';
			_r10 = { 'x': 0, 'y': 0 }; _r11 = { 'x': 1, 'y': 0 }; _r12 = { 'x': 0, 'y': -1 }; _r13 = { 'x': 1, 'y': -1 };
			_r20 = { 'x': 0, 'y': 0 }; _r21 = { 'x': 1, 'y': 0 }; _r22 = { 'x': 0, 'y': -1 }; _r23 = { 'x': 1, 'y': -1 };
			_r30 = { 'x': 0, 'y': 0 }; _r31 = { 'x': 1, 'y': 0 }; _r32 = { 'x': 0, 'y': -1 }; _r33 = { 'x': 1, 'y': -1 };
			break;
		case 2: // arrow-1-2-3
			_p1 = { 'x': 0, 'y': 0 }; _p2 = { 'x': -1, 'y': -1 }; _p3 = { 'x': 0, 'y': -1 }; _p4 = { 'x': 1, 'y': -1 };
			col = 'white';
			_r10 = { 'x': 0, 'y': 0 }; _r11 = { 'x': 0, 'y': -1 }; _r12 = { 'x': 0, 'y': -2 }; _r13 = { 'x': -1, 'y': -1 };
			_r20 = { 'x': 0, 'y': 0 }; _r21 = { 'x': -1, 'y': 0 }; _r22 = { 'x': 1, 'y': 0 }; _r23 = { 'x': 0, 'y': -1 };
			_r30 = { 'x': 0, 'y': 0 }; _r31 = { 'x': 0, 'y': -1 }; _r32 = { 'x': 0, 'y': -2 }; _r33 = { 'x': 1, 'y': -1 };
			break;
		case 3: // rightHook-pink*fixed
			_p1 = { 'x': 0, 'y': 0 }; _p2 = { 'x': 0, 'y': -1 }; _p3 = { 'x': 0, 'y': -2 }; _p4 = { 'x': -1, 'y': -2 };
			col = '#FF00FF';
			_r10 = { 'x': 0, 'y': 0 }; _r11 = { 'x': -1, 'y': 0 }; _r12 = { 'x': 1, 'y': 0 }; _r13 = { 'x': 1, 'y': -1 };
			_r20 = { 'x': 0, 'y': 0 }; _r21 = { 'x': 1, 'y': 0 }; _r22 = { 'x': 0, 'y': -1 }; _r23 = { 'x': 0, 'y': -2 };
			_r30 = { 'x': 0, 'y': 0 }; _r31 = { 'x': 0, 'y': -1 }; _r32 = { 'x': 1, 'y': -1 }; _r33 = { 'x': 2, 'y': -1 };
			break;
		case 4: // leftHook-1-2-3*fixed
			_p1 = { 'x': 0, 'y': 0 }; _p2 = { 'x': 0, 'y': -1 }; _p3 = { 'x': 0, 'y': -2 }; _p4 = { 'x': 1, 'y': -2 };
			col = 'blue';
			_r10 = { 'x': 0, 'y': 0 }; _r11 = { 'x': 0, 'y': -1 }; _r12 = { 'x': -1, 'y': -1 }; _r13 = { 'x': -2, 'y': -1 };
			_r20 = { 'x': 0, 'y': 0 }; _r21 = { 'x': -1, 'y': 0 }; _r22 = { 'x': 0, 'y': -1 }; _r23 = { 'x': 0, 'y': -2 };
			_r30 = { 'x': 0, 'y': 0 }; _r31 = { 'x': 0, 'y': -1 }; _r32 = { 'x': 1, 'y': 0 }; _r33 = { 'x': 2, 'y': 0 };
			break;
		case 5: // leftZag-green
			_p1 = { 'x': 0, 'y': 0 }; _p2 = { 'x': 1, 'y': 0 }; _p3 = { 'x': 0, 'y': -1 }; _p4 = { 'x': -1, 'y': -1 };
			col = '#00FF00';
			_r10 = { 'x': 0, 'y': 0 }; _r11 = { 'x': 0, 'y': -1 }; _r12 = { 'x': 1, 'y': -1 }; _r13 = { 'x': 1, 'y': -2 };
			_r20 = { 'x': 0, 'y': 0 }; _r21 = { 'x': 1, 'y': 0 }; _r22 = { 'x': 0, 'y': -1 }; _r23 = { 'x': -1, 'y': -1 };
			_r30 = { 'x': 0, 'y': 0 }; _r31 = { 'x': 0, 'y': -1 }; _r32 = { 'x': 1, 'y': -1 }; _r33 = { 'x': 1, 'y': -2 };
			break;
		case 6: // rightZag-aqua
			_p1 = { 'x': 0, 'y': 0 }; _p2 = { 'x': -1, 'y': 0 }; _p3 = { 'x': 0, 'y': -1 }; _p4 = { 'x': 1, 'y': -1 };
			col = '#00FFFF';
			_r10 = { 'x': 0, 'y': 0 }; _r11 = { 'x': 0, 'y': -1 }; _r12 = { 'x': -1, 'y': -1 }; _r13 = { 'x': -1, 'y': -2 };
			_r20 = { 'x': 0, 'y': 0 }; _r21 = { 'x': -1, 'y': 0 }; _r22 = { 'x': 0, 'y': -1 }; _r23 = { 'x': 1, 'y': -1 };
			_r30 = { 'x': 0, 'y': 0 }; _r31 = { 'x': 0, 'y': -1 }; _r32 = { 'x': -1, 'y': -1 }; _r33 = { 'x': -1, 'y': -2 };
			break;
	}
	var x1 = _p1, x2 = _p2, x3 = _p3, x4 = _p4;
	shapes[i] = new Shape(_p1, _p2, _p3, _p4, col);
	shapes[i].setRotation(0, x1, x2, x3, x4);
	shapes[i].setRotation(1, _r10, _r11, _r12, _r13);
	shapes[i].setRotation(2, _r20, _r21, _r22, _r23);
	shapes[i].setRotation(3, _r30, _r31, _r32, _r33);
}
function line(n) {
	var i;
	for(i = 0; i < width; i++)
		if(points[n][i] == screenColor)
			return false;
	return true;
}
function removeLine(n) {
	removing = true;
	var i, j;
	for(i = n; i > 0; i--)
		for(j = 0; j < width; j++)
		points[i][j] = points[i - 1][j];
	redrawTetris();
	removing = false;
}
function redrawTetris() {
	var i, j;
	for(i = 0; i < height; i++)
			for(j = 0; j < width; j++) {
				ctxtScreen.fillStyle = points[i][j];
				ctxtScreen.fillRect(squareSize * j + 1, i * squareSize + 1, squareSize - 2, squareSize - 2);
			}
}
function checkLine() {
	var i;
	var additionalScore = 0;
	for(i = 0; i < height; i++) {
		if(line(i) == true) {
			removeLine(i);
			additionalScore = additionalScore * 2 + 90;
		}
	}
	score += additionalScore;
	$("#score").empty().append("Score: " + score);
}
$().ready(function() {
	canvasScreen = document.getElementById("screen");
	ctxtScreen = canvasScreen.getContext("2d");
	
	// initializing screen
	ctxtScreen.canvas.width  = 400;
	ctxtScreen.canvas.height = 600;
	var canvasPosition = $("#screen").position();
	$("#score").css("margin-left", canvasPosition.left + ctxtScreen.canvas.width - 168);
	$("#score").css("margin-top", canvasPosition.top - 8);
	$(".buttons").css("margin-left", canvasPosition.left + (ctxtScreen.canvas.width - $(".buttons").width() - 10 ) / 2);
	$(".buttons").css("margin-top", canvasPosition.top + (ctxtScreen.canvas.height / 2) + 25);
	$(".buttons").bind('click', playAgain);
	$(".paused").css("height", ctxtScreen.canvas.height);
	$(".paused").css("width", ctxtScreen.canvas.width);
	$(".paused").css("margin-left", canvasPosition.left - 8);
	$(".paused").css("margin-top", canvasPosition.top - 8);
	$("#pausedText").css("padding-top", (ctxtScreen.canvas.height - 130) / 2);
	squareSize = ctxtScreen.canvas.width / width;
	ctxtScreen.fillStyle = screenColor;
	var i, j;
	height = 0;
	for(i = 0; i < width; i++)
		for(j = 0; j < (ctxtScreen.canvas.height / squareSize); j++) {
			ctxtScreen.fillRect(squareSize * i + 1, j * squareSize + 1, squareSize - 2, squareSize - 2);
			height++;
		}
	height = height / width;
	// initializing points
	points = new Array(height);
	for(i = 0; i < height; i++)
		points[i] = new Array(width);
	for(i = 0; i < height; i++)
		for(j = 0; j < width; j++)
			points[i][j] = screenColor;
	// initializing standard shapes
	shapes = new Array(7);
	for(i=0; i < 7; i++) {
		stdShape(i);
	}
	currentShape = Math.floor((Math.random()*10)) % 7; 
	shapes[currentShape].initialize();
	$("#screen").click(pause);
	$(".paused").click(pause);
	refreshInterval = setInterval(refreshPosition, 500);
});
function pause() {
	if(gameOver == false) {
		paused = paused == false ? true : false;
		paused == false ? $(".paused").addClass("inline") : $(".paused").removeClass("inline");
	}
}
function playAgain() {
	$(".buttons").addClass("inline");
	ctxtScreen.clearRect(0, 0, 400, 600);
	ctxtScreen.fillStyle = screenColor;
	var i, j;
	for(i = 0; i < width; i++)
		for(j = 0; j < (ctxtScreen.canvas.height / squareSize); j++)
			ctxtScreen.fillRect(squareSize * i + 1, j * squareSize + 1, squareSize - 2, squareSize - 2);
	points = new Array(height);
	for(i = 0; i < height; i++)
		points[i] = new Array(width);
	for(i = 0; i < height; i++)
		for(j = 0; j < width; j++)
			points[i][j] = screenColor;
	// initializing standard shapes
	shapes = new Array(7);
	for(i=0; i < 7; i++) {
		stdShape(i);
	}
	currentShape = Math.floor((Math.random()*10)) % 7; 
	shapes[currentShape].initialize();
	gameOver = false;
	removing = false;
	score = 0;
	paused = false;
	$("#score").empty().append("Score: 0");
	refreshInterval = setInterval(refreshPosition, 500);
}
function refreshPosition() {
	if(paused == false)
		if(removing == false)
			if(shapes[currentShape].moveDown() == true)
				checkLine();
}
$(window).resize(function() {
	var canvasPosition = $("#screen").position();
	$("#score").css("margin-left", canvasPosition.left + ctxtScreen.canvas.width - 168);
	$("#score").css("margin-top", canvasPosition.top - 8);
	$(".buttons").css("margin-left", canvasPosition.left + (ctxtScreen.canvas.width - $(".buttons").width() - 10 ) / 2);
	$(".buttons").css("margin-top", canvasPosition.top + (ctxtScreen.canvas.height / 2) + 25);
	$(".paused").css("margin-left", canvasPosition.left - 8);
	$(".paused").css("margin-top", canvasPosition.top - 8);
});
$(window).keydown(function(e){
	if((gameOver == false) && (removing == false) && (paused == false))
		switch (e.keyCode) {
			case 38: // up arrow
				shapes[currentShape].rotate(-1);
				break;
			case 37: // left arrow
				shapes[currentShape].moveLeft();
				break;
			case 39: // right arrow
				shapes[currentShape].moveRight();
				break;
			case 40: // down arrow
				if(shapes[currentShape].moveDown() == true)
					checkLine();
				break;
		}
});
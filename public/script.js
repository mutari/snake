var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var width = 600, height = 600, x = 0, y = 0;
var xOffset = 20; yOffset = 0, pX = 80, pY = 0;
var appleX = 80, appleY = 80;

var pSize = 20;

var body = [];

var score = 0;

function cub(x, y, width, height) {
	ctx.fillStyle = "#cccccc";
	ctx.fillRect(x, y, width, height);
}

function cubApple(x, y, width, height) {
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(x, y, width, height);
}

function plane() {
	for(var i = 0; i < width/pSize; i++) {
		ctx.moveTo(x, pSize*i);
		ctx.lineTo(x+width, pSize*i);
	}
	for(var i = 0; i < height/pSize; i++) {
		ctx.moveTo(i*pSize, y);
		ctx.lineTo(pSize*i, y+height);
	}
}

document.addEventListener('keydown', function(event) {
	 	//upp
    if(event.keyCode == 87 || event.keyCode == 38) {
			yOffset = -pSize;
			xOffset = 0;
    }
		//ner
    else if(event.keyCode == 83 || event.keyCode == 40) {
			yOffset = +pSize;
			xOffset = 0;
    }
		//vänster
		else if(event.keyCode == 65 || event.keyCode == 37) {
			yOffset = 0;
			xOffset = -pSize;
    }
		//höger
    else if(event.keyCode == 68 || event.keyCode == 39) {
			yOffset = 0;
			xOffset = +pSize;
    }
		else if(event.keyCode == 69) {
			yOffset = 0;
			xOffset = 0;
		}
});

function apple() {
	appleX = Math.floor(Math.random()*width/pSize)*pSize;
	appleY = Math.floor(Math.random()*height/pSize)*pSize;

	for(var i = 0; i < body.length; i++) {
		var obj = getDefaultObjectAt(body, i);
		if(pX == appleX && pY == appleY) {
			apple();
		}
	}

	cubApple(appleX, appleY, pSize, pSize);
}

function addBody(nX, nY) {
	body.push({x	:nX,
						 y	:nY});
}

function colide() {
	for(var i = 0; i < body.length; i++) {
		var obj = getDefaultObjectAt(body, i);
		if(pX == obj.x && pY == obj.y) {
			return true;
		}
	}
	if(pX/pSize > width/pSize) {
		return true;
	} else if(pY/pSize > height/pSize) {
		return true;
	} else if(pX < x) {
		return true;
	} else if(pY < y) {
		return true;
	}
}

function draw() {
	plane();
	cubApple(appleX, appleY, pSize, pSize);

	cub(pX, pY, pSize, pSize);

	for(var i = 0; i < body.length; i++) {
		var obj = getDefaultObjectAt(body, i);
		cub(obj.x, obj.y, pSize, pSize);
	}
}

addBody(60, 0);
addBody(40, 0);
addBody(20, 0);
addBody(0, 0);

function getDefaultObjectAt(array, index)
{
    return array[index] = array[index] || {};
}

function restart() {
	width = 600; height = 600; x = 0; y = 0;
	xOffset = 20; yOffset = 0; pX = 80; pY = 0;
	appleX = 80;
	appleY = 80;

	pSize = 20;

	body = [];

	score = 0;

	addBody(60, 0);
	addBody(40, 0);
	addBody(20, 0);
	addBody(0, 0);
}

draw();

setInterval(
  function() {

		//testar om du hittat äplet
		if(pX == appleX && pY == appleY) {
			var obj = getDefaultObjectAt(body, body.length-1);
			addBody(obj.x-xOffset, obj.y-yOffset);
			apple();
			score++;
		}

		//flyttare kropen alla andra delar
		for(var i = body.length-1; i >= 1; i--) {
			var obj1 = getDefaultObjectAt(body, i);
			var obj2 = getDefaultObjectAt(body, i-1);
			obj1.x = obj2.x;
			obj1.y = obj2.y;
		}

		//flyttare halsen del 2
		var obj = getDefaultObjectAt(body, 0);
		obj.x = pX;
		obj.y = pY;

		//flyttare huvudet del 1
		pX += xOffset;
		pY += yOffset;

		document.getElementById("score").innerHTML = "Score:" + score;

		if(colide()) {
			fetch(`/dead/${score}`);
			alert("du dod du fick " + score + " poäng");
			restart();
		}

		ctx.clearRect(x, y, width, height);
		draw();
  }
, 100);

ctx.stroke();


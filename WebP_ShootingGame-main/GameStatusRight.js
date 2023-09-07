var canvasR = document.getElementById("gameStatusRight"); // gameStatusRight아이디를가진 캔버스를 가져온다.
var ctxR = canvasR.getContext('2d'); // canvasR의 2d컨텍스트를 가져와서 ctxR변수에 저장.

var score = 0; // 점수를 기록할 변수이다. 초기값은 0
function drawScore() { // 현재 점수를 그려줄 함수이다.
	ctxR.fillText("score: "+score, 10, 50); // canvasR의 해당위치에 점수를 출력.
	ctxR.fillStyle = "pink";
}

var lifeSize = 20; // life이미지의 크기이다.
var lifeImg = new Image(); // life이미지 객체를 생성해준다.
lifeImg.src = "./Image/life.png"; // life이미지를 불러와주었다.
var maxlifeCount = 10; // life최대 개수
var lifeCount = 3; // life 초기 개수
var lifeStatus = []; // life를 저장할 배열을 만들어놓았다.

for (var i = 0 ; i < maxlifeCount; i++) { // life를 배열안에다가 위치를 지정해두었다.
	lifeStatus[i] = { // 이미지의 가로 세로가 20이기에 해당하는 만큼 x,y거리를 띄워 겹치지않게 해주었다.
		x : 10+((i%5)*20) ,
		y : 0+(parseInt(i/5)*20), 
		w : lifeSize,
		h : lifeSize, 
		img : lifeImg, 
		status : 1,  
	};
}

function drawAllLife() { // 현재 lifeCount의 수만큼 화면에 보이게 해주었다.
	for(var i = 0; i < lifeCount; i++) { 
		var life = lifeStatus[i]; 

		if(life.status == 0) { 
			continue;
		}

		ctxR.drawImage(life.img, life.x, life.y, life.w, life.h) // 캔버스에 life이미지를 그려준다.
	}
}

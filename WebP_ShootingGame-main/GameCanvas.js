var canvas = document.getElementById('gameCanvas'); //gameCanvas에 대한 요소를 다루고자 canvas라는 변수에 저장 추후에 canvas를 변경하거나 수정할때 canvas를 호출하면됨
var ctx = canvas.getContext('2d'); //2d 컨텍스트를 들고와서 ctx 변수에 저장
var GameStatus = 'A'; // 게임 초기상태 (실행중)

var rightPressed = false; // 우방향키 초기 디폴트값으로 눌러지지않은 상태 false를 설정
var leftPressed = false; // 좌방향키 초기 디폴트값으로 눌러지지않은 상태 false를 설정
var upPressed = false; // 위방향키 초기 디폴트값으로 눌러지지않은 상태 false를 설정
var downPressed = false; // 아래방향키 초기 디폴트값으로 눌러지지않은 상태 false를 설정
var zPressed = false; // z키 초기 디폴트값으로 눌러지지않은 상태 false를 설정

//사운드
var BoomAudio = new Audio('Audio/Boom.wav'); // 라이프가 다 깎였을 때 내는 효과음
BoomAudio.volume = 0.2; // 소리가 너무커서 줄엿다...
var hitAudio = new Audio('Audio/hit.wav'); // 충돌시 효과음.
var InGameBackGround = new Audio('Audio/InGameBackGround.mp3'); // 인게임 배경음악
var BossBackGround = false; // 보스 배경음악 조건문

function startBG() {
	InGameBackGround.volume = 0.2; // 소리가 너무 커서 줄였다..
	InGameBackGround.autoplay = true; // 배경음악 시작!
	InGameBackGround.loop = true; // 배경음악 무한반복.
}
startBG();

var bulletDelay = 0; // 총알이 연속적으로 발사되지않도록 총알 간 간격을 설정해주기 위한 변수.
var pause = false; // 일시정지
var dmg = 25; // 초기 배의 공격데미지
var hp = 50; // 적유닛의 체력(일반몹)

var shipSize = 40; // 비행기 크기를 40으로 설정 (가로, 세로 40)
var shipImg = new Image(); // Image 오브젝트(객체)를 만들어서 shipImg 라는 변수에 저장
shipImg.src = "Image/ship.png"; // ./는 현재 폴더안에 ship.png 이미지를 불러와서 shipImg 변수에 저장한다.

var ship = { //ship이라는 변수를 만들어서 배의 x,y 좌표 위치와 너비 높이를 설정한다.
	x : (canvas.width - shipSize) / 2, // ship의 x좌표 설정. width로 그냥 설정하게되면 canvas의 width값부터 만들어지기때문에 캔버스 밖에서 만들어진다. 그렇기에 width값에 배크기를 빼줌으로써 캔버스안으로 넣는다. /2를 해줌으로써 중간에 배를 위치
	y : canvas.height - shipSize, // ship의 y좌표 설정. height로 설정하게되면 canvas의 height값부터 만들어지기 때문에 캔버스 밖에서 만들어지게됨. 그렇기에 height값에 배크기를 빼줌으로써 캔버스 안에 배를 넣는다.
	w : shipSize, // 배의 너비를 shipSize로 설정 x ~ w
	h : shipSize // 배의 높이를 shipSize로 설정 y ~ h
};

var enemySize = 40; // 적기의 크기를 40으로 설정 (가로, 세로 40)
var enemyImg1 = new Image(); // Image 객체를 만들어서 
var enemyImg2 = new Image(); // Image 객체 생성
enemyImg1.src = "./Image/enemy1.png"; // enemy 이미지를 설정.
enemyImg2.src = "./Image/enemy2.jpg"; // 두번째 enemy 이미지를 설정

var enemyspeed = 2; // 일반몹 스피드 초기값
var enemyCount = 10; // 적기의 수
var enemyMaxCount = 100; // 최대 몹 수
var enemyStatus = []; // 화면에 보이나 안보이나를 enemyStatus로 결정할 것임.

// 적기수(enemyCount) 만큼 적기 Status를 설정한다.
for (var i = 0; i < enemyMaxCount; i++) { 
	enemyStatus[i] = {
		x : 0, // x 초기값
		y : 0, // y 초기값
		w : enemySize, // 너비 40
		h : enemySize, // 높이 40
		img1 : enemyImg1, // enemy.png 설정
		img2 : enemyImg2,
		status : 0, // 초기 상태를 0으로 설정함으로써 아직 화면에 안보임.
		hp : hp // 적기 체력
	};
}

var BossSize = 200; // 보스 크기
var BossImg = new Image(); // 보스 이미지 객체
var BossStage = false; // 보스 스테이지 입장 조건문
BossImg.src = "Image/Boss.png" // 보스 이미지 할당

var BossStatus = []; // 보스 상태창
BossStatus[0] = {
	x : (canvas.width - BossSize) / 2, // 보스를 중간에 위치
	y : 0 - (BossSize + 10), // 보스를 서서히 등장하기위해서 캔버스 밖에서 준비
	w : BossSize, //보스의 너비
	h : BossSize, // 보스의 높이
	img : BossImg, // 보스 이미지
	status : 0, // 초기 상태( 등장 X )
	hp : 100000 // 보스 체력
};
var Boss = BossStatus[0]; // Boss 변수에 보스 객체 할당

var bulletSize = 5;	// 총알 사이즈
var bulletImg = new Image(); // 총알 이미지 객체 만들기
bulletImg.src = "./Image/bullet.png"; // 총알 이미지 설정.

var bulletCount = 100; // 최대 발사가능한 총알수
var bulletStatus = []; // 총알이 화면에 보이나 안보이나를 status로 설정.
var msC = 1; // 초기 미사일 발사 개수는 1개이다.

// 총알수(bulletCount) 만큼 총알 status를 설정한다.

for (var i = 0 ; i < bulletCount; i++) {
	bulletStatus[i] = {
		x : ship.x + (shipSize/2) , // 총알은 ship객체에서 중간에서 발사 될것임.
		y : ship.y, // 총알은 ship의 앞부분에서 나와야함.
		w : bulletSize, // 너비 5
		h : bulletSize, // 높이 5
		img1 : bulletImg, // bullet.png 이미지 설정.
		status : 0, // 초기 상태를 0으로 설정함으로써 화면에 출력x
		dmg : dmg // 총알 한발당 데미지 설정.
	};
}
				
var e_bulletImg = new Image(); // 적 총알 이미지 객체 생성
e_bulletImg.src = "./Image/enemy_bullet.png"; // 이미지 불러오기(할당)
				
var e_bulletStatus = []; // 적 총알 상태 배열 
// 적 최대 수만큼 총알을 설정해준다.
for (var i = 0 ; i < enemyMaxCount ; i++) {
	e_bulletStatus[i] = {
		x : 0,
		y : 0,
		w : bulletSize,
		h : bulletSize,
		img1 : e_bulletImg,
		status : 0
	}
}

document.addEventListener('keydown', keyDownHandler, false); //document 에 addEventListener 함수를 통해 키를 눌렀을때 keyDownHandler함수를 실행.
document.addEventListener('keyup', keyUpHandler, false); //document 의 addEventListener 함수를 통해 키를 눌렀다가 뗐을때 keyUpHandler함수를 실행.
var atkUP = document.getElementById("atkUP"); // document에서 atkUP을 불러와서 atkUP에 저장
var atkCUP = document.getElementById("atkCUP"); // document에서 atkCUP을 불러와서 atkUP에 저장
var atkHP = document.getElementById("atkHP"); // document에서 atkHP을 불러와서 atkUP에 저장
var mainMenu = document.getElementById("mainMenu"); // document에서 mainMenu을 불러와서 atkUP에 저장
atkUP.addEventListener('click', SelectA); // 해당 atkUP 버튼을 클릭시 SelectA함수를 실행시킨다.
atkCUP.addEventListener('click', SelectAC); // 해당 atkCUP 버튼을 클릭시 SelectAC함수를 실행시킨다.
atkHP.addEventListener('click', SelectHP); // 해당 atkHP 버튼을 클릭시 SelectHP함수를 실행시킨다.

// 키를 눌렀을때 함수.
function keyDownHandler(e) {
	if(e.code == 'ArrowRight') { // 오른쪽 방향키를 눌렀을때 rightPressed를 true로 설정
		rightPressed = true;
	}
	else if(e.code == 'ArrowLeft') { // 왼쪽 방향키를 눌렀을때 leftPressed를 true로 설정
		leftPressed = true;
	}
	else if(e.code == 'ArrowUp') { // 위쪽 방향키를 눌렀을때 upPressed를 true로 설정
		upPressed = true;
	}
	else if(e.code == 'ArrowDown') { // 아래쪽 방향키를 눌렀을때 downPressed를 true로 설정
		downPressed = true;
	}

	if(e.code == 'KeyZ') { // z를 눌렀을때 zPressed 를 true로 설정.
		zPressed = true;
	}
	if(e.keyCode == 27) { // ESC키를 눌렀을때 게임이 실행중이면 일시정지로 일시정지상태라면 게임을 실행하는 상태로 설정
		if(GameStatus == "A") {
			GameStatus = 'P';
			pause = true;
		}
		else if(GameStatus == "P") {
			GameStatus = 'A';
			pause = false;
		}
	}
	if(e.code == 'KeyH') { // H키는 치트키다! 바로 보스 스테이지로 넘어가며 보스의 체력이 100이된다.
		BossStage = true;
		Boss.hp = 100;
	}

}

// 키를 눌렀다 뗐을때 함수
function keyUpHandler(e) { // 오른쪽 방향키를 눌렀다가 뗐을때 rightPressed를 false로 설정
	if(e.code == 'ArrowRight') {
		rightPressed = false;
	}
	else if(e.code == 'ArrowLeft') { // 왼쪽 방향키를 눌렀다가 뗐을때 leftPressed를 false로 설정
		leftPressed = false;
	}
	else if(e.code == 'ArrowUp') { // 위쪽 방향키를 눌렀다가 뗐을때 upPressed를 false로 설정
		upPressed = false;
	}
	else if(e.code == 'ArrowDown') { // 아래쪽 방향키를 눌렀다가 뗐을때 downPressed를 false로 설정
		downPressed = false;
	}

	if(e.code == 'KeyZ') { // z를 눌렀다가 뗐을때 zPressed를 false로 설정
		zPressed = false;
		bulletDelay = 0; // 총알을 쏘다가 z를 뗏을때 딜레이 값을 0으로 초기화 해줌으로써 다음에 다시 z를 눌렀을때 딜레이 없이 바로 총알 발사.
	}

}
// 무적시간 조건.
var godTime = false;

function bulletCrash() { // 총알이 enemy와 부딫혔을때 맞았는지 안맞았는지 비교할거임.
	if(BossStage == false) {
		for(var i = 0; i < bulletCount; i++) { // 총 bulletCount수만큼 비교할 거임.
			var bullet = bulletStatus[i]; // i번째 해당하는 총알을 bullet이라는 변수를 만들어서 저장.

			if(bullet.status == 0) { // i번째 총알의 status가 0이면 화면에 없기에 충돌여부를 확인할 필요가없으므로 continue로 다음 총알을 비교해줄것.
				continue;
			}

			for(var j = 0; j < enemyCount; j++) { // 부딫히는 적기 객체를 다돌아볼거임.
				var enemy = enemyStatus[j]; // j번째 적기를 enemy에 저장.
				if(enemy.status == 0) { // 마찬가지로 적기의 status가 0일시 화면에 없기에 충돌여부 비교 x
					continue;
				}
				bullet.rx = bullet.x + bullet.w; // 총알의 사각형 가로부분.
				bullet.by = bullet.y + bullet.h; // 총알의 사각형 세로부분.
				enemy.rx = enemy.x + enemy.w; //enemy의 x ~ x+w 만큼의 사각형 가로
				enemy.by = enemy.y + enemy.h; //enemy의 y ~ y+h 만큼의 사각형 세로
				if((bullet.x >= enemy.x && bullet.x <= enemy.rx) || (bullet.rx >= enemy.x && bullet.rx <= enemy.rx)) { // 총알이 적의 면적에 닿거나 안으로 진입시 조건문 발동!
					if((bullet.y >= enemy.y && bullet.y <= enemy.by) || (bullet.by >= enemy.y && bullet.by <= enemy.by)) {
						enemy.hp -= bullet.dmg; // i번째 총알과 j번째 적기가 충돌했을시 j번째 적기의 hp를 감소시킬거임.
						bullet.status = 0; // 총알은 적기와 충돌했기때문에 화면에서 없어질거임. status를 0으로 설정.
						if(enemy.hp <= 0) { // j번째 적기의 체력이 충돌로인하여 hp가 감소되다가 0보다 같거나 작을시 적기도 사라지게 만들것. status를 0으로 설정.
							score += 10; // 점수는 계속 올라간다. GameStatusRight에서
							if(score >= 1000) { // 게임 점수가 1000점 stage 10일때 조건문 실행.
								setTimeout(function() { // 해당 함수를 지연시킨다. 3초후에 화면의 모든적들의 상태를 0으로 설정해서 없앤뒤 보스스테이지로 넘어간다.
									for(var k = 0; k < enemyMaxCount; k++) {
										var enemy = enemyStatus[k];
										enemy.status = 0;
									}
									BossStage = true; 
								}, 3000)
							}
							document.getElementById('scoreGauge').value = String(score%100); // document id가 scoreGauge인 기능을 들고와서 점수만큼 게이지가 차게만듬. 100점마다 레벨 업 하는식으로 보이게끔.
							if(score % 100 == 0) { // score가 100점씩 채워질때마다 실행. 
								GameStatus = 'U'; // GameStatus를 U로 바꿔서 업그레이드할 수 있는 상태창을 띄운다.
								if(enemyCount < enemyMaxCount) { // 레벨업을 할 수록 단계가 업그레이드( 적의 수 증가, 체력 증가, 이동속도 증가)
									enemyCount+=5;
									hp += 25;
									enemyspeed += 1;
								}
							}
							enemy.status = 0; // enemy는 죽었다. status를 0으로 초기화.
						}
						break; // 부딫히면 해당 i번째 bullet 검사를 더 돌릴필요가 없음. 그래서 for문 탈출하고 다음 bullet을 탐색.
					}
				}
			}
		}
	}
	else {
		for(var i = 0; i < bulletCount; i++) { // 총 bulletCount수만큼 비교할 거임.
			var bullet = bulletStatus[i]; // i번째 해당하는 총알을 bullet이라는 변수를 만들어서 저장.

			if(bullet.status == 0) { // i번째 총알의 status가 0이면 화면에 없기에 충돌여부를 확인할 필요가없으므로 continue로 다음 총알을 비교해줄것.
				continue;
			}
			
			bullet.rx = bullet.x + bullet.w; // 총알의 사각형 가로부분.
			bullet.by = bullet.y + bullet.h; // 총알의 사각형 세로부분.
			Boss.rx = Boss.x + Boss.w; // 보스의 가로 면적(너비)을 rx에다가 저장한다.
			Boss.by = Boss.y + Boss.h; // 보스의 세로 면적(높이)을 by에다가 저장한다.
			if((bullet.x >= Boss.x && bullet.x <= Boss.rx) || (bullet.rx >= Boss.x && bullet.rx <= Boss.rx)) { // 총알이 보스의 면적에 닿거나 들어가면 해당 조건문내용들을 실행.
				if((bullet.y >= Boss.y && bullet.y <= Boss.by) || (bullet.by >= Boss.y && bullet.by <= Boss.by)) {
					Boss.hp -= bullet.dmg; // bullet이 가지는 데미지만큼 보스 체력을 깐다. 
					bullet.status = 0; // 총알은 부딫혔으니 0으로 화면에서 없애줌.
					if(Boss.hp <= 0) { // 보스의 체력이 0이거나 0보다 작으면 잡았다는 것이다! 게임상태를 클리어로 바꾸어준다.
						alert("클리어!!!!");
						Boss.status = 0;
						GameStatus = 'C';
					}
				}
			}
		}
	}
					
	for(var i = 0; i < enemyCount; i++) { // 총 bulletCount수만큼 비교할 거임.
		var Enemybullet = e_bulletStatus[i]; // i번째 해당하는 총알을 bullet이라는 변수를 만들어서 저장.

		if(Enemybullet.status == 0) { // i번째 총알의 status가 0이면 화면에 없기에 충돌여부를 확인할 필요가없으므로 continue로 다음 총알을 비교해줄것.
			continue;
		}

		Enemybullet.rx = Enemybullet.x + Enemybullet.w; // 총알의 사각형 가로부분.
		Enemybullet.by = Enemybullet.y + Enemybullet.h; // 총알의 사각형 세로부분.
		ship.rx = ship.x + ship.w; //enemy의 x ~ x+w 만큼의 사각형 가로
		ship.by = ship.y + ship.h; //enemy의 y ~ y+h 만큼의 사각형 세로
		if((Enemybullet.x >= ship.x && Enemybullet.x <= ship.rx) || (Enemybullet.rx >= ship.x && Enemybullet.rx <= ship.rx)) { // 적의 총알이 내 배와 닿거나 내배 면적 안에 들어가면 실행.
			if((Enemybullet.y >= ship.y && Enemybullet.y <= ship.by) || (Enemybullet.by >= ship.y && Enemybullet.by <= ship.by)) {
				if(enemyStatus[i].status == 2) { // 적의 총알을 쏘는 것은 보스와 두번째 일반몹인데. 두번째 일반몹이 쏜 총알이고 일반몹이 살아있다면 해당 총알을 다시 일반몹에서 발사하도록 위치를 조정한다.
					Enemybullet.y = enemyStatus[i].y; 
				}
				else { // 일반몹이 죽어있다면 총알을 0으로 만들어서 다시 일반몹이 생성될때까지 기다린다.
					Enemybullet.status = 0;
				}
				if(godTime == false) { // 플레이어가 무적시간이 아니라면 라이프 하나를 깎고 무적시간을 활성화시킨다. 3초뒤에 무적시간이 꺼지도록 지연함수를 설정.
					hitAudio.play(); // 충돌 소리
					lifeCount -= 1;
					godTime = true;
					setTimeout(function() { godTime=false; }, 3000)
				}
				break; // 부딫히면 해당 i번째 bullet 검사를 더 돌릴필요가 없음. 그래서 for문 탈출하고 다음 bullet을 탐색.
			}
		}
	}
	return 0;
}

function checkCrash() { // 내 ship과 적기가 부딫혔는지 확인하는 함수. 현재 사각형 모양으로 표현했기에 빈공간임에도 오브젝트끼리 충돌했다는 판정이뜸 수정필요.
	if(BossStage == false) {
	// 적기의 수만큼 충돌을 확인한다.
		for(var i = 0; i< enemyCount; i++) {
			var enemy = enemyStatus[i]; // enemy 객체 하나하나를 enemy 변수에다가 넣는다.
			// status == 0 적기가 없을시 충돌과정을 확인할 필요가없기에 continue로 아래 코드를 패스한다.
			if(enemy.status == 0) {
				continue;
			}
			// 사각형 ship, enemy 객체의 둘레사각형들을 뽑아내는 과정.
			ship.rx = ship.x + ship.w; //ship의 x ~ x+w 만큼의 사각형 가로 
			ship.by = ship.y + ship.h; //ship의 y ~ y+h 만큼의 사각형 세로
			enemy.rx = enemy.x + enemy.w; //enemy의 x ~ x+w 만큼의 사각형 가로
			enemy.by = enemy.y + enemy.h; //enemy의 y ~ y+h 만큼의 사각형 세로
			// ship의 x와 rx가 enemy의 x와 rx의 사이에 있거나 ship의 y와 by가 enemy의 y와 by사이에 있을때 부딫혔다고 가정한다.
			if((ship.x >= enemy.x && ship.x <= enemy.rx) || (ship.rx >= enemy.x && ship.rx <= enemy.rx)) { // 내배와 적이 부딫혔을때 실행.
				if((ship.y >= enemy.y && ship.y <= enemy.by) || (ship.by >= enemy.y && ship.by <= enemy.by)) {
					enemy.status = 0; // 부딫힌 적은 사라진다.
					if(godTime == false) { // 무적시간이 아닐시 생명력을 깎고 무적시간을 다시 활성화 시켜준다. 무적시간은 3초뒤에 지연함수로 꺼지게된다.
						hitAudio.play(); // 충돌소리.
						lifeCount -= 1;
						godTime = true;
						setTimeout(function() { godTime=false; }, 3000)
					}
					return 1; // 부딫혔을시 1값을 반환
				}
			}
		}
	}
	else { // 해당은 보스와의 충돌이고 보스와의 충돌과 일반몹의 충돌의 다른점은 보스는 충돌해도 안없어진다. 플레이어의 체력만 깎일 뿐. 무적시간도 똑같다.
		ship.rx = ship.x + ship.w; 
		ship.by = ship.y + ship.h;
		Boss.rx = Boss.x + Boss.w;
		Boss.by = Boss.y + Boss.h;
		if((ship.x >= Boss.x && ship.x <= Boss.rx) || (ship.rx >= Boss.x && ship.rx <= Boss.rx)) {
			if((ship.y >= Boss.y && ship.y <= Boss.by) || (ship.by >= Boss.y && ship.by <= Boss.by)) {
				if(godTime == false) {
					hitAudio.play();
					lifeCount -= 1;
					godTime = true;
					setTimeout(function() { godTime=false; }, 3000)
				}
				return 1; // 부딫혔을시 1값을 반환
			}
		}
	}
	return 0; // 아무것도 부딫히지 않았다 0값을 반환.
}

function createBullet() { // 총알을 만들어주는 함수.
	for(var j = 0; j < msC; j++) {
		for(var i = 0; i < bulletCount; i++) {
			var bullet = bulletStatus[i]; // i번째 총알을 bullet 변수에 저장.
			if(bullet.status == 0) { // i번째 총알의 status가 0이면 발사위치를 설정해줌.
				bullet.y = ship.y; // 발사될 배의 y값
				bullet.x = ship.x + (shipSize/(msC+1)*(j+1)); // x값은 총알의 개수(msC)에 따라 조절되는데. msC의 수만큼 내 배의 가로변을 나눠 동시에 여러발이 나가는 것처럼 보이게 설정하였다.

				bullet.status = 1;

				break;
			}
		}
	}
}

function drawAllBullets() { // 총알을 그려나가는 함수.
	for(var i = 0; i < bulletCount; i++) { // 총알의 개수(bulletCount)만큼 돌려본다.
		var bullet = bulletStatus[i]; // i번째 총알을 bullet변수에 저장.

		if(bullet.status == 0) { // i 번째 총알의 status가 0일시 생략.

			continue;
		}

		bullet.y -= 10; // 총알은 ship에서 날라가기에 y값을 감소시켜 아래에서 위로 올라감.
		if(bullet.y + bulletSize >= 0) { // 화면 밖에 나가지않는다면 그림.
			ctx.drawImage(bullet.img1, bullet.x, bullet.y, bullet.w, bullet.h)
		}
		else { // 그게아니라면 status를 0으로 설정.
			bullet.status = 0;
		}
	}
	if(BossStage == false) { // 보스 라운드가 아니고 일반 몹 스테이지일 떄 내용을 실행.
		for(var i = 0; i < enemyCount; i++) { // 총알의 개수(bulletCount)만큼 돌려본다.
			var Enemybullet = e_bulletStatus[i]; // i번째 총알을 bullet변수에 저장.
			var enemy = enemyStatus[i]; // i번째 에너미를 enemy 변수에 저장.

			if(Enemybullet.status == 0) { // i 번째 총알의 status가 0일시 생략.
				continue;
			}


			Enemybullet.y += 5; // 총알은 계속해서 내려온다.
			if(Enemybullet.y + bulletSize < canvas.height) { // 화면 밖에 나가지않는다면 그림.
				ctx.drawImage(Enemybullet.img1, Enemybullet.x, Enemybullet.y, Enemybullet.w, Enemybullet.h)
			}
			else { // 화면밖에 나갔거나 충돌했을때 총알의 status를 다시 재설정해준다. 
				if(enemy.status == 2) { // enemy.status 2인 두번째 일반몹이 계속해서 살아있다면 총알의 위치를 두번째 일반몹에서 다시 발사하게끔 y값을 초기화시켜줌.
					Enemybullet.y = enemy.y;
				}
				else { // 발사의 매개체 즉 두번째 일반몹이 죽었으면 발사할수가없다 그렇기에 총알의 상태를 0으로 설정.
					Enemybullet.status = 0;
				}
			}
		}
	}
	else { // 보스 스테이지 일때
		for(var i = 0; i < enemyMaxCount; i++) { // 총알의 개수(bulletCount)만큼 돌려본다.
			var Enemybullet = e_bulletStatus[i]; // i번째 총알을 Enemybullet변수에 저장.

			if(Enemybullet.status == 0) { // i 번째 총알의 status가 0일시 생략.
				continue;
			}


			Enemybullet.y += 10;
			if(Enemybullet.y + bulletSize < canvas.height) { // 화면 밖에 나가지않는다면 그림.
				ctx.drawImage(Enemybullet.img1, Enemybullet.x, Enemybullet.y, Enemybullet.w, Enemybullet.h)
			}
			else { // 그렇지 않다면 상태를 0으로 설정.
				Enemybullet.status = 0;
			}
		}
	}
}
				
function createEnemyBullet() { // 총알을 만드는 함수.
	for(var i = 0; i < enemyCount; i++) { // 적기를 가져와 상태가 0또는 2인 일반몹의 총알 발사위치를 설정해놓는다.
		var Enemybullet = e_bulletStatus[i]; 
		var enemy = enemyStatus[i];
		if (Enemybullet.status == 0 && enemy.status == 2) {
			Enemybullet.y = enemy.y;
			Enemybullet.x = enemy.x + (enemySize/2);

			Enemybullet.status = 1;
		}
	}
}

// 적기를 random하게 생성함.
function createNewEnemy(probWeight, gameLevel) {
	// Math.floor 함수는 주어진 숫자와 같거나 작은 정수 중에서 가장 큰수를 반환. Math.random() 함수는 1을 제외한 0~1 사이의 부동소수점 난수를 생성한다.
	if(Math.floor(Math.random() * probWeight) < gameLevel) { // floor(random()* probWeight(30)) < gameLevel(1) -> 0~29 < 1
		for(var i = 0; i < enemyCount; i++) {
			// enemyCount(10)수 만큼 for문을 돌려주면서 enemy 객체 하나하나를 확인할 것이다.
			var enemy = enemyStatus[i];
			// enemy의 status 가 0이다 -> 아래 실행.
			if(enemy.status == 0) {
				// enemy 객체는 맨위에서 부터 생성되고 x 값은 0 ~ canvas.width-1 범위를 가지며 정수부분만 가진다.
				enemy.y = 0;
				enemy.x = Math.floor(Math.random() * canvas.width); //
				enemy.hp = hp;

				// 적기가 canvas에서 벗어나지 않도록 조정.
				if(enemy.x + enemySize > canvas.width) {
					enemy.x = canvas.width - enemySize;
				}
				var randomEnemy = Math.floor(Math.random()*10);
				//var randomEnemy = 1;

				// enemy 설정이 완료되었기에 canvas에 표시해줄것이다. 그렇기에 status 값을 1로 설정.
				if(randomEnemy % 2 == 0){ 
					enemy.status = 1;
				}
				else if(randomEnemy % 2 == 1) { // randomEnemy를 2로 나누었을때 나머지가 1이면 해당 적기를 2의 상태로 바꾸고 2의 상태를 지닌 적기는 총알을 발사하도록 만든다.
					enemy.status = 2;
					createEnemyBullet();
				}
				break;
			}
		}
	}
}

				// enemy를 그려주는 함수.
function drawAllEnemies() {
	for(var i = 0; i < enemyCount; i++) {
		// enemyCount(10) 만큼 enemy 객체를 다 둘러볼것이다.
		var enemy = enemyStatus[i];
		// status 가 0이다 그럼 아래 코드를 실행할 필요가 없음.
		if(enemy.status == 0) {
			continue;
		}
		// 적기가 아래로 떨어지게되면 canvas에서 벗어나게되는데 그럴때 status = 0으로 바꿔서 없앤다.
		// 떨어질때마다 갱신시켜서 만들어준다.
		if(enemy.y + enemySize <= canvas.height && enemy.status == 1) {
			ctx.drawImage(enemy.img1, enemy.x, enemy.y, enemy.w, enemy.h)
			// 적기가 아래로 떨어지도록 설정
			enemy.y += enemyspeed;
		}
		else if(enemy.y + enemySize <= canvas.height && enemy.status == 2) {
			ctx.drawImage(enemy.img2, enemy.x, enemy.y, enemy.w, enemy.h)
		}
		else {
			enemy.status = 0;
		}
	}
	// 계속해서 enemy 객체를 만들어줄것이다.
	createNewEnemy(30,1);
}

var BossAtk = false; // 보스가 공격을 실행중인지 아닌지를 구별하기위한 불형변수.
var backTurn = false; // 보스가 뒤돌아와야될때 활성화시키는 불형변수.

function BossPattern1() { // 첫번째 보스 패턴 함수이다. 몸통박치기.
	if((Boss.y+Boss.h) < canvas.height && !backTurn) { // 보스의 면적이 캔버스 끝부분에 닿을때까지 20속도로 밑으로 떨어진다.
		Boss.y += 20;
		if((Boss.y+Boss.h) == canvas.height) { // 보스의 면적이 캔버스 끝부분과 같게되면 backTurn을 true로 변형시켜 다시 원위치로 돌아오게 후진시킨다.
			console.log(backTurn);
			backTurn = true;
			console.log(backTurn);
		}
	}
	else if(backTurn && (Boss.y > 0)) { // backTurn이 true이고 보스의 면적이 다시 캔버스의 맨 위에(원위치)로 돌아올때 까지 y값을 감소시켜 올려준다.
		Boss.y -= 5;
		if(Boss.y == 0) { // 보스가 원위치로 돌아왔을때 실행
			backTurn = false; // 원위치로 돌아왔으니 뒤로 더갈필요 없기에 false로 설정
			BossAtk =false; // 보스가 계속해서 다른 공격을 할 수 있게 BossAtk을 false로 설정
			RandomNumBool = false; // 다음 보스 공격 패턴을 할당해주기위해서 랜덤값을 다시 집어넣어 주기위해서 false로 바꿔준다.
		}
	}
}

var bodyC = 0; // 보스의 두번째 공격패턴에서 위치를 설정해줌.
var bodyCstart = false; // 보스의 공격 위치를 재설정해주기 위한 불형변수.

function BossPattern2() { // 보스의 두번째 공격패턴이다.
	if (bodyC == 0) { // 공격패턴 위치 0번째일때 보스는 직진한다.
		Boss.y += 10;
		if(Boss.y > canvas.height + 20) {
			bodyC = 1; // 보스가 화면 밖으로 나갔을때 다음 공격을 준비한다. bodyC == 1번째로 다음단계 진행.
		}
	}
	else if(bodyC == 1) { // 공격패턴 1번쨰
		if(!bodyCstart) { // 출발 위치값을 설정해줌.
			Boss.y = canvas.height/3*2;
			Boss.x = canvas.width+10;
			bodyCstart =true; // 출발 위치가 선정되면 공격 진행.
		}
		else{ // 출발 위치에서 공격 진행
			Boss.x -= 10; // 오른쪽에서 왼쪽으로 감.
			if(Boss.x < 0 - Boss.w - 20) { // 화면나갈시 다음 위치 초기화 설정 및 다음단계 진행
				bodyCstart = false;
				bodyC = 2; 
			}
		}
	}
	else if(bodyC == 2) { // 공격패턴 2번째
		if(!bodyCstart) { // 위치값 설정.
			Boss.y = canvas.height/3*1;
			Boss.x = -10-Boss.w;
			bodyCstart =true;
		}
		else{ // 공격 진행
			Boss.x += 10; // 이번엔 왼쪽에서 오른쪽으로 감
			if(Boss.x > canvas.width+10) {
				bodyCstart = false;
				bodyC = 3; // 다음 단계
			}
		}
	}
	else if(bodyC == 3) { // 3번쨰 진행단계
		if(!bodyCstart) { // 위치값 설정
			Boss.y = 0;
			Boss.x = canvas.width+10;
			bodyCstart =true;
		}
		else{ // 공격 진행
			Boss.x -= 10; // 오른쪽에서 왼쪽으로 진행
			if(Boss.x < 0 - Boss.w - 20) { // 3번째가 마지막 단계로 화면 밖으로 나가게되면 보스는 처음 등장했던 위치로 가고 모든 값들을 초기상태로 되돌려준다.
				Boss.x = (canvas.width - BossSize) / 2; // 등장위치
				Boss.y = 0 - (BossSize + 10); // 등장위치
				bodyC = 0; // 다음 공격이 또 이번 패턴이면 다시 0번째 부터 3번까지 실행되어야함.
				bodyCstart = false; // 마찬가지로 위치값 설정을 다시해주기위해서 false로 초기화.
				BossAtk=false; // 보스의 다음공격 차례를 위해 false로 설정.
				RandomNumBool = false; // 다음 패턴 랜덤값 설정해주기위해서 false로 설정.
			}
		}
	}
	
}

var bulletPattern = 0; // 총알 패턴수를 체크하기위해 선언.
function BossPattern3() { // 보스 공격패턴 세번째다.
	if(bulletPattern == 3) { // 총알 패턴이 3단계면은 다음 보스 공격을 위해서 BossAtk, RandomNumBool 을 false로 초기화시켜준다.
		BossAtk = false;
		RandomNumBool = false;
		bulletPattern = 0; // 다시 총알패턴도 0으로 초기화.
	}
	if((e_bulletStatus[enemyMaxCount-1].status == 0) && (bulletPattern % 2 == 0))  // 총알의 status가 0이고 짝수일경우 실행. 총알의 위치를 설정해준다.
	{
		bulletPattern += 1; // 총알패턴 +1
		for (var i = 0 ; i < enemyMaxCount ; i++) { // 100(enemyMaxCount)개의 총알을 아래 조건문에 맞게 총알의 위치를 배치시킨다.
			var BossBullet = e_bulletStatus[i];
			if(BossBullet.status == 0) {
				BossBullet.status = 1;
				if(parseInt(i/10)%2 == 1) {
					BossBullet.x = (i%5)*160;
				}
				else {
					BossBullet.x = 40+((i%5)*160)
				}
				BossBullet.y = parseInt(i/5)*(-30);
			}
		}
	}
	else if((e_bulletStatus[enemyMaxCount-1].status == 0) && (bulletPattern % 2 == 1)) // 홀수 일때
	{
		bulletPattern += 1; // 패턴 증가
		for (var i = 0 ; i < enemyMaxCount ; i++) { // 위와같이 100개의 총알을 아래 조건문에 맞게 총알의 위치를 배치시킨다.
			var BossBullet = e_bulletStatus[i];
			if(BossBullet.status == 0) {
				BossBullet.status = 1;
				if(parseInt(i/10)%2 == 1) {
					BossBullet.x = 80+(i%5)*160;
				}
				else {
					BossBullet.x = 120+((i%5)*160)
				}
				BossBullet.y = parseInt(i/5)*(-30);
			}
		}
	}
}
var RandomNumBool = false; // 다양한 공격패턴을 위해서 random값을 매번 설정해주기위한 불형변수.
var PatternNum = 0; // 랜덤값을 넣어줄 변수.

function drawBoss() { // 보스를 그리는 함수이다.
	if(BossBackGround == false) { // 보스등장과함께 배경음악을 바꿔준다.
		BossBackGround = true;
		InGameBackGround.pause();
		InGameBackGround.currentTime = 0;
		InGameBackGround.src ='Audio/BossBackGround.mp3';
		InGameBackGround.load();
		InGameBackGround.play();
	}
	if(Boss.y < 0 ) { // 보스의 처음등장할때 밖에서 서서히 등장시켜줌.
		Boss.y += 1;
		if(Boss.y == 0) { // 보스의 등장이 끝나면 이제 보스가 공격을 개시할 차례임.
			BossAtk = true;
		}
	}
	else{
		if(BossAtk == false) { // 등장뿐만아니라 공격패턴이 끝나고 난뒤에도 다음 공격패턴을위해 BossAtk을 true로 바꿔줌.
			BossAtk = true;
		}
	}
	if (BossAtk){ // BossAtk이 true일때 어떤 공격 패턴을 실행 할것인지 선택해줄꺼임.
		if(RandomNumBool == false) { // 패턴값이 정해지지 않았을경우 다시 재설정을 위해 실행시켜줌.
			PatternNum = 1+Math.floor(Math.random()*3); // 1,2,3의 값을 가짐.
			//alert(PatternNum);
			RandomNumBool = true; // 패턴 값이 정해졌으니 패턴을 실행하면된다.
		}
		if(PatternNum == 3) { // PatternNum의 값이 3일경우 BossPattern3을 실행
			BossPattern3();
		}
		else if(PatternNum == 2) { // PatternNum의 값이 2일경우 BossPattern2을 실행
			BossPattern2();
		}
		else if(PatternNum == 1) { // PatternNum의 값이 1일경우 BossPattern1을 실행
			BossPattern1();
		}
	}
	ctx.drawImage(Boss.img ,Boss.x, Boss.y, Boss.w, Boss.h); // 계속해서 보스를 그려줌.
}

function draw() {

	//무한으로 draw를 실행 60fps로 지원(초당 60번 호출)
	if(GameStatus == 'A') {
			// 캔버스를 그려준다. clearRect로 지우고 다시 만들어줌.
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctxR.clearRect(0, 0, canvas.width, canvas.height);
		
		if(lifeCount <= 0) { // 게임 오버. 플레이어 죽음. 모든 life 소진.
			GameStatus = 'E'; // 게임상태를 E로 전환.
		}

		// 내 ship을 그려준다.
		if(godTime == true) { // 무적시간일때 내배의 투명도를 낮춰주고 다시 투명도를 돌려서 다른 객체는 원본의 색상을 가짐.
			ctx.globalAlpha = 0.4;
			ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);
			ctx.globalAlpha = 1;
		}
		else { // 무적시간이 아닐때 그냥 모든 객체가 원본의 색상을 가짐.
			ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);
		}
		// 오른쪽 키를 눌렀을때 x값에 10을 더해준다. 아닐시 왼쪽 키를 눌렀을때 x값에 -10을 더해준다.
		if(rightPressed && ship.x < canvas.width - shipSize) {
			if(downPressed && ship.y < canvas.height - shipSize) {
				ship.x += 10;
				ship.y += 10;
			} // 오른쪽 키를 누르면서 위쪽, 아래쪽으로 이동이가능.
			else if(upPressed && ship.y > 0) {
				ship.x += 10;
				ship.y -= 10;
			}
			else {
				ship.x += 10;
			}
		}
		else if(leftPressed && ship.x > 0) {
			if(downPressed && ship.y < canvas.height - shipSize) {
				ship.y += 10;
				ship.x -= 10;
			} // 왼쪽 키를 누르면서 위쪽, 아래쪽으로 이동가능.
			else if(upPressed && ship.y > 0) {
				ship.y -= 10;
				ship.x -= 10;
			}
			else {
				ship.x -= 10;
			}
		} // 위로이동. 단 맵밖으로 못나가게 조건문을 설정.
		else if(upPressed && ship.y > 0) {
			ship.y -= 10;
		} // 아래로이동. 단 맵밖으로 못나가게 조건문을 설정.
		else if(downPressed && ship.y < canvas.height - shipSize) {
			ship.y += 10;
		}

		// 적기와 내 ship 충돌을 확인한다.
		checkCrash()
		// 충알 충돌여부를 확인한다.
		bulletCrash()
		// z를 눌렸을때 총알이 발사된다.
		if(zPressed) {
			ctx.fillText("bulletDelay: "+ bulletDelay, 50, 20);
			bulletDelay += 1; // 총알이 겹쳐서 나가지않게 딜레이를 넣어줌.
			if(bulletDelay%15 == 1) { // 누른시점부터 총알이 발사하게되고 해당 총알은 bulletDelay가 15로 나누었을때 나머지가 1일떄마다 createBullet() 함수를 실행시켜 총알을 만들어준다.
				createBullet();
			}
		}
		if(BossStage == false) { // 보스 스테이지가아닌 일반스테이지 즉 일반적들을 그려준다.
			//BossStage = true;
			drawAllEnemies();
		}
		else { // 보스스테이지를 그려준다.
			drawBoss();
		}
		drawAllBullets(); // 모든 총알을 그려준다.
		drawAllLife(); // 내배의 life를 그려준다.
		drawScore(); // score를 그려준다.
		requestAnimationFrame(draw); // draw함수를 계속해서 실행해준다.
	}
	else if(GameStatus == "P") { // 일시정지 상태이다. draw만 무한반복해줘서 입력을 받을 수는있지만 총알이나 적기의 값변경은 이루어지지 않는다.
		requestAnimationFrame(draw);
	}
	else if(GameStatus == "U") { // 내 배를 강화시킬수 있는 상태이다. 원래 z축이 -였던 값을 1000으로 설정시켜 캔버스 뒤에있던걸 앞으로 가져와준다.
		atkUP.style.zIndex=1000;
		atkCUP.style.zIndex=1000;
		atkHP.style.zIndex=1000;
	}
	else if(GameStatus == "E") { // 게임오버 상태이다. 메인메뉴로 갈수있는 버튼을 나타내준다.
		BoomAudio.play();
		//alert("사망하였습니다.");
		mainMenu.style.zIndex = 1000;
	}
	else if(GameStatus == "C") { // 게임 클리어 상태이다. 메인메뉴로 갈 수 있는 버튼을 2초후에 나타내준다.
		setTimeout(function() {mainMenu.style.zIndex = 1000; }, 2000);
	}
}

function SelectA() { // 공격력을 업그레이드 시켜주는 함수. atkUP버튼을 눌렸을때 이 함수 발동.
	alert("공격력 업");
	for (var i = 0 ; i < bulletCount; i++) { // 내 배의 모든 총알객체에다가 공격력(dmg)를 증가시켜준다.
		var bullet = bulletStatus[i];
		bullet.dmg += 25;
	}
	atkUP.style.zIndex=-1; // 업그레이드를 선택했으니 업그레이드 할 수 있는 버튼들은 다시 캔버스 뒤로 가게 설정해줌.
	atkCUP.style.zIndex=-1;
	atkHP.style.zIndex=-1;
	GameStatus = 'A'; // 다시 게임시작.
	draw(); // draw함수 호출.
}

function SelectAC() { // 공격개수를 업그레이드 시켜주는 함수. atkCUP버튼을 눌렀을때 이 함수 발동.
	alert("공격횟수 추가");
	msC += 1; // 미사일 개수를 추가시켜준다.
	atkUP.style.zIndex=-1; // 업그레이드를 선택했으니 업그레이드 할 수 있는 버튼들은 다시 캔버스 뒤로 가게 설정해줌.
	atkCUP.style.zIndex=-1;
	atkHP.style.zIndex=-1;
	GameStatus = 'A'; // 다시 게임시작.
	draw(); // draw함수 호출.
}

function SelectHP() { // 라이프를 회복시켜주는 함수. atkHP버튼을 눌렀을때 이 함수 발동.
	lifeCount+=2; // 한번에 체력 두칸을 채워준다.
	if(lifeCount < maxlifeCount) { // 체력이 최대체력보다 작을때 실행.
		alert("체력추가!");
		atkUP.style.zIndex=-1; // 업그레이드를 선택했으니 업그레이드 할 수 있는 버튼들은 다시 캔버스 뒤로 가게 설정해줌.
		atkCUP.style.zIndex=-1;
		atkHP.style.zIndex=-1;
		GameStatus = 'A'; // 다시 게임시작.
		draw(); // draw함수 호출.
	}
	else {
		if(lifeCount == 11) { // life가 9에서 더해져 11로 바뀌어 10(최대체력)을 초과했을때 10으로 바꿔줌.
			alert("체력추가!");
			lifeCount = 10;
			atkUP.style.zIndex=-1; // 업그레이드를 선택했으니 업그레이드 할 수 있는 버튼들은 다시 캔버스 뒤로 가게 설정해줌.
			atkCUP.style.zIndex=-1;
			atkHP.style.zIndex=-1;
			GameStatus = 'A'; // 다시 게임시작.
			draw(); // draw함수 호출.
		}
		else { // 이미 최대체력일때 다른걸 선택하라고 유도함.
			lifeCount = 10; 
			alert("최대 체력입니다. 다시 선택해주세요.");
		}
	}
}
// draw함수 호출.
draw();
var backGroundAudio = new Audio("Audio/BackGround.mp3"); // 메인메뉴 화면 및 게임 룰 설명 메뉴에서 쓸 배경음악이다.

function startBG() {
	backGroundAudio.volume = 0.2; // 소리를 0.2로 줄여줌
	backGroundAudio.autoplay = true; // 음악 실행
	backGroundAudio.loop = true; // 반복 실행
}
startBG();

function back() { // 뒤로가는 기능이다. 이전에 있었던 화면으로 돌아간다.
	history.back();
}

function create_id() { // 회원가입기능을 담당하는 함수이다.
	var id = document.querySelector('#id'); // id가 id인 태그 입력창에서 입력한 값을 id변수에다가 저장한다.
	var pw = document.querySelector('#pw'); // id가 pw인 태그 입력창에서 입력한 값을 pw변수에다가 저장한다.
	var r_pw = document.querySelector('#r_pw'); // id가 r_pw인 태그 입력창에서 입력한 값을 r_pw변수에다가 저장한다.
	
	if(id.value == "" || pw.value == "" || r_pw.value == "") { // 해당 변수에 값이없다. 입력한 값들이 없는 경우 메시지를 알린다.
		alert("회원가입을 할 수 없습니다.");
	}
	else { // 비밀번호와 비밀번호확인 칸의 입력이 다르다면 메시지를 알린다.
		if(pw.value !== r_pw.value) {
			alert("비밀번호를 확인해주세요.");
		}
		else { // 비밀번화와 비밀번호확인 칸의 입력이 같다면 해당 하이퍼링크로 이동한다.
			location.href = 'MainMenu.html';
		}
	}
}
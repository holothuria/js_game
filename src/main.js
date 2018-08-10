canvas1  = null;   // レイヤー1
ctx1     = null;   // コンテキスト
canvas2  = null;   // レイヤー2
ctx2     = null;   // コンテキスト


timerID = -1;   // タイマー



pStatus = new playerStatus();
param = new parameters();

// 主人公の生成
player = new actor();
player.img.file = new Image();
player.img.file.src = "../img/player.png";

player.positionX = 0;
player.positionY = 0;
player.vectorX = param.maxRunSpd;
player.vectorY = param.maxRunSpd;





function playerStatus(){
	this.remAirJump = 0;
	
	this.isTouchTop = false;
	this.isTouchLeft = false;
	this.isTouchRight = false;
	this.isTouchBottom = false;
	

}

function parameters(){

	this.maxRunSpd = 5;
	this.runAccel = 0.3;
	
	this.airRes = 0.1;
	
	this.jumpVecX = 5;
	this.jumpVecY = -12;
	this.airJumpVecX = 4.5;
	this.airJumpVecY = -10;
	


}


// キャラクターの情報オブジェクト
function actor(){
	this.img = function(){
		this.file = null;
		this.width = 0;
		this.height = 0;

	}

	this.positionX = 0;
	this.positionY = 0;

	this.posBfrX = 0;
	this.posBfrY = 0;

	this.vectorX = 0;
	this.vectorY = 0;

}


// 重力
function gravity(){
	player.vectorY += 0.8;
	
}

// 抵抗
function airResist(){
	if ((pStatus.isTouchBottom === false) && (pStatus.isTouchLeft === false) && (pStatus.isTouchRight === false)) {
		if (0.1 < player.vectorX) {
			player.vectorX -= param.airRes;
		
		} else if (player.vectorX < -0.1) {
			player.vectorX += param.airRes;
		}
		
	}
	
}

// 走行
function running(){

	if (pStatus.isTouchBottom === true) {
		if (Math.abs(player.vectorX) < param.maxRunSpd) {
			if (0 < player.vectorX) {
				player.vectorX += param.runAccel;
			
			} else {
				player.vectorX += -param.runAccel;
			}
		}
	}
	
	
}


// 開始処理
function start(){
	
	canvas1 = document.getElementById("layer1");   // キャンバス要素の取得
	ctx1 = canvas1.getContext("2d");   // キャンバスからコンテキストを取得
	
	canvas2 = document.getElementById("layer2");
	ctx2 = canvas2.getContext("2d");
	
	
	// 画像サイズ取得
	player.img.width = player.img.file.naturalWidth;
	player.img.height = player.img.file.naturalHeight;
	
	
	timerID = setInterval('draw()',50);
}



// メイン処理
function draw() {

	gravity();
	airResist();
	running();

	// キャラがいた場所の描画リセット
	ctx2.clearRect(player.posBfrX, player.posBfrY, player.img.width, player.img.height);

	// 描画
	ctx2.drawImage(player.img.file, player.positionX, player.positionY);

//	var imageData = ctx2.getImageData(0, 0, 300, 400);



//	ctx1.putImageData(imageData, 0, 0);

//	ctx1.beginPath();
//	ctx1.moveTo(0, 0);
//	ctx1.lineTo(player.positionX + 8 , player.positionY + 8);
//	ctx1.stroke();




	// 移動前座標の保存
	player.posBfrX = player.positionX;
	player.posBfrY = player.positionY;

	// 座標移動
	player.positionX += player.vectorX;
	player.positionY += player.vectorY;



	// 画面端の判定
	if (player.positionX <= 0) {
		player.positionX = 0;
		pStatus.isTouchLeft = true;
		if (pStatus.isTouchBottom === true) {
			player.vectorX = 0.1;
			
		} else {
			player.vectorY = 0.5;
			
		}
		
	} else {
		pStatus.isTouchLeft = false;
	
	}
	if (player.positionY <= 0) {
		player.positionY = 0;
		pStatus.isTouchTop = true;
		
	} else {
		pStatus.isTouchTop = false;
	
	}
	if ((300 - player.img.width) <= player.positionX) {
		player.positionX = 300 - player.img.width;
		pStatus.isTouchRight = true;
		if (pStatus.isTouchBottom === true) {
			player.vectorX = -0.1;
			
		} else {
			player.vectorY = 0.5;
			
		}
		
	} else {
		pStatus.isTouchRight = false;
		
	}
	if ((400 - player.img.height) <= player.positionY) {
		player.positionY = 400 - player.img.height;
		player.vectorY = 0;
		pStatus.isTouchBottom = true;
		pStatus.remAirJump = 1;
		
	} else {
		pStatus.isTouchBottom = false;
		
	}



}



document.addEventListener("click",clickEvent);


// クリック時処理
function clickEvent(event){
	
	if (pStatus.isTouchBottom === true) {
		if (event.pageX < 160) {
			player.vectorX = -param.jumpVecX;
		} else {
			player.vectorX = param.jumpVecX;
		}
		
		player.vectorY = param.jumpVecY;
		
		
	} else if ((pStatus.isTouchLeft === true) || (pStatus.isTouchRight === true)) {
		if (event.pageX < 160) {
			player.vectorX = -param.jumpVecX;
		} else {
			player.vectorX = param.jumpVecX;
		}
		
		player.vectorY = param.jumpVecY;
		
	
	} else if (1 <= pStatus.remAirJump) {
		if (event.pageX < 160) {
			player.vectorX = -param.airJumpVecX;
		} else {
			player.vectorX = param.airJumpVecX;
		}
		
		player.vectorY = param.airJumpVecY;
		
		pStatus.remAirJump -= 1;
	}
	
}








// 終了処理
function stop()
{
	clearInterval(timerID);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timerID = -1;
}


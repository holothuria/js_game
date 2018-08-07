canvas1  = null;   // レイヤー1
ctx1     = null;   // コンテキスト
canvas2  = null;   // レイヤー2
ctx2     = null;   // コンテキスト


timerID = -1;   // タイマー


status = new playerStatus();
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
	this.touchDirection = -1;
	this.remAirJump = 0;
	
	this.climbWallFlag = false;

}

function parameters(){

	this.maxRunSpd = 5;
	this.runAccel = 0.3;
	
	this.jumpVecX = 5;
	this.jumpVecY = -12;
	this.airJumpVecX = 3;
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
	if (status.touchDirection == -1) {
		if (0.1 < player.vectorX) {
			player.vectorX -= 0.1;
		
		} else if (player.vectorX < -0.1) {
			player.vectorX += 0.1;
		}
		
	}
	
}

// 走行
function running(){

	if (status.touchDirection == 2) {
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
function start()
{

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


	status.touchDirection = -1;
	status.climbWallFlag = false;

	// 画面端の判定
	if (player.positionX <= 0) {
		player.positionX = 0;
		status.touchDirection = 4;
		player.vectorY = 0.5;
		status.climbWallFlag = true;
		
	} else {
	}
	if (player.positionY <= 0) {
		player.positionY = 0;
		status.touchDirection = 8;
	}
	if ((300 - player.img.width) <= player.positionX) {
		player.positionX = 300 - player.img.width;
		status.touchDirection = 6;
		player.vectorY = 0.5;
		status.climbWallFlag = true;

		
	}
	if ((400 - player.img.height) <= player.positionY) {
		player.positionY = 400 - player.img.height;
		player.vectorY = 0;
		status.touchDirection = 2;
		status.remAirJump = 1;
	}



}



document.addEventListener("click",clickEvent);

// クリック時処理
function clickEvent(event){
	
	if (status.touchDirection == 2) {
		if (event.pageX < 160) {
			player.vectorX = -param.jumpVecX;
		} else {
			player.vectorX = param.jumpVecX;
		}
		
		player.vectorY = param.jumpVecY;
		
		
	} else if (status.climbWallFlag == true) {
		if (event.pageX < 160) {
			player.vectorX = -param.jumpVecX;
		} else {
			player.vectorX = param.jumpVecX;
		}
		
		player.vectorY = param.jumpVecY;
		
	
	} else if (1 <= status.remAirJump) {
		if (event.pageX < 160) {
			player.vectorX = -param.airJumpVecX;
		} else {
			player.vectorX = param.airJumpVecX;
		}
		
		player.vectorY = param.airJumpVecY;
		
		status.remAirJump -= 1;
	}
	
}













// 終了処理
function stop()
{
	clearInterval(timerID);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timerID = -1;
}



screenWid = 256;	// screen幅
screenHei = 320;	// screen高さ
chipWid = 32;	// 1マスの幅
chipHei = 32;	// 1マスの高さ

crsRowNum = -1;	// 読み込んだコースの行数

canvas1  = null;   // レイヤー1
canvas2  = null;   // レイヤー2


timerID = -1;   // タイマー


// オブジェクトの定義
ctx = new ctxMng();
pStatus = new playerStatus();
param = new parameters();

// 主人公の生成
player = new actor();
player.img.file.src = "../img/player.png";

player.posX = 0;
player.posY = 0;
player.vectorX = param.maxRunSpd;
player.vectorY = param.maxRunSpd;




// 地形配置物オブジェクトの生成
blcInf = [
	new terrainBlock(""),
	new terrainBlock("../img/block.png")
];


// コースデータ作成
courseData = [
	[0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1]
	
];




// コンテキスト管理
function ctxMng(){
	this.blc = null;	// 地形配置物
	this.ple = null;	// 主人公
	
}


// プレイヤー状態
function playerStatus(){
	this.remAirJump = 0;
	
	this.isTouchTop = false;
	this.isTouchLeft = false;
	this.isTouchRight = false;
	this.isTouchBottom = false;
	

}


// 変更されないパラメータ
function parameters(){

	this.maxRunSpd = 5;
	this.runAccel = 0.3;
	
	this.airRes = 0.1;
	
	this.jumpVecX = 5;
	this.jumpVecY = -12;
	this.airJumpVecX = 4.5;
	this.airJumpVecY = -10;
	
}

// 変更されるキャラクター情報
function actor(){
	this.img = new imgInfo();

	this.posX = 0;
	this.posY = 0;

	this.posBfrX = 0;
	this.posBfrY = 0;

	this.vectorX = 0;
	this.vectorY = 0;

}


// 画像情報保持
function imgInfo(){
	this.file = new Image();
	this.width = 0;
	this.height = 0;

}


// 地形ブロック
function terrainBlock(filePath){
	this.file = new Image();
	this.file.src = filePath;

	
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
	ctx.blc = canvas1.getContext("2d");   // キャンバスからコンテキストを取得
	
	canvas2 = document.getElementById("layer2");
	ctx.ple = canvas2.getContext("2d");
	
	
	// 画像サイズ取得
	player.img.width = player.img.file.naturalWidth;
	player.img.height = player.img.file.naturalHeight;
	
	
	timerID = setInterval('main()',50);
}



// メイン処理
function main() {

	gravity();
	airResist();
	running();

	// キャラがいた場所の描画リセット
	ctx.ple.clearRect(player.posBfrX, player.posBfrY, player.img.width, player.img.height);

	// 描画
	ctx.ple.drawImage(player.img.file, player.posX, player.posY);
	
	courseDrow();
//	ctx.blc.drawImage(blcInf[1].file, 200, 300);

//	var imageData = ctx.ple.getImageData(0, 0, 300, 400);



//	ctx.blc.putImageData(imageData, 0, 0);

//	ctx.blc.beginPath();
//	ctx.blc.moveTo(0, 0);
//	ctx.blc.lineTo(player.posX + 8 , player.posY + 8);
//	ctx.blc.stroke();




	// 移動前座標の保存
	player.posBfrX = player.posX;
	player.posBfrY = player.posY;

	// 座標移動
	player.posX += player.vectorX;
	player.posY += player.vectorY;

	touchJudge();


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



// コース描画
function courseDrow(){
	if (crsRowNum === 0) {
		return;
	}
	
	crsRowNum = 0;
	
	var drwPosX = 0;
	var drwPosY = 0;
	
	courseData.forEach(function(rowData){
		rowData.forEach(function(chipData){
			if (chipData !== 0) {
				ctx.blc.drawImage(blcInf[chipData].file, drwPosX, drwPosY);
				
			}
			
			drwPosX += chipWid;
			
		});
		
		drwPosX = 0;
		drwPosY += chipHei;
		
	});
	
}



// 接触判定
function touchJudge(){
	
	
	// 画面端の判定
	if (player.posX <= 0) {
		player.posX = 0;
		pStatus.isTouchLeft = true;
		if (pStatus.isTouchBottom === true) {
			player.vectorX = 0.1;
			
		} else {
			player.vectorY = 0.5;
			
		}
		
	} else {
		pStatus.isTouchLeft = false;
	
	}
	if (player.posY <= 0) {
		player.posY = 0;
		pStatus.isTouchTop = true;
		
	} else {
		pStatus.isTouchTop = false;
	
	}
	if ((screenWid - player.img.width) <= player.posX) {
		player.posX = screenWid - player.img.width;
		pStatus.isTouchRight = true;
		if (pStatus.isTouchBottom === true) {
			player.vectorX = -0.1;
			
		} else {
			player.vectorY = 0.5;
			
		}
		
	} else {
		pStatus.isTouchRight = false;
		
	}
	if ((screenHei - player.img.height) <= player.posY) {
		player.posY = screenHei - player.img.height;
		player.vectorY = 0;
		pStatus.isTouchBottom = true;
		pStatus.remAirJump = 1;
		
	} else {
		pStatus.isTouchBottom = false;
		
	}

}





// 終了処理
function stop()
{
	clearInterval(timerID);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timerID = -1;
}






scWidth = 256;	// screen幅
scHeight = 320;	// screen高さ
chipWid = 32;	// 1マスの幅
chipHei = 32;	// 1マスの高さ

if (navigator.userAgent.indexOf("Android") > 0 || navigator.userAgent.indexOf("iPhone") > 0) {
	vpWidth = 1000;
} else {
	vpWidth = scWidth;
}



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
	[0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 1, 0],
	[1, 0, 0, 0, 0, 0, 0, 0]
	
];




// コンテキスト管理
function ctxMng(){
	this.blc = null;	// 地形配置物
	this.ple = null;	// 主人公
	
}


// プレイヤー状態
function playerStatus(){
	this.remAirJump = 0;
	this.climbFlag = false;
	
	this.isTouchT = false;
	this.isTouchL = false;
	this.isTouchR = false;
	this.isTouchB = false;
	

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
	
	this.climbSpd = 4;
	
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
	if ((pStatus.isTouchB === false) && (pStatus.isTouchL === false) && (pStatus.isTouchR === false)) {
		if (0.1 < player.vectorX) {
			player.vectorX -= param.airRes;
		
		} else if (player.vectorX < -0.1) {
			player.vectorX += param.airRes;
		}
		
	}
	
}

// 走行
function running(){
	if (pStatus.isTouchB === true) {
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
	
	
	timerID = setInterval('main()',45);
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


document.addEventListener("mousedown", mousedownEvent);
document.addEventListener("touchstart", mousedownEvent);

document.addEventListener("mouseup", clickEvent);
document.addEventListener("touchend", clickEvent);


// 長押し時処理
function mousedownEvent(event){
	
	if ((pStatus.isTouchR === true)) {
		if ((scWidth / 2) < event.pageX) {
			pStatus.climbFlag = true;
		}
	} else if ((pStatus.isTouchL === true)) {
		if (event.pageX < (scWidth / 2)) {
			pStatus.climbFlag = true;
		}
	
	}
}


// クリック時処理
function clickEvent(event){
	pStatus.climbFlag = false;
	
	if (pStatus.isTouchB === true) {
		if (event.pageX < (scWidth / 2)) {
			player.vectorX = -param.jumpVecX;
		} else {
			player.vectorX = param.jumpVecX;
		}
		
		player.vectorY = param.jumpVecY;
		
		
	} else if ((pStatus.isTouchL === true) || (pStatus.isTouchR === true)) {
		if (event.pageX < (scWidth / 2)) {
			player.vectorX = -param.jumpVecX;
		} else {
			player.vectorX = param.jumpVecX;
		}
		
		player.vectorY = param.jumpVecY;
		
	
	} else if (1 <= pStatus.remAirJump) {
		if (event.pageX < (scWidth / 2)) {
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
	var isWall = new Array(8);
	
	var biggerPosX = Math.floor(player.posX) + player.img.width;
	var biggerPosY = Math.floor(player.posY) + player.img.height;
	
	isTchT = false;
	isTchL = false;
	isTchR = false;
	isTchB = false;
	
	// 画面端の判定
	if (player.posX <= 0) {
		isTchL = true;
	}
	if (player.posY <= 0) {
		isTchT = true;
	}
	if ((scWidth - player.img.width) <= player.posX) {
		isTchR = true;
	}
	
	if ((scHeight - player.img.height) <= player.posY) {
		isTchB = true;
	}
	
	// ブロック判定
	isWall[0] = isInWall(player.posX, player.posY);
	isWall[1] = isInWall(biggerPosX, player.posY);
	isWall[2] = isInWall(biggerPosX, biggerPosY);
	isWall[3] = isInWall(player.posX, biggerPosY);
	
	if (isWall[0] && isWall[1]) {
		isTchT = true;
	}
	if (isWall[1] && isWall[2]) {
		isTchR = true;
	}
	if (isWall[2] && isWall[3]) {
		isTchB = true;
	}
	if (isWall[3] && isWall[0]) {
		isTchL = true;
	}
	
	if (!(isTchT || isTchL) && isWall[0]) {
		var diffX = chipWid - (player.posX % chipWid);
		var diffY = chipHei - (player.posY % chipHei);
		if (diffX <= diffY) {
			// 同値は左
			isTchL = true;
		} else {
			isTchT = true;
		}
	}
	
	if (!(isTchT || isTchR) && isWall[1]) {
		var diffX = biggerPosX % chipWid;
		var diffY = chipHei - (player.posY % chipHei);
		if (diffX <= diffY) {
			// 同値は右
			isTchR = true;
		} else {
			isTchT = true;
		}
	}
	
	if (!(isTchR || isTchB) && isWall[2]) {
		if (pStatus.isTouchB) {
			isTchB = true;
			
		} else {
			var diffX = biggerPosX % chipWid;
			var diffY = biggerPosY % chipHei;
			if (diffX < diffY) {
				// 同値は下
				isTchR = true;
			} else {
				isTchB = true
			}
		}
	}
	
	if (!(isTchL || isTchB) && isWall[3]) {
		if (pStatus.isTouchB) {
			isTchB = true;
			
		} else {
			var diffX = chipWid - (player.posX % chipWid);
			var diffY = biggerPosY % chipHei;
			if (diffX < diffY) {
				// 同値は下
				isTchL = true;
			} else {
				isTchB = true
			}
		}
	}
	
	
	
	if (isTchT) {
		player.posY = Math.ceil(player.posY / chipWid) * chipWid;
		player.vectorY = 0;
		
	}
	
	if (isTchL) {
		player.posX = Math.ceil(player.posX / chipWid) * chipWid;
		if (isTchB) {
			player.vectorX = 0.1;
			
		} else {
			player.vectorX = -0.1;
			if (pStatus.climbFlag) {
				player.vectorY = -param.climbSpd;
				
			} else {
				player.vectorY = 0.5;
				
			}
		}
		
	}
	
	if (isTchR) {
		player.posX = Math.floor((player.posX + player.img.width) / chipWid) * chipWid - player.img.width;
		if (isTchB) {
			player.vectorX = -0.1;
			
		} else {
			player.vectorX = 0.1;
			if (pStatus.climbFlag) {
				player.vectorY = -param.climbSpd;
				
			} else {
				player.vectorY = 0.5;
				
			}
			
		}
		
	}
	
	if (isTchB) {
		player.posY = Math.floor((player.posY + player.img.height) / chipHei) * chipHei - player.img.height;
		player.vectorY = 0;
		pStatus.remAirJump = 1;
		
	}
	
	
	pStatus.isTouchT = isTchT;
	pStatus.isTouchL = isTchL;
	pStatus.isTouchR = isTchR;
	pStatus.isTouchB = isTchB;
	
	
}

// 座標が壁の中か判定
function isInWall(posX, posY){
	if (scWidth <= posX){
		posX = scWidth - 1;
	}
	
	if (scHeight <= posY){
		posY = scHeight - 1;
	}
	
	posX /= chipWid;
	posY /= chipHei;
	
	return courseData[Math.floor(posY)][Math.floor(posX)] !== 0;

}




// 終了処理
function stop()
{
	clearInterval(timerID);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timerID = -1;

}


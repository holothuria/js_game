
const scWidth = 320;	// screen幅
const scHeight = 416;	// screen高さ
const chipWid = 32;	// 1マスの幅
const chipHei = 32;	// 1マスの高さ

const vpWidth = scWidth;	// vp幅


crsRowNum = -1;	// 読み込んだコースの行数

let nowRowScr = 0;	// スクロール現在の行端数


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
player.img.sideDivide = 3;
player.img.lengthDivide = 2;


player.posX = scWidth / 2;
player.posY = scHeight - chipHei;
player.vectorX = param.maxRunSpd;
player.vectorY = param.maxRunSpd;




// 地形配置物オブジェクトの生成
blcInf = [
	new terrainBlock(""),
	new terrainBlock("../img/block.png")
];


// コースデータ作成
courseData = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
	
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
	this.img = {
		file : new Image(),
		sideDivide : 1,
		lengthDivide : 1,
		
		width : 0,
		height : 0,
		
	}

	this.posX = 0;
	this.posY = 0;

	this.posBfrX = 0;
	this.posBfrY = 0;

	this.vectorX = 0;
	this.vectorY = 0;

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
	player.img.width = (player.img.file.naturalWidth / player.img.sideDivide);
	player.img.height = (player.img.file.naturalHeight / player.img.lengthDivide);
	
	
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
	courseDrow();
	drowPlayer();
	

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
		if ((scWidth / 2) < getPageX(event)) {
			pStatus.climbFlag = true;
		}
	} else if ((pStatus.isTouchL === true)) {
		if (getPageX(event) < (scWidth / 2)) {
			pStatus.climbFlag = true;
		}
	
	}
}


// クリック時処理
function clickEvent(event){
	pStatus.climbFlag = false;
	
	if (pStatus.isTouchB === true) {
		jumpAction(event, true);
		
	} else if ((pStatus.isTouchL === true) || (pStatus.isTouchR === true)) {
		jumpAction(event, true);
	
	} else if (1 <= pStatus.remAirJump) {
		jumpAction(event, false);
	}
	
}


// ジャンプ
function jumpAction(e, landFlag){
	
	if (landFlag) {
		vecX = param.jumpVecX;
		vecY = param.jumpVecY;
		
	} else {
		vecX = param.airJumpVecX;
		vecY = param.airJumpVecY;
		pStatus.remAirJump -= 1;
		
	}
	
	if (getPageX(event) < (scWidth / 2)) {
		player.vectorX = -vecX;
		
	} else {
		player.vectorX = vecX;
		
	}
	
	player.vectorY = vecY;
	
}


// クリック・タッチ X座標 取得
function getPageX(e){
	var pageX = 0;
	
	if (e.changedTouches) {
		pageX = e.changedTouches[0].pageX;
	} else {
		pageX = e.pageX;
	}
	
	return pageX;
}




// 主人公描画
dPlayerCount = 0;	// 主人公アニメーション用
function drowPlayer(){
	var dStartX = 0;
	var dStartY = 0;
	
	const animFNum = 4;
	
	if (pStatus.isTouchB) {
		dStartX = player.img.width * (Math.floor(dPlayerCount / animFNum) % player.img.sideDivide);
		if (dPlayerCount === (animFNum * 3 - 1)){
			dPlayerCount = animFNum * 4;
		
		} else if ((animFNum * 5) <= dPlayerCount) {
			dPlayerCount = 0;
			
		} else {
			dPlayerCount += 1;
			
		}
		
	} else {
		dStartX = 0;
		
	}
	
	
	
	if (0 < player.vectorX) {
		dStartY = 0;
		
	} else {
		dStartY = player.img.height;
		
	}
	
		ctx.ple.drawImage(player.img.file, dStartX, dStartY, player.img.width, player.img.height, player.posX, player.posY, player.img.width, player.img.height);
		
}


// コース描画
function courseDrow(){
	if (crsRowNum === 0) {
		return;
		
	} else if (crsRowNum === -1 ) {
		// コースの初期化
		crsRowNum = courseData.length;
		
		var drwPosY = scHeight - chipHei;
		
		for (var i = 0; i < (scHeight / chipHei); i++){
			crsRowNum--;
			drowOneRow(drwPosY, courseData[crsRowNum]);
			drwPosY -= chipHei;
			
		}
		
	} else if (player.posY < (scHeight / 2)) {
		// 上方スクロール
		var scrY = Math.ceil((scHeight / 2) - player.posY);
		if (chipHei <= nowRowScr) {
			if (crsRowNum === 1) {
				scrY = chipHei - nowRowScr;
				nowRowScr = chipHei;
			}
		}
		
		var imageData = ctx.blc.getImageData(0, 0, scWidth, (scHeight - scrY));
		ctx.blc.putImageData(imageData, 0, scrY);
		ctx.blc.clearRect(0, 0, scWidth, scrY);
		
		nowRowScr += scrY;
		if (chipHei <= nowRowScr) {
			drowOneRow((nowRowScr - chipHei), courseData[crsRowNum - 1]);
			nowRowScr -= chipHei;
			crsRowNum--;
			
		}
		
		drowOneRow((nowRowScr - 32), courseData[crsRowNum - 1]);
		
		player.posY += scrY;
		
	}
	
}

// 1列描画
function drowOneRow(drwPosY, rowData){
	var drwPosX = 0;
	
	rowData.forEach(function(chipData){
		if (chipData !== 0) {
			ctx.blc.drawImage(blcInf[chipData].file, drwPosX, drwPosY);
			
		}
		
		drwPosX += chipWid;
		
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
				isTchB = true;
			}
		}
	}
	
	
	
	if (isTchT) {
		player.posY = Math.ceil((player.posY - nowRowScr) / chipWid) * chipWid;
		player.posY += nowRowScr;
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
		if (!((scHeight - player.img.height) <= player.posY)) {
			player.posY += nowRowScr;
			
		}
		
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
	
	posY -= nowRowScr;
	posY /= chipHei;
	
	posY += crsRowNum;
	
	return courseData[Math.floor(posY)][Math.floor(posX)] !== 0;

}




// 終了処理
function stop()
{
	clearInterval(timerID);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timerID = -1;

}


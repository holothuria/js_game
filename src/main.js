
const scWidth = 320;	// screen幅
const scHeight = 416;	// screen高さ
const chipWid = 32;	// 1マスの幅
const chipHei = 32;	// 1マスの高さ

const vpWidth = scWidth;	// vp幅

let crsRowNum = -1;	// 読み込んだコースの行数

let nowRowScr = 0;	// スクロール現在の行端数

canvas1 = null;	// レイヤー
canvas2 = null;
canvas3 = null;

mainTimer = -1;		// main処理用タイマー
recodeTimer = -1;	// 記録用タイマー

recodeTenMillSecond = 0;	// 経過時間(1/100秒)
timeAlterCount = 0;			// 経過時間更新カウント


// オブジェクトの定義
ctx = new ctxMng();
pStatus = new playerStatus();
param = new parameters();

// 主人公の生成
player = new actor();
player.img.file.src = "../img/player.png";
player.img.sideDivide = 3;
player.img.lengthDivide = 3;

player.posX = scWidth / 2;
player.posY = scHeight - chipHei;
player.vectorX = param.maxRunSpd;
player.vectorY = param.maxRunSpd;




// 地形配置物オブジェクトの生成
blcInf = [
	new terrainBlock("", -1),
	new terrainBlock("../img/block.png", -1),
	new terrainBlock("", 0)
];

// ゲームイベント配列の生成
gameEve = [
	function(){
		goalEvent();
	}
	
];


// コースデータ作成
courseData = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
	[1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
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
	this.str = null;	// タイマー表示
	
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


// 変更されないキャラパラメータ
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
function terrainBlock(filePath, gameEventId){
	this.file = new Image();
	this.file.src = filePath;
	this.gameEventId = gameEventId;

	
}



// 重力
function gravity(){
	player.vectorY += 0.8;
	
}

// 空気抵抗
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
	
	// キャンバス取得
	canvas1 = document.getElementById("layer1");
	canvas2 = document.getElementById("layer2");
	canvas3 = document.getElementById("layer3");
	ctx.blc = canvas1.getContext("2d");
	ctx.ple = canvas2.getContext("2d");
	ctx.str = canvas3.getContext("2d");
	
	// 画像サイズ取得
	player.img.width = (player.img.file.naturalWidth / player.img.sideDivide);
	player.img.height = (player.img.file.naturalHeight / player.img.lengthDivide);
	
	// 処理セッティング
	document.addEventListener("mousedown", mousedownEvent);
	document.addEventListener("touchstart", mousedownEvent);
	document.addEventListener("mouseup", clickEvent);
	document.addEventListener("touchend", clickEvent);
	
	mainTimer = setInterval("main()",45);
	recodeTimer = setInterval("timeCount()", 10);
	
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
		ctx.ple.globalAlpha = 0.7;
		
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
	let dStartX = 0;
	let dStartY = 0;
	
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
		
	} else if (pStatus.isTouchR) {
		dStartX = player.img.width * 2;
		
	} else {
		dStartX = 0;
		
	}
	
	if (pStatus.isTouchL || pStatus.isTouchR) {
		dStartY = player.img.height * 2;
		
	} else if (0 < player.vectorX) {
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
		if (chipHei <= (nowRowScr + scrY)) {
			if (crsRowNum === 1) {
				scrY = chipHei - nowRowScr;
				nowRowScr = chipHei;
				
			} else {
				nowRowScr += scrY;
				
			}
		} else {
			nowRowScr += scrY;
			
		}
		
		var imageData = ctx.blc.getImageData(0, 0, scWidth, (scHeight - scrY));
		ctx.blc.putImageData(imageData, 0, scrY);
		ctx.blc.clearRect(0, 0, scWidth, scrY);
		
		if (chipHei <= nowRowScr) {
			drowOneRow((nowRowScr - chipHei), courseData[crsRowNum - 1]);
			nowRowScr -= chipHei;
			crsRowNum--;
			
		}
		
		drowOneRow((nowRowScr - chipHei), courseData[crsRowNum - 1]);
		
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
	let isWall = new Array(4);
	
	let shiftPosY = player.posY - nowRowScr;
	let biggerPosX = Math.floor(player.posX) + player.img.width;
	let biggerPosY = Math.floor(shiftPosY) + player.img.height;
	
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
	isWall[0] = isInWall(player.posX, shiftPosY);
	isWall[1] = isInWall(biggerPosX, shiftPosY);
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
		var diffY = chipHei - (shiftPosY % chipHei);
		if (diffX <= diffY) {
			// 同値は左
			isTchL = true;
		} else {
			isTchT = true;
		}
	}
	
	if (!(isTchT || isTchR) && isWall[1]) {
		var diffX = biggerPosX % chipWid;
		var diffY = chipHei - (shiftPosY % chipHei);
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
		player.posY = Math.ceil((shiftPosY - nowRowScr) / chipWid) * chipWid;
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
		if ((scHeight - player.img.height) <= player.posY) {
			player.posY = scHeight - player.img.height;
			
		} else {
			player.posY = Math.floor((shiftPosY + player.img.height) / chipHei) * chipHei - player.img.height;
			player.posY += nowRowScr;
			
		}
		
		player.vectorY = 0;
		pStatus.remAirJump = 1;
		ctx.ple.globalAlpha = 1.0;
		
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
	
	posY += crsRowNum;
	
	posX = Math.floor(posX);
	posY = Math.floor(posY);
	
	if (posX < 0 || posY < 0) {
		return false;
	}
	
	nowSection = courseData[posY][posX];
	
	if (blcInf[nowSection].gameEventId !== -1) {
		gameEve[blcInf[nowSection].gameEventId]();
	}
	
	return nowSection !== 0;

}




// 時間記録
let second = 0;
let minute = 0;
function timeCount(){
	recodeTenMillSecond++;
	timeAlterCount++;
	
	if (25 < timeAlterCount) {
		second = Math.floor(recodeTenMillSecond / 100);
		minute = Math.floor(second / 60);
		second %= 60;
		
		
		if (second < 10) {
			second = "0" + second;
		}
		
		ctx.str.clearRect(5 ,0 , 100, 30);
		ctx.str.fillText(( minute + "'" + second + "\"" + (recodeTenMillSecond % 100)), 10, 15);
		
		timeAlterCount = 0;
		
	}
	
	
}



// 停止処理
function stop(){
	clearInterval(mainTimer);
	clearInterval(recodeTimer);
	mainTimer = -1;
	recodeTimer = -1;
	
	second = Math.floor(recodeTenMillSecond / 100);
	minute = Math.floor(second / 60);
	second %= 60;
	
	if (second < 10) {
		second = "0" + second;
	}
	
	ctx.str.clearRect(5 ,0 , 100, 30);
	ctx.str.fillText(( minute + "'" + second + "\"" + (recodeTenMillSecond % 100)), 10, 15);
	
}




// ゴール  ID：0
function goalEvent(){
	stop();
	
	ctx.str.font = "30px 'ＭＳ ゴシック'";
	ctx.str.fillText("ゴール！", scWidth * 0.2, scHeight * 0.5);
	
	second = Math.floor(recodeTenMillSecond / 100);
	minute = Math.floor(second / 60);
	second %= 60;
	
	if (second < 10) {
		second = "0" + second;
	}
	
	ctx.str.clearRect(5 ,0 , 150, 30);
	ctx.str.fillText(( minute + "'" + second + "\"" + (recodeTenMillSecond % 100)), scWidth * 0.3, (scHeight * 0.5 + 35));
	
}









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

actorName = null;	// 使用キャラ
stageName = null;	// ステージ名
userName = null;	// ユーザー名


// オブジェクトの定義
ctx = new ctxMng();
pStatus = new playerStatus();
param = new parameters();


// 主人公のオブジェクト生成
player = new actor();
player.img.file.src = "../data/img/player.png";


// 地形配置物オブジェクトの生成
blcInf = [
	new terrainBlock("", 0.0,-1),
	new terrainBlock("../img/block/block.png", 1.0, -1),
	new terrainBlock("../img/block/goal.png", 1.0, 0),
	new terrainBlock("../img/block/urchin.png", 1.0, 1),
	new terrainBlock("../img/block/iceBlock.png", 0.15, -1),
	new terrainBlock("../img/block/upper.png", 0.0, 2)
	
];

// ゲームイベント配列の生成
gameEve = [
	function(){
		goalEvent();
	},
	function(){
		lose();
	},
	function(){
		upper();
	}
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
	
	this.justJumpFlag = false;
	
	this.terResValue = 0.00;
	
	this.upperFlag = false;

}


// 変更されないキャラパラメータ
function parameters(){
	this.maxRunSpd = 5;
	this.runAccel = 0.3;

	this.maxAirJump = 1;
	this.airRes = 0.1;
	this.minAirRes = 0.2;
	this.gravityRate = 1.00;
	
	this.jumpVecX = 5;
	this.jumpVecY = -12;
	this.wallJumpVecX = this.jumpVecX;
	this.wallJumpVecY = this.jumpVecY;
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
function terrainBlock(filePath, resValue, gameEventId){
	this.file = new Image();
	this.file.src = filePath;
	this.resValue = resValue;
	this.gameEventId = gameEventId;
	
}



// 主人公設定メソッド
function settingActor(actorName){
	
	if (actorName === "lepusGirl") {
		player.img.file.src = "../img/actor/lepusGirl.png";
		param.maxRunSpd = 3;
		param.runAccel = 0.1;
		
		param.airRes = 0.03;
		param.minAirRes = 1.2;
		param.gravityRate = 0.30;
		
		param.jumpVecX = 3.5;
		param.jumpVecY = -7;
		param.wallJumpVecX = 4;
		param.wallJumpVecY = -6.5;
		param.airJumpVecX = 3.5;
		param.airJumpVecY = -7;
		
		param.climbSpd = 1.5;
		
	} else if(actorName === "ranaGirl") {
		player.img.file.src = "../img/actor/ranaGirl.png";
		param.maxRunSpd = 0;
		param.runAccel = 2;
		
		param.maxAirJump = 3;
		param.airRes = 0.05;
		param.minAirRes = 1.0;
		
		param.jumpVecX = 5;
		param.jumpVecY = -15;
		param.wallJumpVecX = 6;
		param.wallJumpVecY = -14;
		param.airJumpVecX = 4;
		param.airJumpVecY = -13;
		
		param.climbSpd = 0;
		
	} else if (actorName === "corvusMan") {
		player.img.file.src = "../img/actor/corvusMan.png";
		param.airRes = 0;
		param.gravityRate = 0.70;
		
		param.jumpVecX = 0;
		param.jumpVecY = -18;
		param.wallJumpVecX = 8;
		param.wallJumpVecY = -3.5;
		param.airJumpVecX = 7;
		param.airJumpVecY = 0;
		
	} else {
		// 少年になる
		player.img.file.src = "../img/actor/player.png";
		
		
	}
	
	player.img.sideDivide = 3;
	player.img.lengthDivide = 3;
	player.posX = scWidth / 2;
	player.posY = scHeight - chipHei;
	player.vectorX = param.maxRunSpd;
	player.vectorY = param.maxRunSpd;
	
	setTimeout(function(){
		// 画像サイズ取得
		player.img.width = (player.img.file.naturalWidth / player.img.sideDivide);
		player.img.height = (player.img.file.naturalHeight / player.img.lengthDivide);
	}, 500);
	
}



// コースデータ作成
courseData = null;
function settingStage(stageName){
	if (stageName === "deathAndStage") {
		courseData = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[2, 0, 0, 0, 0, 0, 0, 0, 0, 3],
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 3, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 1, 1, 3, 1, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 3],
			[0, 0, 3, 3, 1, 1, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 3, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 3],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 1, 1, 1, 1, 1, 3, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 3, 0, 1, 1, 1, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 3]
		];
	} else if(stageName === "iceStage"){
		courseData = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[2, 0, 0, 0, 0, 0, 0, 0, 0, 4],
			[1, 1, 4, 0, 0, 0, 0, 0, 0, 4],
			[0, 0, 4, 4, 4, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 4, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 4, 0],
			[0, 0, 4, 0, 4, 0, 4, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 4],
			[4, 0, 4, 4, 4, 4, 0, 1, 0, 4],
			[0, 0, 1, 0, 1, 0, 0, 1, 0, 4],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 4],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 4],
			[4, 0, 0, 0, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 4, 4, 4, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
			[4, 4, 4, 0, 0, 0, 0, 0, 0, 4],
			[4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 4, 4, 0, 0],
			[4, 0, 0, 0, 0, 0, 4, 4, 0, 0],
			[1, 0, 0, 0, 0, 0, 4, 4, 0, 0],
			[4, 0, 4, 1, 1, 1, 1, 4, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 4, 0, 0],
			[4, 0, 0, 0, 0, 0, 0, 4, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[4, 4, 4, 0, 0, 0, 0, 0, 0, 4]
		];
	} else {
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
			[0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 5, 1, 0, 0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
			[0, 0, 0, 4, 4, 4, 0, 4, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 5]
		];
	}
}






// URLからgetパラメータを取得し、配列に格納
function getUrlValues(){
	let values = [];
	let params = location.search.replace("?", "").split("&");
	
	var i = 0;
	params.forEach(function(param){
		values[i] = decodeURIComponent(param.slice(param.indexOf("=") + 1));
		i++;
	});
	
	return values;
}



// 開始前処理
function start(){
	
	// キャンバス取得
	canvas1 = document.getElementById("layer1");
	canvas2 = document.getElementById("layer2");
	canvas3 = document.getElementById("layer3");
	ctx.blc = canvas1.getContext("2d");
	ctx.ple = canvas2.getContext("2d");
	ctx.str = canvas3.getContext("2d");
	
	
	// URLからGET取得
	var values = getUrlValues();
	actorName = values[0];
	stageName = values[1];
	userName = values[2];
	
	// 主人公の設定
	settingActor(actorName);
	
	// ステージの設定
	settingStage(stageName);
	
	// 実開始処理の設定 画像等ロード用に500ms待機
	setTimeout(function(){
		document.addEventListener("mouseup", startEvent)
		document.addEventListener("touchend", startEvent)
		
		ctx.str.font = "30px 'ＭＳ ゴシック'";
		ctx.str.fillText("クリックでスタート", scWidth * 0.1, scHeight * 0.4);
		ctx.str.fillText("※ 音が鳴ります！", scWidth * 0.1, scHeight * 0.6);
	
	}, 500);
	
	
}

// 開始処理
function startEvent(event){
	ctx.str.clearRect(0, 0, scWidth, scHeight);
	ctx.str.font = "12px 'ＭＳ ゴシック'"
	
	document.removeEventListener("mouseup", startEvent);
	document.removeEventListener("touchend", startEvent)
	
	
	// 処理セッティング
	if (event.changedTouches) {
		document.addEventListener("touchstart", mousedownEvent);
		document.addEventListener("touchend", clickEvent);
		
	} else {
		document.addEventListener("mousedown", mousedownEvent);
		document.addEventListener("mouseup", clickEvent);
		
	}
	
	
	document.getElementById("bgm").play();
	
	mainTimer = setInterval("main()",45);
	recodeTimer = setInterval("timeCount()", 10);
	
}




// 重力
function gravity(){
	player.vectorY += (0.8 * param.gravityRate);
	
}

// 空気抵抗
function airResist(){
	if ((pStatus.isTouchB === false) && (pStatus.isTouchL === false) && (pStatus.isTouchR === false)) {
		if (param.minAirRes < player.vectorX) {
			player.vectorX -= param.airRes;
		
		} else if (player.vectorX < -param.minAirRes) {
			player.vectorX += param.airRes;
		}
		
	}
	
}

// 走行
function running(){
	if (pStatus.isTouchB === true) {
		let tmpAccel = param.runAccel;
		if (player.vectorX < 0) {
			tmpAccel *= -1;
		}
		if (Math.abs(player.vectorX) < param.maxRunSpd) {
			
			player.vectorX += tmpAccel;
			
		} else if (!param.justJumpFlag) {
			if (Math.abs(player.vectorX) < Math.abs(tmpAccel)) {
				player.vectorX = 0;
			} else {
				player.vectorX -= tmpAccel;
			
			}
			
		}
		
		
	}
	
	param.justJumpFlag = false;
	
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
	
	// ステータスリセット
	pStatus.terResValue = 0.00;
	pStatus.upperFlag = false;
	
	// 接触判定
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
	
	if ((getPageX(event) < (scWidth / 2)) && pStatus.isTouchL) {
		return;
		
	} else if ((scWidth / 2) <= (getPageX(event)) && pStatus.isTouchR) {
		return;
		
	}
	
	jumpAction(event);
	
	
}


// ジャンプ
function jumpAction(e){
	
	param.justJumpFlag = true;
	
	if (pStatus.isTouchB === true) {
		vecX = param.jumpVecX;
		vecY = param.jumpVecY;
		
	} else if ((pStatus.isTouchL === true) || (pStatus.isTouchR === true)) {
		vecX = param.wallJumpVecX;
		vecY = param.wallJumpVecY;
		
	} else if (1 <= pStatus.remAirJump) {
		vecX = param.airJumpVecX;
		vecY = param.airJumpVecY;
		pStatus.remAirJump -= 1;
		ctx.ple.globalAlpha = 0.7;
		
	} else {
		return;
		
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
	
	if (!pStatus.isTouchB && (pStatus.isTouchL || pStatus.isTouchR)) {
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
		pStatus.terResValue += 2.0;
	}
	if (player.posY <= 0) {
		isTchT = true;
	}
	if ((scWidth - player.img.width) <= player.posX) {
		isTchR = true;
		pStatus.terResValue += 2.0;
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
			climbCalc();
			
		}
		
	}
	
	if (isTchR) {
		player.posX = Math.floor((player.posX + player.img.width) / chipWid) * chipWid - player.img.width;
		if (isTchB) {
			player.vectorX = -0.1;
			
		} else {
			player.vectorX = 0.1;
			climbCalc();
			
		}
		
	}
	
	if (isTchB) {
		if ((scHeight - player.img.height) <= player.posY) {
			player.posY = scHeight - player.img.height;
			
		} else {
			player.posY = Math.floor((shiftPosY + player.img.height) / chipHei) * chipHei - player.img.height;
			player.posY += nowRowScr;
			
		}
		if (!pStatus.upperFlag) {
			player.vectorY = 0;
		}
		
		pStatus.remAirJump = param.maxAirJump;
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
	pStatus.terResValue += blcInf[nowSection].resValue;
	
	if (blcInf[nowSection].gameEventId !== -1) {
		gameEve[blcInf[nowSection].gameEventId]();
	}
	
	return nowSection !== 0;

}




// 壁張り付き上下移動計算
function climbCalc(){
	if (!pStatus.upperFlag){
		if (pStatus.climbFlag) {
			player.vectorY = -param.climbSpd * (pStatus.terResValue / 2);
			
				
		} else {
			player.vectorY = 0.5 / (pStatus.terResValue / 2) * param.gravityRate;
			
		}
	}
	
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


// メニューに戻る
function returnMenu(){
	let values = getUrlValues();
	let param = "?";
	
	param += "actor=" + values[0] + "&";
	param += "stage=" + values[1] + "&";
	param += "userName=" + values[2];
	
	window.location.href = "./index.html" + param;
	
	
	
	
	
}


// ==========================
// ゲームイベント


// ゴール  ID：0
function goalEvent(){
	let tenMillSecond = recodeTenMillSecond;
	
	stop();
	
	second = Math.floor(recodeTenMillSecond / 100);
	minute = Math.floor(second / 60);
	second %= 60;
	tenMillSecond %= 100;
	
	if (second < 10) {
		second = "0" + second;
	}
	
	if (tenMillSecond < 10) {
		tenMillSecond = "0" + tenMillSecond;
	}
	
	ctx.str.clearRect(5 ,0 , 150, 30);
	
	ctx.str.font = "30px 'ＭＳ ゴシック'";
	ctx.str.fillText("ゴール！", scWidth * 0.2, (scHeight * 0.5 - 35));
	ctx.str.fillText(getUrlValues()[2], scWidth * 0.1, scHeight * 0.5);
	ctx.str.fillText(( minute + "'" + second + "\"" + tenMillSecond), scWidth * 0.3, (scHeight * 0.5 + 35));
	
	document.addEventListener("click", returnMenu)
	
}



// やられてしまった！ ID: 1
function lose(){
	
	stop();
	
	setTimeout(function(){
		ctx.str.clearRect(5 ,0 , 150, 30);
		ctx.str.font = "30px 'ＭＳ ゴシック'";
		ctx.str.fillText("やられてしまった！", scWidth * 0.1, scHeight * 0.5);
		
		ctx.blc.fillStyle = 'red';
		ctx.blc.fillRect(0, 0, scWidth, scHeight);
		
		setTimeout("returnMenu()", 1000);
		
		
	}, 300);
	
	
}


// 強制ジャンプ ID:2
function upper() {
	player.vectorY = -15;
	
	if (pStatus.isTouchR) {
		player.vectorX = -0.5;
	} else if (pStatus.isTouchL) {
		player.vectorX = 0.5;
	}
	pStatus.upperFlag = true;
	
//	player.posX = (Math.floor(player.posX / chipWid) * chipWid) + (player.img.width / 2)

}


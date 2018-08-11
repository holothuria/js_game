

screenWid = 256;	// screen��
screenHei = 320;	// screen����
chipWid = 32;	// 1�}�X�̕�
chipHei = 32;	// 1�}�X�̍���

crsRowNum = -1;	// �ǂݍ��񂾃R�[�X�̍s��

canvas1  = null;   // ���C���[1
canvas2  = null;   // ���C���[2


timerID = -1;   // �^�C�}�[


// �I�u�W�F�N�g�̒�`
ctx = new ctxMng();
pStatus = new playerStatus();
param = new parameters();

// ��l���̐���
player = new actor();
player.img.file.src = "../img/player.png";

player.posX = 0;
player.posY = 0;
player.vectorX = param.maxRunSpd;
player.vectorY = param.maxRunSpd;




// �n�`�z�u���I�u�W�F�N�g�̐���
blcInf = [
	new terrainBlock(""),
	new terrainBlock("../img/block.png")
];


// �R�[�X�f�[�^�쐬
courseData = [
	[0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 1, 0, 1, 1]
	
];




// �R���e�L�X�g�Ǘ�
function ctxMng(){
	this.blc = null;	// �n�`�z�u��
	this.ple = null;	// ��l��
	
}


// �v���C���[���
function playerStatus(){
	this.remAirJump = 0;
	
	this.isTouchTop = false;
	this.isTouchLeft = false;
	this.isTouchRight = false;
	this.isTouchBottom = false;
	

}


// �ύX����Ȃ��p�����[�^
function parameters(){

	this.maxRunSpd = 5;
	this.runAccel = 0.3;
	
	this.airRes = 0.1;
	
	this.jumpVecX = 5;
	this.jumpVecY = -12;
	this.airJumpVecX = 4.5;
	this.airJumpVecY = -10;
	
}

// �ύX�����L�����N�^�[���
function actor(){
	this.img = new imgInfo();

	this.posX = 0;
	this.posY = 0;

	this.posBfrX = 0;
	this.posBfrY = 0;

	this.vectorX = 0;
	this.vectorY = 0;

}


// �摜���ێ�
function imgInfo(){
	this.file = new Image();
	this.width = 0;
	this.height = 0;

}


// �n�`�u���b�N
function terrainBlock(filePath){
	this.file = new Image();
	this.file.src = filePath;

	
}





// �d��
function gravity(){
	player.vectorY += 0.8;
	
}

// ��R
function airResist(){
	if ((pStatus.isTouchBottom === false) && (pStatus.isTouchLeft === false) && (pStatus.isTouchRight === false)) {
		if (0.1 < player.vectorX) {
			player.vectorX -= param.airRes;
		
		} else if (player.vectorX < -0.1) {
			player.vectorX += param.airRes;
		}
		
	}
	
}

// ���s
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





// �J�n����
function start(){
	
	canvas1 = document.getElementById("layer1");   // �L�����o�X�v�f�̎擾
	ctx.blc = canvas1.getContext("2d");   // �L�����o�X����R���e�L�X�g���擾
	
	canvas2 = document.getElementById("layer2");
	ctx.ple = canvas2.getContext("2d");
	
	
	// �摜�T�C�Y�擾
	player.img.width = player.img.file.naturalWidth;
	player.img.height = player.img.file.naturalHeight;
	
	
	timerID = setInterval('main()',50);
}



// ���C������
function main() {

	gravity();
	airResist();
	running();

	// �L�����������ꏊ�̕`�惊�Z�b�g
	ctx.ple.clearRect(player.posBfrX, player.posBfrY, player.img.width, player.img.height);

	// �`��
	ctx.ple.drawImage(player.img.file, player.posX, player.posY);
	
	courseDrow();
//	ctx.blc.drawImage(blcInf[1].file, 200, 300);

//	var imageData = ctx.ple.getImageData(0, 0, 300, 400);



//	ctx.blc.putImageData(imageData, 0, 0);

//	ctx.blc.beginPath();
//	ctx.blc.moveTo(0, 0);
//	ctx.blc.lineTo(player.posX + 8 , player.posY + 8);
//	ctx.blc.stroke();




	// �ړ��O���W�̕ۑ�
	player.posBfrX = player.posX;
	player.posBfrY = player.posY;

	// ���W�ړ�
	player.posX += player.vectorX;
	player.posY += player.vectorY;

	touchJudge();


}



document.addEventListener("click",clickEvent);


// �N���b�N������
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



// �R�[�X�`��
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



// �ڐG����
function touchJudge(){
	
	
	// ��ʒ[�̔���
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





// �I������
function stop()
{
	clearInterval(timerID);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timerID = -1;
}


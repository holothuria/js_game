canvas1  = null;   // ���C���[1
ctx1     = null;   // �R���e�L�X�g
canvas2  = null;   // ���C���[2
ctx2     = null;   // �R���e�L�X�g


timerID = -1;   // �^�C�}�[


dirConst = new directionConst();


status = new playerStatus();
param = new parameters();

// ��l���̐���
player = new actor();
player.img.file = new Image();
player.img.file.src = "../img/player.png";

player.positionX = 0;
player.positionY = 0;
player.vectorX = param.maxRunSpd;
player.vectorY = param.maxRunSpd;





function playerStatus(){
	this.tchWalDirection = 0;
	this.remAirJump = 0;
	
	this.climbWallFlag = false;

}

function parameters(){

	this.maxRunSpd = 5;
	this.runAccel = 0.3;
	
	this.airResist = 0.1;
	
	this.jumpVecX = 5;
	this.jumpVecY = -12;
	this.airJumpVecX = 3;
	this.airJumpVecY = -10;
	


}


// �L�����N�^�[�̏��I�u�W�F�N�g
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


// �d��
function gravity(){
	player.vectorY += 0.8;
	
}

// ��R
function airResist(){
	if ((status.tchWalDirection === 0) || (status.tchWalDirection === dirConst.TOP)) {
		if (0.1 < player.vectorX) {
			player.vectorX -= airResist;
		
		} else if (player.vectorX < -0.1) {
			player.vectorX += airResist;
		}
		
	}
	
}

// ���s
function running(){

	if ((status.tchWalDirection & dirConst.BOTTOM) !== 0) {
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
	ctx1 = canvas1.getContext("2d");   // �L�����o�X����R���e�L�X�g���擾
	
	canvas2 = document.getElementById("layer2");
	ctx2 = canvas2.getContext("2d");
	
	
	// �摜�T�C�Y�擾
	player.img.width = player.img.file.naturalWidth;
	player.img.height = player.img.file.naturalHeight;
	
	
	timerID = setInterval('draw()',50);
}



// ���C������
function draw() {

	gravity();
	airResist();
	running();

	// �L�����������ꏊ�̕`�惊�Z�b�g
	ctx2.clearRect(player.posBfrX, player.posBfrY, player.img.width, player.img.height);

	// �`��
	ctx2.drawImage(player.img.file, player.positionX, player.positionY);

//	var imageData = ctx2.getImageData(0, 0, 300, 400);



//	ctx1.putImageData(imageData, 0, 0);

//	ctx1.beginPath();
//	ctx1.moveTo(0, 0);
//	ctx1.lineTo(player.positionX + 8 , player.positionY + 8);
//	ctx1.stroke();




	// �ړ��O���W�̕ۑ�
	player.posBfrX = player.positionX;
	player.posBfrY = player.positionY;

	// ���W�ړ�
	player.positionX += player.vectorX;
	player.positionY += player.vectorY;


	status.climbWallFlag = false;

	// ��ʒ[�̔���
	if (player.positionX <= 0) {
		player.positionX = 0;
		status.tchWalDirection |= dirConst.LEFT;
		if ((status.tchwalDirection & dirConst.BOTTOM) !== 0) {
			player.vectorX = 0.1;
			
		} else {
			player.vectorY = 0.5;
			
			status.climbWallFlag = true;
		}
		
	} else {
		status.tchWalDirection &= (15 ^ dirConst.LEFT);
	
	}
	if (player.positionY <= 0) {
		player.positionY = 0;
		status.tchWalDirection |= dirConst.TOP;
		
	} else {
		status.tchWalDirection &= (15 ^ dirConst.TOP);
	
	}
	if ((300 - player.img.width) <= player.positionX) {
		player.positionX = 300 - player.img.width;
		status.tchWalDirection |= dirConst.RIGHT;
		if ((status.tchwalDirection & dirConst.BOTTOM) !== 0) {
			player.vectorX = -0.1;
			
		} else {
			player.vectorY = 0.5;
			status.climbWallFlag = true;
		}
		
	} else {
		status.tchWalDirection &= (15 ^ dirConst.RIGHT);
		
	}
	if ((400 - player.img.height) <= player.positionY) {
		player.positionY = 400 - player.img.height;
		player.vectorY = 0;
		status.tchWalDirection |= dirConst.BOTTOM;
		status.remAirJump = 1;
		
	} else {
		status.tchWalDirection &= (15 ^ dirConst.BOTTOM);
		
	}



}



document.addEventListener("click",clickEvent);


// �N���b�N������
function clickEvent(event){
	
	if ((status.tchWalDirection & dirConst.BOTTOM) !== 0) {
		if (event.pageX < 160) {
			player.vectorX = -param.jumpVecX;
		} else {
			player.vectorX = param.jumpVecX;
		}
		
		player.vectorY = param.jumpVecY;
		
		
	} else if (status.climbWallFlag === true) {
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













// �I������
function stop()
{
	clearInterval(timerID);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	timerID = -1;
}








function directionConst(){
	this.BOTTOM = 1;
	this.LEFT = 2;
	this.RIGET = 4;
	this.TOP = 8;

}
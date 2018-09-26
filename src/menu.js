

let defaultActorText = "";
let defaultStageText = "";



window.onload = function(){

	defaultActorText = document.getElementById("actorText").innerHTML;
	defaultStageText = document.getElementById("stageText").innerHTML;
	
	
	let values = getUrlValues();
	
	pulldownOption = document.getElementById("actorSelector").getElementsByTagName("option");	
	Array.prototype.some.call(pulldownOption, function(pullOpt){
		if (pullOpt.value === values[0]){
			pullOpt.selected = true;
			return true;
		}
		actorTextAlter(values[0]);
		
	});
	
	pulldownOption = document.getElementById("stageSelector").getElementsByTagName("option");
	Array.prototype.some.call(pulldownOption, function(pullOpt){
		if (pullOpt.value === values[1]){
			pullOpt.selected = true;
			return true;
		}
		stageTextAlter(values[1]);
		
	});
	
	document.menuForm.nameInputer.value = values[2];
	
	
	document.getElementById("actorSelector").addEventListener("change", function(){
		let text = "";
		let selectNum = document.menuForm.actor.selectedIndex;
		let selectValue = document.menuForm.actor.options[selectNum].value;
		
		actorTextAlter(selectValue);
		

	});
	
	document.getElementById("stageSelector").addEventListener("change", function(){
		let text = "";
		let selectNum = document.menuForm.stage.selectedIndex;
		let selectValue = document.menuForm.stage.options[selectNum].value;
		
		stageTextAlter(selectValue);
		
		
	
	});

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



// 説明文変更メソッド
function actorTextAlter(selectValue){
	switch(selectValue){
		case "lepusGirl":
			text = "重力の影響が少ない幼女<br>全体的にゆったりとしているけれど、移動速度もゆっくり";
			break;
		
		default:
			text = defaultActorText;
			break;
		
	}
	
	
	
	document.getElementById("actorText").innerHTML = text;
	
}

function stageTextAlter(selectValue){
	switch(selectValue) {
		case "deathAndStage":
			text = "危険に満ちたステージ。すぐやられます";
			break;
		default:
			text = defaultStageText;
	
	}
	
	document.getElementById("stageText").innerHTML = text;
	
	
}

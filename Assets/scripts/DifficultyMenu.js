private var screen6th : float;
private var buttonHeight : float;
public static var selectedDifficulty : float;
	
function Awake() {
	screen6th = Screen.width/6;
	buttonHeight = Screen.height/7;
}

function OnGUI() {
	GUI.skin.button.fontSize = 16 * GameUtils.DpiDifference();
	if(GUI.Button(new Rect(screen6th, buttonHeight*1, screen6th*4, buttonHeight), "Rolling in Cash\n1.2x Shop Earnings")) {
		selectedDifficulty = 1.2;
		Application.LoadLevel("Level1");
	}
	
	if(GUI.Button(new Rect(screen6th, buttonHeight*2+10, screen6th*4, buttonHeight), "Less money, more problems\n1x Shop Earnings")) {
		selectedDifficulty = 1;
		Application.LoadLevel("Level1");
	}
	
	if(GUI.Button(new Rect(screen6th, buttonHeight*3+20, screen6th*4, buttonHeight), "Money really matters\n0.8x Shop Earnings")) {
		selectedDifficulty = 0.8;
		Application.LoadLevel("Level1");
	}
	
	if(GUI.Button(new Rect(screen6th, buttonHeight*5, screen6th*4, buttonHeight), "Back")) {
		Application.LoadLevel("Menu");
	}
}
#pragma strict
private var screenQuater : float;
private var buttonHeight : float;
var title : GUITexture;	
	
function Awake() {
	screenQuater = Screen.width/4;
	buttonHeight = Screen.height/7;
	
	title.pixelInset.width = screenQuater*2;
	title.pixelInset.height = screenQuater*2;
	title.pixelInset.x = -screenQuater;
	title.pixelInset.y = -screenQuater*2;
}

function OnGUI() {
	GUI.skin.button.fontSize = 16 * GameUtils.DpiDifference();
	if(GUI.Button(new Rect(screenQuater, buttonHeight*3, screenQuater*2, buttonHeight), "New Game")) {
		Application.LoadLevel("DifficultySetting");
	}
	
	if(GUI.Button(new Rect(screenQuater, buttonHeight*4+10, screenQuater*2, buttonHeight), "Instructions")) {
		Application.LoadLevel("Instructions");
	}
	
	if(GUI.Button(new Rect(screenQuater, buttonHeight*5+20, screenQuater*2, buttonHeight), "Quit")) {
		Application.Quit();
	}
}
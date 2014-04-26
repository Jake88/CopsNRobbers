#pragma strict

var icon : GUITexture;
var label : GUIText;
var button : GUITexture;

function Awake() {
	var diff : float = LevelMaster.Get().DpiDifference();
	icon.pixelInset.width *= diff;
	icon.pixelInset.height *= diff;
	icon.pixelInset.x *= diff;
	icon.pixelInset.y *= diff;
	
	label.pixelOffset.x *= diff;
	label.pixelOffset.y *= diff;
	
	button.pixelInset.width *= diff;
	button.pixelInset.height *= diff;
	button.pixelInset.x *= diff;
	button.pixelInset.y *= diff;
}

function SetPixelInset(pixelInset : Rect) {
	button.pixelInset = pixelInset;
	// Set the button icon position.
	icon.pixelInset.x = (pixelInset.x + pixelInset.width/2 - icon.pixelInset.width/2);
	// Set the button label position.
	label.pixelOffset.x = pixelInset.x + pixelInset.width/2;
}

function GetPixelInset() : Rect {
	return button.pixelInset;
}
#pragma strict

var icon : GUITexture;
var label : GUIText;
var button : GUITexture;

function Awake() {
	var diff : float = GameUtils.DpiDifference();
	icon.pixelInset.width *= diff;
	icon.pixelInset.height *= diff;
	icon.pixelInset.y *= diff;
	
	button.pixelInset.height *= diff;
	button.pixelInset.y *= diff;
	
	label.fontSize *= diff;
	label.pixelOffset.y *= diff;
}

function SetPixelInset(pixelInset : Rect) {
	button.pixelInset = pixelInset;
	// Set the button icon position.
	icon.pixelInset.x = pixelInset.x + pixelInset.width/2 - icon.pixelInset.width/2;
	
	// Set the button label position.
	label.pixelOffset.x = pixelInset.x + pixelInset.width/2;
}

function GetPixelInset() : Rect {
	return button.pixelInset;
}

function AlterButtonWidthByDpi() {
	var diff : float = GameUtils.DpiDifference();
	icon.pixelInset.x *= diff;
	label.pixelOffset.x *= diff;
	button.pixelInset.width *= diff;
	button.pixelInset.x *= diff;
}

function ChangeAlpha(val : float) {
	icon.color.a = val;
	label.color.a = val;
}

function ChangeLabel(text : String) {
	label.text = text;
}
#pragma strict

private static var LIGHT_GREEN : Color = new Color(0, 1.0, 0.25, 1.0);
private static var DARK_GREEN : Color = new Color(0, 0.627, 0.196, 0.5);
private static var DARK_RED : Color = new Color(0.627, 0, 0.25, 0.5);
private static var LIGHT_RED : Color = new Color(1, 0, 0.25, 1.0);

var _nextTileToBank : Tile;
var _nextTileToExit : Tile;
var _occupied : boolean;
var _occupiedUnit : GameObject;
var _isAvailable : boolean;
var _x : int;
var _y : int;
var _distance : int;
private var _overlaySR : SpriteRenderer;

function Awake () {
	var tileOverlay : Transform = this.transform.FindChild("TileOverlay");
	if(tileOverlay) {
		_overlaySR = tileOverlay.GetComponent("SpriteRenderer") as SpriteRenderer;
		_overlaySR.renderer.enabled = false;
	}
}

function Update () {
}

function SetAvailability(available : boolean) {
	if (available) {
		_isAvailable = true;
		_overlaySR.color = DARK_GREEN;
	} else {
		_isAvailable = false;
		_overlaySR.color = DARK_RED;
	}
}

function Highlight(valid : boolean) {
	if (valid) {
		_overlaySR.color = LIGHT_GREEN;
	} else {
		_overlaySR.color = LIGHT_RED;
	}
}

function Unhighlight() {
	if (_isAvailable) {
		_overlaySR.color = DARK_GREEN;
	} else {
		_overlaySR.color = DARK_RED;
	}
}

function ShowOverlay() {
	if(_overlaySR) {
		_overlaySR.renderer.enabled = true;
	}
}

function HideOverlay() {
	if(_overlaySR) {
		_overlaySR.renderer.enabled = false;
	}
}
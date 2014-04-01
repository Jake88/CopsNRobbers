#pragma strict

private static var LIGHT_GREEN : Color = new Color(0, 1.0, 0.25, 1.0);
private static var DARK_GREEN : Color = new Color(0, 0.627, 0.196, 1.0);
private static var RED : Color = new Color(1.0, 0.25, 0.25, 1.0);

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
	}
}

function Update () {
}

function SetAvailability(available : boolean) {
	if (available) {
		_isAvailable = true;
		_overlaySR.color = GREEN;
	} else {
		_isAvailable = false;
		_overlaySR.color = RED;
	}
}
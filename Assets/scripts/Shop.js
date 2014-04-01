#pragma strict

var _tiles : Tile[];
var _name : String;
var _cost : int;
var _padydayEarnings : int;
var _paydayCooldown : float;

function Start () {

}

function Update () {

}

function Init(tiles : Tile[]) {
	var vecs : Vector3[] = new Vector3[tiles.length];
	tiles = GameUtils.ShuffleArray(tiles);
	for (var i = 0; i < tiles.length; i++) {
		var shopTile : Transform = transform.GetChild(i);
		shopTile.position.x = tiles[i]._x;
		shopTile.position.y = tiles[i]._y;
		vecs[i] = shopTile.position;
	}
	//transform.position = GameUtils.CenterPointBetweenManyVectors(vecs);
}

function Sell() {
	// Give player the money.
	for (var tile : Tile in _tiles) {
		tile._occupied = false;
		tile._occupiedUnit = null;
	}
}
#pragma strict

var _curTileIndex : int;
var _curTile : Tile;
var _moveSpeed : float;

function Start () {
	_curTileIndex = 0;
	_curTile = LevelMaster.Get()._path[_curTileIndex];
   	transform.rotation = Quaternion.LookRotation(Vector3.forward, _curTile.transform.position - transform.position);
}

function Update () {
	transform.Translate(Vector3.up * Time.deltaTime);
	
	if ((transform.position - _curTile.transform.position).magnitude < 0.1) {
		Debug.Log("Testing");
		_curTileIndex++;
		_curTile = LevelMaster.Get()._path[_curTileIndex];
		transform.rotation = Quaternion.LookRotation(Vector3.forward, _curTile.transform.position - transform.position);

	}
}
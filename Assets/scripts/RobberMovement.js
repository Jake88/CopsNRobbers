#pragma strict

var _curTileIndex : int;
var _curTile : Tile;
var _moveSpeed : float;
var _robber : Robber;

function Start () {
	_robber = this.GetComponent("Robber");
	_curTile = LevelMaster.Get()._startTile;
   	transform.rotation = Quaternion.LookRotation(Vector3.forward, _curTile.transform.position - transform.position);
}

function Update () {
	transform.Translate(Vector3.up * Time.deltaTime);
	
	if ((transform.position - _curTile.transform.position).magnitude < 0.05) {
		transform.position = _curTile.transform.position;
		if (_robber._returning) {
			_curTile = _curTile._nextTileToExit;
		} else {
			_curTile = _curTile._nextTileToBank;
			if (_curTile == LevelMaster.Get()._endTile) {
				_robber._returning = true;
			}
		}
		transform.rotation = Quaternion.LookRotation(Vector3.forward, _curTile.transform.position - transform.position);

	}
}
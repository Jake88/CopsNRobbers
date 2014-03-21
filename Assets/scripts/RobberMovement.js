#pragma strict

private var _curTileIndex : int;
private var _curTile : Tile;
var _moveSpeed : float;
private var _robber : Robber;
var _returningSprite : Sprite;

function Start () {
	_robber = this.GetComponent("Robber") as Robber;
	_curTile = LevelMaster.Get()._startTile;
   	transform.rotation = Quaternion.LookRotation(Vector3.forward, _curTile.transform.position - transform.position);
}

function Update () {
	transform.Translate(Vector3.up * Time.deltaTime);
	if ((transform.position - _curTile.transform.position).magnitude < 0.05) {
		//Check if we should change to returning
		if (_curTile == LevelMaster.Get()._endTile) {
			_robber._returning = true;
			var sr : SpriteRenderer = GetComponent("SpriteRenderer") as SpriteRenderer;
			sr.sprite = _returningSprite;
		}
	
		transform.position = _curTile.transform.position;
		if (_robber._returning) {
			_curTile = _curTile._nextTileToExit;
		} else {
			_curTile = _curTile._nextTileToBank;
		}
		transform.rotation = Quaternion.LookRotation(Vector3.forward, _curTile.transform.position - transform.position);

	}
}
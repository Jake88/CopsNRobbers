#pragma strict

private var _curTileIndex : int;
private var _curTile : Tile;
var _moveSpeed : float;
private var _distanceTraveled : float;
private var _previousTile : Vector3;
private var _robber : Robber;
var _returningSprite : Sprite;

function Start () {
	_robber = this.GetComponent("Robber") as Robber;
	_curTile = LevelMaster.Get().GetStartTile()._nextTileToBank;
	_previousTile = LevelMaster.Get().GetStartTile().transform.position;
   	transform.rotation = Quaternion.LookRotation(Vector3.forward, _curTile.transform.position - transform.position);
}

function Update () {
	//transform.Translate(Vector3.up * Time.deltaTime);
	_distanceTraveled += Time.deltaTime *_moveSpeed;
	transform.position = Vector3.Lerp(_previousTile, _curTile.transform.position, _distanceTraveled);
	if (_distanceTraveled > 1) {
		//Check if we should change to returning
		if (_curTile == LevelMaster.Get().GetEndTile()) {
			_robber._returning = true;
			MoneyManager.Get().StealMoney(_robber._stealAmount);
			var sr : SpriteRenderer = GetComponent("SpriteRenderer") as SpriteRenderer;
			sr.sprite = _returningSprite;
		} else if (_robber._returning && _curTile == LevelMaster.Get().GetStartTile()) {
			_robber.Escape();
			return;
		}
	
		_previousTile = _curTile.transform.position;
		transform.position = _curTile.transform.position;
		if (_robber._returning) {
			_curTile = _curTile._nextTileToExit;
		} else {
			_curTile = _curTile._nextTileToBank;
		}
		transform.rotation = Quaternion.LookRotation(Vector3.forward, _curTile.transform.position - transform.position);
		_distanceTraveled = 0;
	}
}
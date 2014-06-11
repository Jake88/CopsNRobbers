#pragma strict

private var _nextTile : Tile;
private var _robber : Robber;
private var _slowed : boolean;
private var _moveSpeed : float;
var _baseMoveSpeed : float;
var _returningSprite : Sprite;

function Start () {
	_robber = this.GetComponent("Robber") as Robber;
	_slowed = false;
	_moveSpeed = _baseMoveSpeed;
	_nextTile = LevelMaster.Get().GetStartTile()._nextTileToBank;
	transform.position = LevelMaster.Get().GetStartTile().transform.position;
   	transform.rotation = Quaternion.LookRotation(Vector3.forward, _nextTile.transform.position - transform.position);

	MoveToPositionRecursive();
}

function MoveToPositionRecursive() : IEnumerator 
{
    var distanceTraveled : float = 0;
    var startingPos : Vector3 = transform.position;
    while (distanceTraveled < 1)
    {
        transform.position = Vector3.Lerp(startingPos, _nextTile.transform.position, distanceTraveled);
        _robber._healthBar.UpdatePosition();
        distanceTraveled += Time.deltaTime *_moveSpeed;
        yield;
    }
    
    // Set our position to the exact position of the reached tile.
   	transform.position = _nextTile.transform.position;
    
    //Check if we should change to returning, or if we have escaped the mall
	if (_nextTile == LevelMaster.Get().GetEndTile()) {
		StartReturning();
	} else if (_nextTile == LevelMaster.Get().GetStartTile()) {
		_robber.Escape();
		return;
	}
	
	// Check which tile we need to move to next.
	if (_robber._returning) {
		_nextTile = _nextTile._nextTileToExit;
	} else {
		_nextTile = _nextTile._nextTileToBank;
	}
	
	// Rotate to face that tile.
	transform.rotation = Quaternion.LookRotation(Vector3.forward, _nextTile.transform.position - transform.position);

	this.MoveToPositionRecursive();
}

function Slow() {
	if(!_slowed) {
		_slowed = true;
		_moveSpeed *= 0.5;
	}
}

function Stun() {
	CancelInvoke("Unstun");
	_moveSpeed = 0;
	Invoke("Unstun", 1);
}

function Unstun() {
	_moveSpeed = _baseMoveSpeed;
}

function StartReturning() {
	_robber._returning = true;
	MoneyManager.Get().StealMoney(_robber._stealAmount);
	var sr : SpriteRenderer = GetComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = _returningSprite;
}
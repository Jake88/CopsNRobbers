#pragma strict

var _curHP : float;
var _maxHP : float;
var _stealAmount : int;
var _bountyValue : int;
var _returning : boolean = false;
var _dead : boolean = false;

private var _healthBar : Health;
private var _curTile : Tile;

function Start () {
	_curHP = _maxHP;
	_healthBar = transform.FindChild("hp-foreground").GetComponent("Health") as Health;
	this.transform.position = LevelMaster.Get()._startTile.transform.position;
}

function Update () {
	if (_dead) {
		GameObject.Destroy(this.gameObject);
	} else {
		_healthBar.UpdateLength(_maxHP, _curHP);
	}
}

function TakeDamage(damage:float) : boolean {
	_curHP -= damage;
	if (_curHP <= 0) {
		Die();
		return true;
	}
	return false;
}

function Die() {
	// Give player bounty money
	// Drop stolen money if this robber was returning
	this.Destroy();
}

function Escape() {
	this.Destroy();
}

function Destroy() {
	this.transform.position = new Vector3(-100,-100,0);
	_dead = true;
}
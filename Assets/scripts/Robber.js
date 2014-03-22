#pragma strict

var _curHP : float;
var _maxHP : float;
var _stealAmount : int;
var _bountyValue : int;
var _returning : boolean = false;

private var _healthBar : Health;
private var _curTile : Tile;

function Start () {
	_curHP = _maxHP;
	_healthBar = transform.FindChild("hp-foreground").GetComponent("Health") as Health;
	this.transform.position = LevelMaster.Get()._startTile.transform.position;
}

function Update () {
	_healthBar.UpdateLength(_maxHP, _curHP);
	
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
	GameObject.Destroy(this.gameObject);
}

function Escape() {
	GameObject.Destroy(this.gameObject);
}
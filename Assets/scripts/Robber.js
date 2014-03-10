#pragma strict

var _curHP : float;
var _maxHP : float;
var _speed : float;
var _stealAmount : int;
var _bountyValue : int;
var _returning : boolean;

private var _healthBar : Health;
private var _curTile : Tile;

function Start () {
	transform.position = GameObject.FindGameObjectWithTag("StartTile").transform.position;
	_curHP = _maxHP;
	_healthBar = transform.FindChild("hp-foreground").GetComponent("Health");
}

function Update () {
	transform.position.y += _speed * Time.deltaTime;	
	_healthBar.UpdateLength(_maxHP, _curHP);
	
}

function TakeDamage(damage:float) {
	Debug.Log("Taking Damage");
	_curHP -= damage;
	if (_curHP <= 0) {
		//die();
		return true;
	}
}
#pragma strict

var _curHP : float;
var _maxHP : float;
var _speed : float;
var _stealAmount : int;
var _bountyValue : int;

private var _healthBar : Health;

function Start () {
	_curHP = _maxHP;
	_healthBar = transform.FindChild("hp-foreground").GetComponent("Health");
}

function Update () {
	transform.position.y += _speed * Time.deltaTime;	
	_healthBar.UpdateLength(_maxHP, _curHP);
}

function TakeDamage(damage:float) {
	_curHP -= damage;
	if (_curHP <= 0) {
		//die();
		return true;
	}
}
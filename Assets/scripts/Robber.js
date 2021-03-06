﻿#pragma strict

var _curHP : float;
var _maxHP : float;
var _stealAmount : int;
var _bountyValue : int;
var _returning : boolean = false;
var _healthBar : Health;
var _sneaky : boolean;

private var _movement : RobberMovement;
private var _curTile : Tile;

function Start () {
	_curHP = _maxHP;
	_healthBar = transform.FindChild("hp-foreground").GetComponent("Health") as Health;
	this.transform.position = LevelMaster.Get().GetStartTile().transform.position;
	_movement = GetComponent("RobberMovement") as RobberMovement;
}

function TakeDamage(damage:float) : boolean {
	if(_sneaky) {
		_sneaky = false;
		var sr : SpriteRenderer = transform.GetComponent("SpriteRenderer") as SpriteRenderer;
		sr.color = Color.white;
	}
	_curHP -= damage;
	if (_curHP <= 0) {
		Die();
		return true;
	}
	_healthBar.UpdateLength(_maxHP, _curHP);
	return false;
}

function Slow() {
	_movement.Slow();
}

function Stun() {
	_movement.Stun();
}

function Die() {
	// Give player bounty money
	MoneyManager.Get().AddMoney(_bountyValue);
	// Drop stolen money if this robber was returning
	if(_returning) {
		var go : GameObject = Instantiate(Resources.Load("CashWad")) as GameObject;
		var cash : CashWad = go.GetComponent("CashWad") as CashWad;
		cash.Init(_stealAmount, (new Vector3(0, 0, -1) + this.transform.position));
	}
	// Kill this object
	this.Destroy();
}

function Escape() {
	this.Destroy();
}

function Destroy() {
	this.transform.position = new Vector3(-100,-100,0);
	GameObject.Destroy(this.gameObject);
}
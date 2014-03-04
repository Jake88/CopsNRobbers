#pragma strict

var _curHP : float;
var _maxHP : float;
var _speed : float;
var _stealAmount : int;
var _bountyValue : int;

function Start () {

}

function Update () {
	transform.position.y += _speed * Time.deltaTime; 
}
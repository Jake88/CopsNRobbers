#pragma strict

var _offset : Vector3;
private var _target : Transform;

function Start () {
	_target = transform.parent;
}

function Update () {
	
	 var wantedPos = Camera.main.WorldToViewportPoint (_target.position + _offset); 
    transform.position = wantedPos;
}
#pragma strict

private var _value : int;
private static var scaleSpeed : int = 1;
private static var scaleMax : float = 0.8;


function Init(val : int, pos : Vector3) {
	transform.position = pos;
	_value = val;
	Grow();
}

function Grow() {
	while(transform.localScale.x < scaleMax) {
		this.transform.localScale.x += (scaleSpeed * Time.deltaTime);
		this.transform.localScale.y += (scaleSpeed * Time.deltaTime);
		yield;
	}
}

function Collect() {
	MoneyManager.Get().AddMoney(_value);
	GameObject.Destroy(this.gameObject);
}
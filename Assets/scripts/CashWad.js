#pragma strict

private var _value : int;
private static var scaleSpeed : int = 1;
private static var scaleMax : float = 0.8;


function Init(val : int, pos : Vector3) {
	Debug.Log("Initing");
	transform.position = pos;
	_value = val;
}

function Update () {
	if(transform.localScale.x < scaleMax) {
		this.transform.localScale.x += (scaleSpeed * Time.deltaTime);
		this.transform.localScale.y += (scaleSpeed * Time.deltaTime);
	}
}

function Collect() {
	MoneyManager.Get().AddMoney(_value);
	GameObject.Destroy(this.gameObject);
}
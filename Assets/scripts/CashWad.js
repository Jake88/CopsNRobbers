#pragma strict

private var _value : int;
private static var scaleSpeed : int = 1;
private static var variedPosRange : float = 1;
private static var scaleMax : float = 0.8;
private static var timeTillFade : float = 3;
private var sr : SpriteRenderer;


function Init(val : int, pos : Vector3) {
	pos += Vector3(Random.Range(-variedPosRange, variedPosRange), Random.Range(-variedPosRange, variedPosRange), 0);
	transform.position = pos;
	_value = val;
	sr = GetComponent("SpriteRenderer") as SpriteRenderer;
	sr.color.a = 1;
	Grow();
	Invoke("StartFading", timeTillFade);
}

function Grow() {
	while(transform.localScale.x < scaleMax) {
		this.transform.localScale.x += (scaleSpeed * Time.deltaTime);
		this.transform.localScale.y += (scaleSpeed * Time.deltaTime);
		yield;
	}
}

function StartFading() {
	Fade();
}

function Fade() {
	while (sr.color.a > 0) {
		sr.color.a -= 0.05;
		yield(WaitForSeconds(0.1));
	}
	GameObject.Destroy(this.gameObject);
}

function Collect() {
	MoneyManager.Get().AddMoney(_value);
	CancelInvoke("StartFading");
	GameObject.Destroy(this.gameObject);
}
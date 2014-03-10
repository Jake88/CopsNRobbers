#pragma strict

private var _background : GUITexture;
private var _healthBar : GUITexture;
private var _maxLength : float;
private var _currentLength : float;

function Start () {
	_background = transform.parent.FindChild("hp-background").GetComponent(GUITexture);
	_healthBar = transform.GetComponent(GUITexture);
	_maxLength = _healthBar.pixelInset.width;
}

function UpdateLength (maxHP : float, curHP : float) {
	if (curHP == maxHP) {
		_background.enabled = false;
		_healthBar.enabled = false;
	} else {
		_background.enabled = true;
		_healthBar.enabled = true;
		var ratio = curHP / maxHP;
	 	_currentLength = ratio * _maxLength;
	}
}

function Update() {
	_healthBar.pixelInset.width = _currentLength;
}
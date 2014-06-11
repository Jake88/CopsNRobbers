#pragma strict

private var _background : GUITexture;
private var _healthBar : GUITexture;
private var _maxLength : float;
private var _currentLength : float;
var _offset : Vector3;

function Awake() {
	_background = transform.parent.FindChild("hp-background").GetComponent(GUITexture);
	_healthBar = transform.GetComponent(GUITexture);
}

function Start () {
	_maxLength = _healthBar.pixelInset.width;
	_background.enabled = false;
	_healthBar.enabled = false;
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
	 	_healthBar.pixelInset.width = _currentLength;
	}
}

function UpdatePosition() {
	if(Camera.main != null) {
		var wantedPos = Camera.main.WorldToViewportPoint (transform.parent.transform.position + _offset); 
	    _background.transform.position = _healthBar.transform.position = wantedPos;
	    _background.transform.position.z = 0;
	    _healthBar.transform.position.z = 1.0;
    }
}
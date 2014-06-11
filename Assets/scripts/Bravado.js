#pragma strict

private var _active : boolean;
private var _thisRobber : Robber;
private var _additionalHP : float;

function Start () {
	_active = false;
	_thisRobber = GetComponent("Robber") as Robber;
	_additionalHP = _thisRobber._maxHP * .2;
	InvokeRepeating("BravadoCheck", 0, .2);
}

private function BravadoCheck() {
	var mates : Bravado[] = GameObject.FindObjectsOfType(typeof(Bravado)) as Bravado[];
	for (var i = 0; i < mates.length; i++) {
		if (this != mates[i]) {
			if((this.transform.position - mates[i].transform.position).magnitude < 1) {
				if(!_active) {
					_thisRobber._maxHP += _additionalHP;
					_thisRobber._curHP += _additionalHP;
					this.transform.localScale.x *= 1.2;
					this.transform.localScale.y *= 1.2;
					_active = true;
				}
				return;
			}
		}
	}
	
	if(_active) {
		_thisRobber._curHP -= _additionalHP;
		_thisRobber._maxHP -= _additionalHP;
		this.transform.localScale.x /= 1.2;
		this.transform.localScale.y /= 1.2;
		_active = false;
	}
	_active = false;
}
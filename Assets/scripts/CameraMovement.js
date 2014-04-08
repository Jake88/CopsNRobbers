#pragma strict
 
private var _dragOrigin: Vector3;
private var _velocity : float = 0;
private var _touchDevice : boolean;
private var pos : Vector3;
var _maxVelocity : float;

function Start() {
	if(Input.mousePresent) {
		_touchDevice = false;
	} else {
		_touchDevice = true;
	}
}

function Update() {
	if(_touchDevice) {
		if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved) {
		    pos = Input.GetTouch(0).deltaPosition;
		    IncreaseVelocity();
		} else {
			DecreaseVelocity();
		}
	} else {
		if (Input.GetMouseButtonDown(0)){
			_dragOrigin = Input.mousePosition;
		    return;
	    }
	    if (Input.GetMouseButton(0)) {
			IncreaseVelocity();
			pos = Camera.main.ScreenToViewportPoint(Input.mousePosition - _dragOrigin);
		} else {
			DecreaseVelocity();
		}
	}
	
	if (_velocity > 0) {
		transform.Translate(-pos.x * _velocity, -pos.y * _velocity, 0); 
	}
}

private function IncreaseVelocity() {
	_velocity += Time.deltaTime;
	if (_velocity > _maxVelocity) {
		_velocity = _maxVelocity;
	}
}

private function DecreaseVelocity() {
	_velocity -= Time.deltaTime;
	if (_velocity < 0) {
		_velocity = 0;
	}
}
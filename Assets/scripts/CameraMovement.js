#pragma strict
 
private var _isTouchDevice : boolean;

private var _dragOrigin: Vector3;
private var deltaPos : Vector3;
private var _velocity : float = 0;
var _maxVelocity : float;

private var _minOrthographicSize : float = 2.5;
private var _maxOrthographicSize : float;

function Start() {
	var _mallAspectRatio : float;
	// Set the position of the camera to the center of the mall.
	transform.position = new Vector3(LevelMaster.Get()._mallWidth/2-0.5, LevelMaster.Get()._mallHeight/2-0.5, -10);
	// Get the mall aspect ratio.
	_mallAspectRatio = LevelMaster.Get()._mallWidth / LevelMaster.Get()._mallHeight;
	
	// Set the camera to lock to North / South walls.
	Camera.main.orthographicSize = _maxOrthographicSize = LevelMaster.Get()._mallHeight/2;
	
	// Check if we should be locking to East / West walls instead.
	if (_mallAspectRatio < Camera.main.aspect) {
		Camera.main.orthographicSize = _maxOrthographicSize = _maxOrthographicSize * (_mallAspectRatio / Camera.main.aspect);
	}
	
	if (_minOrthographicSize > _maxOrthographicSize) {
		_minOrthographicSize = _maxOrthographicSize;
	} 
	
	if(Input.mousePresent) {
		_isTouchDevice = false;
	} else {
		_isTouchDevice = true;
	}
}

function Update() {
	if(_isTouchDevice) {
		// Handle camera movement for touch devices.
		if (Input.touchCount == 1 && Input.GetTouch(0).phase == TouchPhase.Moved) {
		    deltaPos = Input.GetTouch(0).deltaPosition;
		    IncreaseVelocity();
		} else {
			DecreaseVelocity();
		}
		// Handle camera zoom for touch devices.
		if (Input.touchCount == 2 && Input.GetTouch(0).phase == TouchPhase.Moved && Input.GetTouch(1).phase == TouchPhase.Moved) {
			var curDist : Vector2 = Input.GetTouch(0).position - Input.GetTouch(1).position;
			var prevDist : Vector2 = ((Input.GetTouch(0).position - Input.GetTouch(0).deltaPosition) - (Input.GetTouch(1).position - Input.GetTouch(1).deltaPosition));
			var touchDelta : float = curDist.magnitude - prevDist.magnitude;
			//TODO Test that this is the right positive / negative numbers. May need to inverse touchDelta *-1
			Zoom(touchDelta);
		}
	} else {
		// Handle camera movement for mouse.
		if (Input.GetMouseButtonDown(0)){
			_dragOrigin = Input.mousePosition;
		    return;
	    }
	    if (Input.GetMouseButton(0)) {
			IncreaseVelocity();
			deltaPos = Camera.main.ScreenToViewportPoint(Input.mousePosition - _dragOrigin);
		} else {
			DecreaseVelocity();
		}
	}
	
	// Handle movement.
	if (_velocity > 0) {
		var newX : float = (-deltaPos.x * _velocity);
		if(!ValidateX(newX)) {
			newX = 0;
		}
		var newY : float = (-deltaPos.y * _velocity);
		if(!ValidateY(newY)) {
			newY = 0;
		}
		transform.Translate(newX, newY, 0);
	}
}

function OnGUI() {
	if (Event.current.type == EventType.ScrollWheel) {
		Zoom(Event.current.delta.y);
	}
}

private function ValidateX(x : float) : boolean {
	var isValidMovement = true;
	x += transform.position.x;
	var maxCameraX = LevelMaster.Get()._mallWidth - (Camera.main.orthographicSize * Camera.main.aspect) -0.5;
	var minCameraX = 0 + (Camera.main.orthographicSize * Camera.main.aspect) -0.5;
	
	if (x > maxCameraX) {
		isValidMovement = false;
		transform.position.x = maxCameraX;
	} else if (x < minCameraX){
		isValidMovement = false;
		transform.position.x = minCameraX;
	}
	
	return isValidMovement;
}

private function ValidateY(y : float) : boolean {
	var isValidMovement = true;
	y += transform.position.y;
	
	// Height of the top GUI bar.
	var guiTopWorldPoint : Vector3 = Camera.main.ScreenToWorldPoint(Vector3(0, TopBarHandler.Get().GetHeight(), 0));
	var	guiBottomWorldPoint : Vector3 = Camera.main.ScreenToWorldPoint(Vector3.zero);
	var guiHeightInWorld : float = (guiTopWorldPoint - guiBottomWorldPoint).magnitude;
	
	var maxCameraY = (LevelMaster.Get()._mallHeight+guiHeightInWorld) - Camera.main.orthographicSize -0.5;
	
	//Height of the bottom GUI buttons
	guiTopWorldPoint = Camera.main.ScreenToWorldPoint(Vector3(0, BuildManager.Get().GetButtonHeight(), 0));
	guiBottomWorldPoint = Camera.main.ScreenToWorldPoint(Vector3.zero);
	guiHeightInWorld = (guiTopWorldPoint - guiBottomWorldPoint).magnitude;
	
	var minCameraY = (0-guiHeightInWorld) + Camera.main.orthographicSize -0.5;

	
	if (y > maxCameraY){
		isValidMovement = false;
		transform.position.y = maxCameraY;
	} else if (y < minCameraY){
		isValidMovement = false;
		transform.position.y = minCameraY;
	}
	
	return isValidMovement;
}

private function Zoom(val : float) {
	if(val > 0) {
		Camera.main.orthographicSize += Time.deltaTime*2;
		if (Camera.main.orthographicSize > _maxOrthographicSize) {
			Camera.main.orthographicSize = _maxOrthographicSize;
		}
		ValidateX(0);
		ValidateY(0);
	} else if (val < 0) {
		Camera.main.orthographicSize -= Time.deltaTime*2;
		if (Camera.main.orthographicSize < _minOrthographicSize) {
			Camera.main.orthographicSize = _minOrthographicSize;
		}
	}
}

private function IncreaseVelocity() {
	_velocity += Time.deltaTime*2;
	if (_velocity > _maxVelocity) {
		_velocity = _maxVelocity;
	}
}

private function DecreaseVelocity() {
	var amt : float = Time.deltaTime != 0 ? Time.deltaTime : 0.05;
	_velocity -= amt;
	if (_velocity < 0) {
		_velocity = 0;
	}
}
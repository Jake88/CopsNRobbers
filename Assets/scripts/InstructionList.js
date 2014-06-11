#pragma strict
private var _isTouchDevice : boolean;
private var _startPos : Vector3;
private var _listStartPos : float;
private var _numberOfPages : int;
private var _curPos : int;
var _selectedColor : Color;
var _defaultColor : Color;
var _dots : GUITexture[];

function Start () {
	_curPos = 0;
	_startPos = Vector3.zero;
	if(Input.mousePresent) {
		_isTouchDevice = false;
	} else {
		_isTouchDevice = true;
	}
	
	_numberOfPages = this.transform.childCount;
	
	var myGuiTexts : GUIText[] = GameObject.FindObjectsOfType(typeof(GUIText)) as GUIText[];
    for (var guiText:GUIText in myGuiTexts) {
        guiText.fontSize = 16 * GameUtils.DpiDifference();
    }
    
    var myGuiTextures : GUITexture[] = GameObject.FindObjectsOfType(typeof(GUITexture)) as GUITexture[];
    for (var guiTexture:GUITexture in myGuiTextures) {
        Debug.Log( guiTexture.name );
        guiTexture.pixelInset.width *= GameUtils.DpiDifference();
		guiTexture.pixelInset.height *= GameUtils.DpiDifference();
		guiTexture.pixelInset.x *= GameUtils.DpiDifference();
		guiTexture.pixelInset.y *= GameUtils.DpiDifference();
    }
}

function OnGUI() {
	GUI.skin.button.fontSize = 20 * GameUtils.DpiDifference();
	if(GUI.Button(new Rect(Screen.width-110, 10, 100, 50), "X")) {
		Application.LoadLevel("Menu");
	}
}

function Update () {
	var deltaPos : Vector3;
	if(_isTouchDevice) {
		// Handle camera movement for touch devices.
		if (Input.touchCount == 1) {
			if (_startPos == Vector3.zero) {
				_startPos = Input.GetTouch(0).position;
				_listStartPos = transform.position.x;
			}
		    deltaPos = Camera.main.ScreenToViewportPoint(Input.GetTouch(0).position - _startPos);
		} else if (Input.GetTouch(0).phase == TouchPhase.Ended){
			Swipe(Input.GetTouch(0).position);
		}
	} else {
		// Handle camera movement for mouse.
		if (Input.GetMouseButtonDown(0)){
			_startPos = Input.mousePosition;
			_listStartPos = transform.position.x;
		    return;
	    } else if(Input.GetMouseButtonUp(0)) {
	    	Swipe(Input.mousePosition);
	    }
	    if (Input.GetMouseButton(0)) {
			deltaPos = Camera.main.ScreenToViewportPoint(Input.mousePosition - _startPos);
		}
	}
	
	var newX : float = deltaPos.x * Time.deltaTime*3;
	var pos : float = transform.position.x;
	if (pos > _listStartPos-.9 && pos < _listStartPos+.9) {
		if (pos <= 0.5 && pos >= -_numberOfPages+1.5) {
			transform.Translate(newX, 0, 0);
		}
	}
}

private function Swipe(curPos : Vector3) {
	if(curPos.x < _startPos.x) {
		if (transform.position.x > -_numberOfPages+1.5) {
			this.transform.position.x = _listStartPos - 1;
			ChangeDot(1);
		} else {
			transform.position.x = -_numberOfPages+1.5;
		}
		
	} else if(curPos.x > _startPos.x) {
		if (transform.position.x < 0.5) {
			ChangeDot(-1);
			this.transform.position.x = _listStartPos + 1;
		} else {
			transform.position.x = 0.5;
		}
	}
	_startPos = Vector3.zero;
}

private function ChangeDot(deltaPos : int) {
	_dots[_curPos].color = _defaultColor;
	_curPos += deltaPos;
	_dots[_curPos].color = _selectedColor;
}
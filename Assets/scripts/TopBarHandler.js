#pragma strict

var _speedNormalBtn : GUITexture;
var _speedFastBtn : GUITexture;
var _background : GUITexture;
var _backgroundOffset : float;
var _isTopBarDown : boolean;
var _moving : boolean;
private var _toggleSpeed :float = 90;
private var _height : float = 44;

private static var Instance : TopBarHandler = null;
public static function Get() : TopBarHandler{ return Instance;}
public function TopBarHandler(){}

function Awake()
{
    Instance = this;
}

function Start() {
// Set the starting position / widths of the GUI elements.
_backgroundOffset = -_height;
_background.pixelInset.width = Screen.width;
_background.pixelInset.height = _height*2 + 10;
_background.pixelInset.y = _backgroundOffset;
_isTopBarDown = false;
_moving = false;
	
_speedNormalBtn.pixelInset.y = 5;
_speedNormalBtn.pixelInset.x = 5;

_speedFastBtn.pixelInset.y = 5;
_speedFastBtn.pixelInset.x = 10 +44;
}

function Click(name : String) {
	switch (name) {
		case _background.name :
			if (!_moving) {
				_moving = true;
				if (_isTopBarDown) {
					Close();
				} else {
					Open();
				}
			}
			_isTopBarDown = !_isTopBarDown;
			break;
		case _speedFastBtn.name :
			LevelMaster.Get()._curTimescale = 2.0;
			LevelMaster.Get().ChangeGameSpeed();
			break;
		case _speedNormalBtn.name :
			LevelMaster.Get()._curTimescale = 1.0;
			LevelMaster.Get().ChangeGameSpeed();
			break;
	}
}

function Open() {
	var endY : float = -_height*2;
	while (_backgroundOffset > endY) {
		var offsetAmount : float = Time.deltaTime*_toggleSpeed;
		_backgroundOffset -= offsetAmount;
		_background.pixelInset.y = _backgroundOffset;
		_speedNormalBtn.pixelInset.y -= offsetAmount;
		_speedFastBtn.pixelInset.y -= offsetAmount;
		NextShapePreview.Get().Move(0, -offsetAmount);
		MoneyManager.Get().Move(-offsetAmount);
		LevelMaster.Get().MoveTime(-offsetAmount);
		yield;
	}
	// Align everything to be the finish point,
	NextShapePreview.Get().Move(0, endY - _backgroundOffset);
	MoneyManager.Get().Move(endY - _backgroundOffset);
	LevelMaster.Get().MoveTime(endY - _backgroundOffset);
	_speedNormalBtn.pixelInset.y += endY - _backgroundOffset;
	_speedFastBtn.pixelInset.y += endY - _backgroundOffset;
	_backgroundOffset = endY;
	_background.pixelInset.y = _backgroundOffset;
	_moving = false;
}

function Close() {
	var endY : float = -_height;
	while (_backgroundOffset < endY) {
		var offsetAmount : float = Time.deltaTime*_toggleSpeed;
		_backgroundOffset += offsetAmount;
		_background.pixelInset.y = _backgroundOffset;
		_speedNormalBtn.pixelInset.y += offsetAmount;
		_speedFastBtn.pixelInset.y += offsetAmount;
		NextShapePreview.Get().Move(0, offsetAmount);
		MoneyManager.Get().Move(offsetAmount);
		LevelMaster.Get().MoveTime(offsetAmount);
		yield;
	}
	_moving = false;
}

function GetHeight() {
	return _height;
}
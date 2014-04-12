#pragma strict

private var _active : boolean;
private var _height : float;
private var _width : float;
private var _modalType : ModalType;
private var _scale : float;

private var _heading : String;
private var _body : String;


// Make this a singleton
private static var Instance : ModalManager = null;
public static function Get() : ModalManager { return Instance; }
public function ModalManager() {}

function Awake()
{
	Instance = this;
	_width = Screen.width - 80;
}

function CreateTimeModal(headerText : String, bodyText : String, time : float) {
	_active = true;
	_modalType = ModalType.Timer;
	_heading = headerText;
	_body = bodyText;
	
	StartModal();
	Invoke("CloseModal", time);
	
	_height = 300; // Work out what the height should be depdning on if Header exists, and body.length
}

function CreateButtonModal(headerText : String, bodyText : String) {
	_active = true;
	_modalType = ModalType.Button;
	
	_height = 400;
}

private function StartModal() {
	while (_scale < 1) {
		_scale += Time.deltaTime*1.5;
		if(_scale > 1) {
			_scale = 1;
		}
		yield;
	}
}

function CloseModal() {
	_active = false;
	_modalType = ModalType.None;
	
	while (_scale > 0) {
		_scale -= Time.deltaTime*1.5;
		if(_scale < 0) {
			_scale = 0;
		}
		yield;
	}
}

function OnGUI() {
	if(_active || _scale > 0) {
		// Set RECT variables.
		
		
		
		
		GUI.Box(ScalingRect( 40, (Screen.height - _height)/2, _width, _height),"");
		
		// Heading Text
		GUI.Label(ScalingRect(60, ((Screen.height - _height)/2 +20), _width-40, 100), _heading);
		
		// Body Text
		GUI.Label(ScalingRect(60, ((Screen.height - _height)/2 +60), _width-40, 100), _body);
		
	}
}

function ScalingRect(x : float, y : float, width : float, height : float) : Rect {
	var posX : float = x;
	var posY : float = y;
	var thisWidth : float = width;
	var thisHeight : float = height;
	
	if (_scale < 1) {
		posX = (Screen.width/2) - ((Screen.width/2) * _scale) + (x * _scale);
		posY = (Screen.height/2) - ((Screen.height/2) * _scale) + (y * _scale);
		thisWidth = _width * _scale;
		thisHeight = _height * _scale;
	}
	return Rect(posX, posY, thisWidth, thisHeight);
}

private enum ModalType {
	Button,
	Timer,
	None
}
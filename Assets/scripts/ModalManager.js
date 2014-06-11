#pragma strict

private var _modalType : ModalType;

var modalBG : GUITexture;
var _heading : GUIText;
var _body : GUIText;
var _continueBtn : Button;
var _cancelBtn : Button;

private var _continueFunction : Function;
private var _cancelFunction : Function;

private var _lineHeight : int;

// Make this a singleton
private static var Instance : ModalManager = null;
public static function Get() : ModalManager { return Instance; }
public function ModalManager() {}

function Awake()
{
	Instance = this;
	
	_lineHeight = 18;
		
	var diff : float = GameUtils.DpiDifference();
	modalBG.pixelInset.width = Screen.width;
	modalBG.pixelInset.height = Screen.height*0.7;
	modalBG.pixelInset.y = Screen.height*0.15;
	
	_heading.fontSize *= diff;
	_heading.pixelOffset.y *= diff;
	_heading.pixelOffset.x *= diff;
	
	_body.fontSize *= diff;
	_body.pixelOffset.y *= diff;
	_body.pixelOffset.x *= diff;
	
	_continueBtn.AlterButtonWidthByDpi();
	_cancelBtn.AlterButtonWidthByDpi();
	
	modalBG.active = false;
	_heading.active = false;
	_body.active = false;
	_continueBtn.active = false;
	_cancelBtn.active = false;
	
	modalBG.color.a = 0;
	_heading.color.a = 0;
	_body.color.a = 0;
}

function CreateTimeModal(headerText : String, bodyText : String, time : float) {
	_modalType = ModalType.Timer;
	_heading.text = headerText;
	_body.text = bodyText;
	
	var diff : float = GameUtils.DpiDifference();
	
	// Work out how many lines the modal body text is and increase height / drop button to fit it all in
	var maxLineLength : int = 35;
	var multiple : int = Mathf.FloorToInt(_body.text.Length / maxLineLength);
	
	_heading.pixelOffset.y = (15 + multiple*_lineHeight) * diff;
	_body.pixelOffset.y = (-15 + (multiple*_lineHeight)/2) * diff;
	
	StartModal();
	CloseDelay(time);
}

function CreateTwoButtonModal (headerText : String, bodyText : String, leftBtnFunc : Function,  rightBtnFunc : Function) {
	_cancelBtn.active = true;
	_cancelFunction = leftBtnFunc;
	
	CreateButtonModal(headerText, bodyText, rightBtnFunc);
	
	
	var inset : Rect = _continueBtn.GetPixelInset();
	inset.x = 20 * GameUtils.DpiDifference();
	_continueBtn.SetPixelInset(inset);
}

function CreateButtonModal(headerText : String, bodyText : String, func : Function) {
	_continueFunction = func;
	_modalType = ModalType.Button;
	_heading.text = headerText;
	_body.text = bodyText;
	_continueBtn.active = true;
	
	// Work out how many lines the modal body text is and increase height / drop button to fit it all in
	var maxLineLength : int = 35;
	var multiple : int = Mathf.FloorToInt(_body.text.Length / maxLineLength);
	Debug.Log("multiple " + multiple);
	
	var diff : float = GameUtils.DpiDifference();
	
	_heading.pixelOffset.y = (30 + multiple*_lineHeight) * diff;
	_body.pixelOffset.y = (multiple*_lineHeight)/2 * diff;
	
	var inset : Rect = _continueBtn.GetPixelInset();
	inset.x = -50 * diff;
	_continueBtn.SetPixelInset(inset);
	
	StartModal();
}

private function CloseDelay(time : float) {
	yield WaitForSeconds(time);
	CloseModal();
}

private function StartModal() {
	if(_modalType == ModalType.Button) {
		Time.timeScale = 0;
	}
	modalBG.active = true;
	_heading.active = true;
	_body.active = true;
	while (_heading.color.a < 1) {
		modalBG.color.a += 0.07;
		_heading.color.a += 0.1;
		_body.color.a += 0.1;
		yield;
	}
	modalBG.color.a = 0.7;
	_heading.color.a = 1;
	_body.color.a = 1;
}

function Click(name : String) {
	switch (name) {
		case "ContinueBtn" :
			_continueFunction();
			CloseModal();
			break;
		case "CancelBtn" :
			if (_cancelFunction) {
				_cancelFunction();
			}
			CloseModal();
			break;
	}
}

function CloseModal() {
	_modalType = ModalType.None;
	
	while (_heading.color.a > 0) {
		modalBG.color.a -= 0.07;
		_heading.color.a -= 0.1;
		_body.color.a -= 0.1;
		yield;
	}
	modalBG.color.a = 0;
	_heading.color.a = 0;
	_body.color.a = 0;
	modalBG.active = false;
	_heading.active = false;
	_body.active = false;
	_continueBtn.active = false;
	_continueFunction = null;
	_cancelBtn.active = false;
	_cancelFunction = null;
	
	LevelMaster.Get().ChangeGameSpeed();
}

private enum ModalType {
	Button,
	Timer,
	None
}
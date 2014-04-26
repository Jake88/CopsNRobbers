#pragma strict

private var _modalType : ModalType;

var modalBG : GUITexture;
var _heading : GUIText;
var _body : GUIText;


// Make this a singleton
private static var Instance : ModalManager = null;
public static function Get() : ModalManager { return Instance; }
public function ModalManager() {}

function Awake()
{
	Instance = this;
	
	modalBG.pixelInset.width = Screen.width - 80;
	modalBG.pixelInset.x = 40;
	
	modalBG.enabled = false;
	_heading.enabled = false;
	_body.enabled = false;
	
	modalBG.color.a = 0;
	_heading.color.a = 0;
	_body.color.a = 0;
}

function CreateTimeModal(headerText : String, bodyText : String, time : float) {
	_modalType = ModalType.Timer;
	_heading.text = headerText;
	_body.text = bodyText;
	
	modalBG.pixelInset.height = 200;
	modalBG.pixelInset.y = -100;
	
	StartModal();
	CloseDelay(time);
}

function CreateButtonModal(headerText : String, bodyText : String) {
	_modalType = ModalType.Button;
	_heading.text = headerText;
	_body.text = bodyText;
	
	modalBG.pixelInset.height = 250;
	modalBG.pixelInset.y = -125;
	
	StartModal();
}

private function CloseDelay(time : float) {
	yield WaitForSeconds(time);
	CloseModal();
}

private function StartModal() {
	modalBG.enabled = true;
	_heading.enabled = true;
	_body.enabled = true;
	while (modalBG.color.a < 1) {
		modalBG.color.a += Time.deltaTime;
		_heading.color.a += Time.deltaTime;
		_body.color.a += Time.deltaTime;
		yield;
	}
}

function CloseModal() {
	_modalType = ModalType.None;
	
	while (modalBG.color.a > 0) {
		modalBG.color.a -= Time.deltaTime;
		_heading.color.a -= Time.deltaTime;
		_body.color.a -= Time.deltaTime;
		yield;
	}
	modalBG.enabled = false;
	_heading.enabled = false;
	_body.enabled = false;
}

private enum ModalType {
	Button,
	Timer,
	None
}
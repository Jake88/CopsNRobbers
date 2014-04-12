#pragma strict

private static var Instance : MoneyManager = null;
var _money : int;

public static function Get() : MoneyManager{ return Instance; }
public function MoneyManager(){}

function Awake()
{
    Instance = this;
}

function OnGUI() {
	GUI.Label(Rect (20,20,80,20), "$" + _money.ToString("n0"));
}

function AlterMoney(amount : int) : boolean {
	if (_money - amount >= 0) {
		_money -= amount;
		return true;
	}
	return false;
}

function StealMoney(amount : int) {
	_money -= amount;
}

function AddMoney(amount : int) {
	_money += amount;
}

function CheckMoney(amount : int) : boolean {
	return (_money - amount >= 0);
}

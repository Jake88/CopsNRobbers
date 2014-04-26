#pragma strict

private static var Instance : MoneyManager = null;
var _money : int;
var _moneyLabel : GUIText;

public static function Get() : MoneyManager{ return Instance; }
public function MoneyManager(){}

function Awake()
{
    Instance = this;
    _moneyLabel.text = "$" + _money.ToString("n0");
}

function AlterMoney(amount : int) : boolean {
	if (_money - amount >= 0) {
		_money -= amount;
		_moneyLabel.text = "$" + _money.ToString("n0");
		return true;
	}
	return false;
}

function StealMoney(amount : int) {
	_money -= amount;
	_moneyLabel.text = "$" + _money.ToString("n0");
}

function AddMoney(amount : int) {
	_money += amount;
	_moneyLabel.text = "$" + _money.ToString("n0");
}

function CheckMoney(amount : int) : boolean {
	return (_money - amount >= 0);
}

function Move(val : float) {
	_moneyLabel.pixelOffset.y += val;
}

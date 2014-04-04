﻿#pragma strict

private static var Instance : MoneyManager = null;
var _money : int;

public static function Get() : MoneyManager
{
    return Instance;
}

public function MoneyManager()
{
    //if the constructor must be public, you can do this:
    if (Instance != null)
    {
    }
}

function Awake()
{
    Instance = this;
}

function OnGUI() {
	GUI.Label(Rect (110,20,80,20), "$" + _money.ToString("n0"));
}

function AlterMoney(amount : int) : boolean {
	if (_money - amount > 0) {
		_money -= amount;
		return true;
	}
	return false;
}

function CheckMoney(amount : int) : boolean {
	return (_money - amount > 0);
}
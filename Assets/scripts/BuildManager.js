#pragma strict

private static var Instance : BuildManager = null;
var _shopButtons : BuildingButton[];
var _copButtons : BuildingButton[];
var _propButtons : BuildingButton[];
var _buildingTypeButtons : Button[];
var _buildingButtons : Button[];
var _sellingButtons : Button[];
var _transparentOverlay : Transform;
var background : GUITexture;
var backBtn : Button;

private var _selectedTile : Tile;
private var _currentBuilding : BuildingButton;
private var _currentState : BuildingState;

private var _selectedBuilding : Building;

// Pixel variables.
private var _buttonHeight : float = 70;


private var _sliderPosition : int;

public static function Get() : BuildManager{ return Instance; }
public function BuildManager(){}

function Awake()
{
	_buttonHeight *= GameUtils.DpiDifference();
    Instance = this;
    _currentState = BuildingState.None;
    _transparentOverlay.renderer.enabled = false;
    background.pixelInset.width = Screen.width;
    background.pixelInset.height = _buttonHeight;
    backBtn.AlterButtonWidthByDpi();
}

function Start() {
	var inset : Rect;
	// Set width / position of build type buttons.
    for (var typeBtnsIndex = 0; typeBtnsIndex < _buildingTypeButtons.length; typeBtnsIndex++) {
    	inset = _buildingTypeButtons[typeBtnsIndex].GetPixelInset();
    	inset.width = Screen.width / _buildingTypeButtons.length;
    	inset.x = typeBtnsIndex * (Screen.width/_buildingTypeButtons.length);
    	_buildingTypeButtons[typeBtnsIndex].SetPixelInset(inset);
    }
    
    //adjust shop / cop / prop width by the screen dpi
    for (var shop : Button in _shopButtons) {
    	shop.AlterButtonWidthByDpi();
    }
    for (var cop : Button in _copButtons) {
    	cop.AlterButtonWidthByDpi();
    }
    for (var prop : Button in _propButtons) {
    	prop.AlterButtonWidthByDpi();
    }
	
    // Set width / position of Building Buttons
    for (var buildingBtnsIndex = 0; buildingBtnsIndex < _buildingButtons.length; buildingBtnsIndex++) {
    	inset = _buildingButtons[buildingBtnsIndex].GetPixelInset();
    	inset.width = Screen.width / _buildingButtons.length;
    	inset.x = buildingBtnsIndex * (Screen.width/_buildingButtons.length);
    	_buildingButtons[buildingBtnsIndex].SetPixelInset(inset);
    }
    
    for (var sellingBtnsIndex = 0; sellingBtnsIndex < _sellingButtons.length; sellingBtnsIndex++) {
    	inset = _sellingButtons[sellingBtnsIndex].GetPixelInset();
    	inset.width = Screen.width / _sellingButtons.length;
    	inset.x = sellingBtnsIndex * (Screen.width/_sellingButtons.length);
    	_sellingButtons[sellingBtnsIndex].SetPixelInset(inset);
    }
    
    DisableAll();
	for (var typeBtns : Button in _buildingTypeButtons) {
		typeBtns.active = true;
	}
}

function Click(name : String) {
	name = name.Replace("Btn", "");
	switch (_currentState) {
		case BuildingState.None :
			ClickType(name);
			break;
		case BuildingState.Shops :
			ClickBuilding(name, _shopButtons);
			break;
		case BuildingState.Cops :
			ClickBuilding(name, _copButtons);
			break;
		case BuildingState.Props :
			ClickBuilding(name, _propButtons);
			break;
		case BuildingState.Building :
			ClickBuildButton(name);
			break;
		case BuildingState.Selling :
			ClickSellingButton(name);
			break;
	}
}

function ChangeButtons() {
	DisableAll();
	switch (_currentState) {
		case BuildingState.None :
			for (var typeBtns : Button in _buildingTypeButtons) {
				typeBtns.active = true;
			}
			break;
		case BuildingState.Shops :
			for (var shopButton : BuildingButton in _shopButtons) {
				shopButton.active = true;
			}
			break;
		case BuildingState.Cops :
			for (var copButton : BuildingButton in _copButtons) {
				copButton.active = true;
			}
			break;
		case BuildingState.Props :
			Debug.Log("_propButtons " + _propButtons);
			for (var propButton : BuildingButton in _propButtons) {
			Debug.Log("propButton.name " + propButton.name);
				propButton.active = true;
			}
			break;
		case BuildingState.Building :
			for (var buildingButton : Button in _buildingButtons) {
				if(buildingButton.name != "ConfirmBtn") {
					buildingButton.active = true;
				}
			}
			break;
		case BuildingState.Selling :
			for (var sellingButton : Button in _sellingButtons) {
				sellingButton.active = true;
			}
			break;
	}
}

private function DisableAll() {
	for (var typeBtn : Button in _buildingTypeButtons) {
		typeBtn.active = false;
	}
	for (var shopButton : BuildingButton in _shopButtons) {
		shopButton.active = false;
	}
	for (var copButton : BuildingButton in _copButtons) {
		copButton.active = false;
	}
	for (var propButton : BuildingButton in _propButtons) {
		propButton.active = false;
	}
	for (var buildingButton : Button in _buildingButtons) {
		buildingButton.active = false;
	}
	for (var sellingButtons : Button in _sellingButtons) {
		sellingButtons.active = false;
	}

	backBtn.active = false;
}

function ClickType(name : String) {
	switch (name) {
		case "Cops" :
			_currentState = BuildingState.Cops;
			break;
		case "Shops" :
			_currentState = BuildingState.Shops;
			break;
		case "Props" :
			_currentState = BuildingState.Props;
			break;
	}
	ChangeButtons();
	backBtn.active = true;
}

function ClickBuilding(name : String, btns : BuildingButton[]) {
	if ( name == "Back" ){
		_currentState = BuildingState.None;
		_currentBuilding = null;
		ChangeButtons();
	} else {
		for (var btn : BuildingButton in btns) {
			if (btn.name == name && MoneyManager.Get().CheckMoney(btn.cost)) {
				EnterBuildMode(btn);
			}
		}
	}
}

function ClickShop(name : String) {
	for (var shopButton : BuildingButton in _shopButtons) {
		if (shopButton.name == name && MoneyManager.Get().CheckMoney(shopButton.cost)) {
			EnterBuildMode(shopButton);
		}
	}
}

function ClickCop(name : String) {
	for (var copButton : BuildingButton in _copButtons) {
		if (copButton.name == name && MoneyManager.Get().CheckMoney(copButton.cost)) {
			EnterBuildMode(copButton);
		}
	}
}

function ClickProp(name : String) {
	for (var propButton : BuildingButton in _propButtons) {
		if (propButton.name == name && MoneyManager.Get().CheckMoney(propButton.cost)) {
			EnterBuildMode(propButton);
		}
	}
}

function ClickBuildButton(name : String) {
	switch (name) {
		case "Confirm" :
			ConfirmBuild();
		case "Cancel" :
			ExitBuildMode();
			ChangeButtons();
			break;
	}
}

function ClickSellingButton(name : String) {
	switch (name) {
		case "Confirm" :
			Sell();
			break;
		case "Cancel" :
			_currentState = BuildingState.None;
			for (var child : Transform in _selectedBuilding.transform) {
				var sr : SpriteRenderer = child.GetComponent("SpriteRenderer") as SpriteRenderer;
				sr.color = Color.white;
			}
			_selectedBuilding = null;
			ChangeButtons();
			break;
	}
}

private function Sell() {
	// Check what type of building it is
	var shop : Shop = _selectedBuilding.transform.GetComponent("Shop") as Shop;
	var cop : Cop = _selectedBuilding.transform.GetComponent("Cop") as Cop;
	var prop : Prop = _selectedBuilding.transform.GetComponent("Prop") as Prop;
	// Get the tiles that are occupied by that building
	if (shop) {
		shop.Sell();
	} else if (cop) {
		cop.Sell();
	} else if (prop) {
		prop.Sell();
	}
	_currentState = BuildingState.None;
	_selectedBuilding = null;
	ChangeButtons();
	
	// refresh the pathfinder
	FloodFiller.Get().CreatePaths();
}

private function EnterBuildMode(building : BuildingButton) {
	_currentBuilding = building;
	_currentState = BuildingState.Building;
	ChangeButtons();
	_transparentOverlay.renderer.enabled = true;
	Time.timeScale = 0;
	
	for (var tile : Tile in LevelMaster.Get()._tiles) {
		tile.ShowOverlay();
	}
}

function ExitBuildMode() {
	ShopBuilder.Get().Reset();
	if(_selectedTile) {
		_selectedTile.Unhighlight();
		_selectedTile = null;
	}
	_currentBuilding = null;
	_buildingButtons[_buildingButtons.length-1].active = false;
	_currentState = BuildingState.None;
	_transparentOverlay.renderer.enabled = false;
	LevelMaster.Get().ChangeGameSpeed();
	
	for (var tile : Tile in LevelMaster.Get()._tiles) {
		tile.HideOverlay();
	}
}

function CheckBuildPosition(tile : Tile) {
	if(_currentState == BuildingState.Building) {
		if(_currentBuilding.tag == "Shop") {
			_buildingButtons[_buildingButtons.length-1].active = ShopBuilder.Get().Build(tile);
		} else if (_currentBuilding.tag == "Cop" || _currentBuilding.tag == "Prop") {
	    	if(tile._isAvailable) {
	    		tile.Highlight(true);
	    		_buildingButtons[_buildingButtons.length-1].active = true;
	    	} else {
	    		tile.Highlight(false);
	    		_buildingButtons[_buildingButtons.length-1].active = false;
	    	}
	    	if(_selectedTile) {
	    		_selectedTile.Unhighlight();
	    	}
	    	_selectedTile = tile;
		}
	}
}

private function ConfirmBuild() {
	if(_currentState == BuildingState.Building && MoneyManager.Get().AlterMoney(_currentBuilding.cost)) {
		if(_currentBuilding.tag == "Shop") {
			ShopBuilder.Get().ConfirmBuild(_currentBuilding.shopName);
		} else if (_currentBuilding.tag == "Cop") {
			if(_selectedTile._isAvailable) {
	    		BuildCop();
	    	}
		} else if (_currentBuilding.tag == "Prop") {
			if(_selectedTile._isAvailable) {
	    		BuildProp();
	    	}
		}
	}
}

private function BuildCop() {
	_selectedTile._occupied = true;
	var go : GameObject = Instantiate(Resources.Load(_currentBuilding.shopName)) as GameObject;
	var cop : Cop = go.transform.GetComponent("Cop") as Cop;
	_selectedTile._occupiedUnit = cop.gameObject;
	cop._tile = _selectedTile;
	cop.transform.position.x = _selectedTile.transform.position.x;
	cop.transform.position.y = _selectedTile.transform.position.y;
	FloodFiller.Get().CreatePaths();
}

private function BuildProp() {
	_selectedTile._occupied = true;
	var go : GameObject = Instantiate(Resources.Load(_currentBuilding.shopName)) as GameObject;
	var prop : Prop = go.transform.GetComponent("Prop") as Prop;
	_selectedTile._occupiedUnit = prop.gameObject;
	prop._tile = _selectedTile;
	prop.transform.position.x = _selectedTile.transform.position.x;
	prop.transform.position.y = _selectedTile.transform.position.y;
	FloodFiller.Get().CreatePaths();
}

public function SelectBuilding(trans:Transform) {
	if (_currentState == BuildingState.None) {
		_selectedBuilding = trans.parent.GetComponent("Building") as Building;	
		for (var child : Transform in _selectedBuilding.transform) {
			var sr : SpriteRenderer = child.GetComponent("SpriteRenderer") as SpriteRenderer;
			sr.color = Color.cyan;
		}
		_currentState = BuildingState.Selling;
		ChangeButtons();
	}
}

public function CheckAllShopCosts() {
	for (var shopButton : BuildingButton in _shopButtons) {
		CheckShopCost(shopButton);
	}
	for (var copButton : BuildingButton in _copButtons) {
		CheckShopCost(copButton);
	}
	for (var propButton : BuildingButton in _propButtons) {
		CheckShopCost(propButton);
	}	
}

private function CheckShopCost(btn : BuildingButton) {
	if(MoneyManager.Get().CheckMoney(btn.cost)) {
		btn.ChangeAlpha(1);
	} else {
		btn.ChangeAlpha(0.3);
	}
	
}

public function GetButtonHeight() : float {
	return _buttonHeight;
}


private enum BuildingState {
	None,
	Shops,
	Cops,
	Props,
	Building,
	Selling
}

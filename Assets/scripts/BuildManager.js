#pragma strict

private static var Instance : BuildManager = null;
var _shopButtons : BuildingButton[];
var _copButtons : BuildingButton[];
var _propButtons : BuildingButton[];
var _transparentOverlay : Transform;

private var _confirmingBuild : boolean;
private var _selectedTile : Tile;
private var _currentBuilding : BuildingButton;
private var _currentState : BuildingState;
private var _buttonHeight : float = 44;


private var _sliderPosition : int;

public static function Get() : BuildManager{ return Instance; }
public function BuildManager(){}

function Awake()
{
    Instance = this;
    _currentState = BuildingState.None;
    _transparentOverlay.renderer.enabled = false;
}

function OnGUI() {
	GUI.Box(Rect(0,Screen.height-_buttonHeight, Screen.width, _buttonHeight), "");
	switch(_currentState) {
		case BuildingState.None :
			if(GUI.Button(Rect(0,Screen.height-_buttonHeight,Screen.width/3, _buttonHeight), "Shops")){
				_currentState = BuildingState.Shops;
			}
			if(GUI.Button(Rect(Screen.width/3,Screen.height-_buttonHeight,Screen.width/3, _buttonHeight), "Cops")){
				_currentState = BuildingState.Cops;
			}
			if(GUI.Button(Rect(Screen.width/3*2,Screen.height-_buttonHeight,Screen.width/3, _buttonHeight), "Props")){
				_currentState = BuildingState.Props;
			}
		break;
		case BuildingState.Shops :
			if(GUI.Button(Rect(0,Screen.height-_buttonHeight,_buttonHeight, _buttonHeight), "<")){
				_currentState = BuildingState.None;
			}
			
			for (var shopIndex = 0; shopIndex < _shopButtons.Length; shopIndex++) {
				if (!MoneyManager.Get().CheckMoney(_shopButtons[shopIndex].cost)){
					//Set this button to be disablaed
					GUI.enabled = false;
				}
				if(GUI.Button(Rect(_buttonHeight+(shopIndex*_buttonHeight),Screen.height-_buttonHeight,_buttonHeight, _buttonHeight), _shopButtons[shopIndex].texture)){
					EnterBuildMode(_shopButtons[shopIndex]);
				}
				GUI.enabled = true;
			}
		break;
		case BuildingState.Cops :
			if(GUI.Button(Rect(0,Screen.height-_buttonHeight,_buttonHeight, _buttonHeight), "<")){
				_currentState = BuildingState.None;
			}
			
			for (var copIndex = 0; copIndex < _copButtons.Length; copIndex++) {
				if (!MoneyManager.Get().CheckMoney(_copButtons[copIndex].cost)){
					//Set this button to be disablaed
					GUI.enabled = false;
				}
				if(GUI.Button(Rect(_buttonHeight+(copIndex*_buttonHeight),Screen.height-_buttonHeight,_buttonHeight, _buttonHeight), _copButtons[copIndex].texture)){
					EnterBuildMode(_copButtons[copIndex]);
				}
				GUI.enabled = true;
			}
		break;
		case BuildingState.Props :
			// display props buttons on slider
		break;
		case BuildingState.Building :
			if(_currentBuilding.tag == "Shop") {
				if (GUI.Button (Rect(Screen.width/4,Screen.height-_buttonHeight,Screen.width/4, _buttonHeight), "Rotate")) {
					ShopBuilder.Get().Rotate();
					_confirmingBuild = false;
				}
				if (GUI.Button (Rect(Screen.width/4*2,Screen.height-_buttonHeight,Screen.width/4, _buttonHeight), "New Shape ($250)")) {
					// check if player can afford the cost. If so:
					ShopBuilder.Get().NewNextShape();
					_confirmingBuild = false;
				}
			}
			
			if (GUI.Button (Rect(0,Screen.height-_buttonHeight,Screen.width/4, _buttonHeight), "Cancel")) {
				// Enter the build mode:
				ExitBuildMode();
			}

			if (_confirmingBuild) {
				if (GUI.Button (Rect(Screen.width/4*3,Screen.height-_buttonHeight,Screen.width/4, _buttonHeight), "Confirm")) {
					// Enter the build mode:
					ConfirmBuild();
					ExitBuildMode();
				}
			}	
		break;
	}
}

private function EnterBuildMode(building : BuildingButton) {
	_currentBuilding = building;
	_currentState = BuildingState.Building;
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
	_confirmingBuild = false;
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
			_confirmingBuild = ShopBuilder.Get().Build(tile);
		} else if (_currentBuilding.tag == "Cop") {
	    	if(tile._isAvailable) {
	    		tile.Highlight(true);
	    		_confirmingBuild = true;
	    	} else {
	    		tile.Highlight(false);
	    		_confirmingBuild = true;
	    	}
	    	if(_selectedTile) {
	    		_selectedTile.Unhighlight();
	    	}
	    	_selectedTile = tile;
		} else {
		
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
		} else {
		
		}
	}
}

private function BuildCop() {
	_selectedTile._occupied = true;
	var cop : GameObject = Instantiate(Resources.Load(_currentBuilding.shopName)) as GameObject;
	_selectedTile._occupiedUnit = cop.gameObject;
	cop.transform.position.x = _selectedTile.transform.position.x;
	cop.transform.position.y = _selectedTile.transform.position.y;
	FloodFiller.Get().CreatePaths();
}

public function GetButtonHeight() : float {
	return _buttonHeight;
}


private enum BuildingState {
	None,
	Shops,
	Cops,
	Props,
	Building
}

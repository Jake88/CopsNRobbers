﻿#pragma strict

private static var Instance : BuildManager = null;
var _shopButtons : Texture[];
var _copButtons : Texture[];
var _propButtons : Texture[];
var _currentBuilding : String;
var _currentState : BuildingState;
var _transparentOverlay : Transform;


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
	GUI.Box(Rect(0,Screen.height-44, Screen.width, 44), "");
	switch(_currentState) {
		case BuildingState.None :
			if(GUI.Button(Rect(0,Screen.height-44,Screen.width/3, 44), "Shops")){
				_currentState = BuildingState.Shops;
			}
			if(GUI.Button(Rect(Screen.width/3,Screen.height-44,Screen.width/3, 44), "Cops")){
				_currentState = BuildingState.Cops;
			}
			if(GUI.Button(Rect(Screen.width/3*2,Screen.height-44,Screen.width/3, 44), "Props")){
				_currentState = BuildingState.Props;
			}
		break;
		case BuildingState.Shops :
			if(GUI.Button(Rect(0,Screen.height-44,44, 44), "<")){
				_currentState = BuildingState.None;
			}
			
			for (var i = 0; i < _shopButtons.Length; i++) {
				if(GUI.Button(Rect(44+(i*44),Screen.height-44,44, 44), _shopButtons[i])){
					EnterBuildMode(_shopButtons[i].name);
				}
			}
			// display shop buttons on slider
			// When one of these is clicked,
				// set the corrersponding building name to _currentBuilding
				// Change the game mode to building
				// Hide the 'slider panel' and show the Confirm / Cancel / Rotate / New Shape buttons.
					//TODO: Make 'building' a state in BuildingState and handle everything to do with 
						// building in this script.
		break;
		case BuildingState.Cops :
			// display cop buttons on slider
		break;
		case BuildingState.Props :
			// display props buttons on slider
		break;
		
	}
}

private function EnterBuildMode(name : String) {
	_currentBuilding = name;
	_currentState = BuildingState.Building;
	_transparentOverlay.renderer.enabled = true;
	Time.timeScale = 0;
	
	for (var tile : Tile in LevelMaster.Get()._tiles) {
		tile.ShowOverlay();
	}
}

function ExitBuildMode() {
	_currentState = BuildingState.None;
	_transparentOverlay.renderer.enabled = false;
	LevelMaster.Get().ChangeGameSpeed();
}

function CheckBuildPosition(tile : Tile) {
	if(_currentState == BuildingState.Building) {
	
	}
}

function Update() {
	// TODO: Change this to BuildingState.Building
	if (_currentState == BuildingState.Building) {
	}
}


private enum BuildingState {
	None,
	Shops,
	Cops,
	Props,
	Building
}
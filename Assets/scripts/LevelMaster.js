#pragma strict

private static var Instance : LevelMaster = null;
var _mallWidth : float;
var _mallHeight : float;
var _tiles : Tile[,];
var _path = new Array();
var _bankSprites : Sprite[];
var _wallSprite : Sprite;
var _secondsBetweenMidnight : int;
var _rent : int;
var _skin : GUISkin;
var _menuBackground : GUITexture;

private var _midnightTimer : float;
private var _curTimescale : float;
private var _startTile : Tile;
private var _endTile : Tile;
private var _currentState : LevelStates;
private var _isMidnightWarningActive : boolean;

public static function Get() : LevelMaster { return Instance; }

public function LevelMaster() {}

function Awake()
{
    Instance = this;
    _midnightTimer = Time.time + _secondsBetweenMidnight;
    _currentState = LevelStates.None; // Should be NONE. Change when we actually have a building mode.
    _curTimescale = 1.0;
    _isMidnightWarningActive = true;

	CreateTiles();
	FloodFiller.Get().CreatePaths();
}

function Start() {
	_menuBackground.pixelInset.width = Screen.width;
	_menuBackground.pixelInset.height = BuildManager.Get().GetButtonHeight()*2;
	_menuBackground.pixelInset.y = -BuildManager.Get().GetButtonHeight();
}

function OnGUI() {
	if (GUI.Button (Rect (20,140,80,20), "Normal")) {
		// Change the game speed
		_curTimescale = 1.0;
		ChangeGameSpeed();
	}
	if (GUI.Button (Rect (20,200,80,20), "Fastest")) {
		// Change the game speed
		_curTimescale = 2.0;
		ChangeGameSpeed();
	}
}

function Update() {
	if(_midnightTimer < Time.time) {
		// Reset midnight variables.
		_isMidnightWarningActive = true;
		_midnightTimer = Time.time + _secondsBetweenMidnight;
		// Display MIDNIGHT MODAL.
		ModalManager.Get().CreateTimeModal("MIDNIGHT", "Rent Due: $"+ _rent, 3.0);
		// fire midnight triggers.
		WaveSpawner.Get().MidnightTrigger();
		GetRent();
	} else if (_isMidnightWarningActive && _midnightTimer-15.0 < Time.time) {
		_isMidnightWarningActive = false;
		ModalManager.Get().CreateTimeModal("MIDNIGHT APPROACHES", "A grand heist is being planned!", 4.0);
	}
}

private function CreateTiles() {
	_tiles = new Tile[_mallWidth, _mallHeight];
		
	for (var x = 0; x < _mallWidth; x++) {
		for (var y = 0; y <  _mallHeight; y++) {
			var tile : GameObject;
			if (y == _mallHeight-1 && x == Mathf.FloorToInt(_mallWidth/2)) {
				// center of the top row means this tile is the entrance.
				tile = Instantiate(Resources.Load("Start Tile")) as GameObject;
			} else {
				tile = Instantiate(Resources.Load("Mall Tile")) as GameObject;
			}
			var castedTile:Tile = tile.GetComponent("Tile") as Tile;
			var sr : SpriteRenderer;
			tile.transform.position.x = x;
			tile.transform.position.y = y;
			
			
			castedTile._x = x;
			castedTile._y = y;
		
			// check if this tile is the entrance or bank of the mall.
			if (y == 0) {
				Transform.Destroy(tile.transform.Find("TileOverlay").gameObject);
				sr = tile.GetComponent("SpriteRenderer") as SpriteRenderer;
				if(x == Mathf.FloorToInt(_mallWidth/2)) {
					// center of the bottom row means this tile is the bank.
					tile.tag = ("EndTile");
					_endTile = castedTile;
					sr.sprite = _bankSprites[0];
				} else {
					sr.sprite = _bankSprites[Mathf.Round(Random.Range(2, _bankSprites.Length))];
					castedTile._occupied = true;
				}
			} else if (y == _mallHeight-1) {
				if (x == Mathf.FloorToInt(_mallWidth/2)) {
					_startTile = castedTile;
				} else {
					Transform.Destroy(tile.transform.Find("TileOverlay").gameObject);
					sr = tile.GetComponent("SpriteRenderer") as SpriteRenderer;
					sr.sprite = _wallSprite;
					castedTile._occupied = true;
				}
			}
			
			_tiles[x, y] = castedTile;
		}
	}
}

public function ChangeGameSpeed() {
	if (_currentState == LevelStates.None) {
		Time.timeScale = _curTimescale;
	}
}

private function GetRent() {
	if (!MoneyManager.Get().AlterMoney(_rent)) {
		// The player can't afford rent. Game over.
		//TODO Game over
	}
}

// GETTERS AND SETTERS
public function GetStartTile() : Tile {
	return _startTile;
}

public function GetEndTile() : Tile {
	return _endTile;
}


public enum LevelStates{
	None
}
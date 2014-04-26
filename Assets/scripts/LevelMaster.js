#pragma strict

private static var Instance : LevelMaster = null;
private static var DEFAULT_DPI : float = 160;
var _mallWidth : float;
var _mallHeight : float;
var _tiles : Tile[,];
var _bankSprites : Sprite[];
var _wallSprite : Sprite;
var _secondsBetweenMidnight : int;
var _rent : int;
var _curTimescale : float;
var _gameClockLabel : GUIText;
private var _gameClock : int;
private var _startTile : Tile;
private var _endTile : Tile;
private var _currentState : LevelStates;
private var dpiDifference : float;

public static function Get() : LevelMaster { return Instance; }

public function LevelMaster() {}

function Awake()
{
    Instance = this;
    _currentState = LevelStates.None;
    _curTimescale = 1.0;
    
    if ( Screen.dpi == 0 ) {
    	dpiDifference = 1;
    } else {
     dpiDifference = Screen.dpi / DEFAULT_DPI;
    }

	CreateTiles();
	FloodFiller.Get().CreatePaths();
}

function Start() {
	// Start repeating functions for the game.
	InvokeRepeating("Midnight", _secondsBetweenMidnight, _secondsBetweenMidnight);
	InvokeRepeating("MidnightWarning", _secondsBetweenMidnight-15.0, _secondsBetweenMidnight-15.0);
	
	// Work out game clock.
    var minutesPerDay : float = 1440;
    var aGameMinute : float = (0.0 + _secondsBetweenMidnight) / 1440;
    InvokeRepeating("IncreaseGameClock", aGameMinute, aGameMinute);
}

private function IncreaseGameClock() {
	_gameClock++;
	var isPM : boolean = _gameClock > 720;
	var hours : int = (_gameClock / 60);
	var minutes : int = _gameClock % 60;
	var MeridianString : String = " AM";
	
	if (isPM) {
		hours -= 12;
		MeridianString = " PM";
	}
	
	if(hours == 0) {
		hours = 12;
	}
	
	_gameClockLabel.text = hours.ToString("00") + ":" + minutes.ToString("00") + MeridianString;
}

function MoveTime(val : float) {
	_gameClockLabel.pixelOffset.y += val;
}

private function Midnight() {
	_gameClock = 0;
	// Display MIDNIGHT MODAL.
	ModalManager.Get().CreateTimeModal("MIDNIGHT", "Rent Due: $"+ _rent, 3.0);
	// fire midnight triggers.
	WaveSpawner.Get().MidnightTrigger();
	GetRent();
}

private function MidnightWarning() {
	ModalManager.Get().CreateTimeModal("MIDNIGHT APPROACHES", "A grand heist is being planned!", 4.0);
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
		Debug.Log("Stopping Game");
		// The player can't afford rent. Game over.
		//TODO Game over
		StopGame();
		
	}
}

private function StopGame() {
	CancelInvoke("Midnight");
	CancelInvoke("MidnightWarning");
    CancelInvoke("IncreaseGameClock");
    
    ModalManager.Get().CreateButtonModal("Bankrupt!", "You managed the mall for " + Time.timeSinceLevelLoad);
}

// GETTERS AND SETTERS
public function GetStartTile() : Tile {
	return _startTile;
}

public function GetEndTile() : Tile {
	return _endTile;
}

public function DpiDifference() {
	return dpiDifference;
}


public enum LevelStates{
	None,
	Lost
	
}
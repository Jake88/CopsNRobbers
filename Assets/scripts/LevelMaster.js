#pragma strict

private static var Instance : LevelMaster = null;
var _mallWidth : float;
var _mallHeight : float;
var _tiles : Tile[,];
var _bankSprites : Sprite[];
var _wallSprite : Sprite;
var _secondsBetweenMidnight : int;
var _rent : int;
var _winGoal : int;
var _curTimescale : float;
var _gameClockLabel : GUIText;
private var _gameClock : int;
private var _startTile : Tile;
private var _endTile : Tile;
private var _currentState : LevelStates;
private var dpiDifference : float;
private var _gameDays : int;

public static function Get() : LevelMaster { return Instance; }

public function LevelMaster() {}

function Awake()
{
    Instance = this;
    _currentState = LevelStates.None;
    _curTimescale = 1.0;
    _gameDays = 1;

	CreateTiles();
	FloodFiller.Get().CreatePaths();
	
	_gameClockLabel.fontSize *= GameUtils.DpiDifference();
    _gameClockLabel.pixelOffset.y *= GameUtils.DpiDifference();
    _gameClockLabel.pixelOffset.x *= GameUtils.DpiDifference();
}

function Start() {
	// Start repeating functions for the game.
	InvokeRepeating("Midnight", _secondsBetweenMidnight, _secondsBetweenMidnight);
	InvokeRepeating("MidnightWarning", _secondsBetweenMidnight-15.0, _secondsBetweenMidnight);
	
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
	if(GetRent()) {
		_gameClock = 0;
		_gameDays++;
		// Display MIDNIGHT MODAL.
		ModalManager.Get().CreateTimeModal("MIDNIGHT", "Rent Due: $"+ _rent, 1.75);
		// fire midnight triggers.
		WaveSpawner.Get().MidnightTrigger();
	}
}

private function MidnightWarning() {
	ModalManager.Get().CreateTimeModal("MIDNIGHT APPROACHES", "A grand heist is being planned!", 1.75);
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
		Debug.Log("Game Over. Stopping Game");
		GameOver();
		return false;
	}
	return true;
}

var ExitGameFunc : Function = function() {
	Debug.Log("testing this is Exit Game Func");
	
	// destory everything.
	var objs : Array  = GameObject.FindObjectsOfType(GameObject);
	for (var obj : GameObject in objs) {
		GameObject.Destroy(obj);
	}
	
	Application.LoadLevel("Menu");
};

private function StopGame() {
	CancelInvoke("Midnight");
	CancelInvoke("MidnightWarning");
    CancelInvoke("IncreaseGameClock");
    
    WaveSpawner.Get().Stop();
}

private function GameOver() {
	StopGame();
    var endMsg : String = "You managed the mall for " + _gameDays + " days!\nBetter luck next time.";
    ModalManager.Get().CreateButtonModal("Bankrupt!", endMsg, ExitGameFunc);
}

private function Win() {
	StopGame();
    var endMsg : String = "You saved $" + _winGoal.ToString("n0") + " in " + _gameDays + " days!\n See if you can beat it next time.";
    ModalManager.Get().CreateButtonModal("Winner!", endMsg, ExitGameFunc);
}

public function CheckForWin() {
	if (MoneyManager.Get().CheckMoney(_winGoal)) {
		// Player has won.
		Win();
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
	None,
	Lost
	
}
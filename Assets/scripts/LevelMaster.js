#pragma strict

private static var Instance : LevelMaster = null;
var _mallWidth : int;
var _mallHeight : int;
var _startTile : Tile;
var _endTile : Tile;
var _mask : LayerMask;
var _tiles : Tile[,];
var _path = new Array();
var _bankSprites : Sprite[];
var _wallSprite : Sprite;
var _gameTime : float;
var _secondsBetweenMidnight : int;
var _currentState : LevelStates;
private var _midnightTimer : float;
private var _curTimescale : float;

public static function Get() : LevelMaster

{
    return Instance;
}

public function LevelMaster()
{
    //if the constructor must be public, you can do this:
    if (Instance != null)
    {
    }
}

function Awake()
{
    Instance = this;
    _mallHeight += 2;	// Allow for the addition of the bank and the mall entrance.
    _midnightTimer = Time.time + _secondsBetweenMidnight;
    _currentState = LevelStates.None; // Should be NONE. Change when we actually have a building mode.
    _curTimescale = 1.0;

	CreateTiles();
	FloodFiller.Get().CreatePaths();
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
	_gameTime += Time.deltaTime;
	if(_midnightTimer < Time.time) {
		_midnightTimer = Time.time + _secondsBetweenMidnight;
		// fire midnight triggers.
		WaveSpawner.Get().MidnightTrigger();
	}
	/*if (Input.GetMouseButtonDown(0)) {
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	    var hit : RaycastHit2D = Physics2D.GetRayIntersection(ray, 100, _mask);
	    
	    if (hit && hit.transform.tag == "Tile") {
	    	var tile : Tile = hit.transform.GetComponent("Tile") as Tile;
	    	if(tile._isAvailable) {
	    		tile._occupied = true;
	    		var cop : GameObject = Instantiate(Resources.Load("EnglishBobby")) as GameObject;
	    		tile._occupiedUnit = cop.gameObject;
				cop.transform.position.x = tile.transform.position.x;
				cop.transform.position.y = tile.transform.position.y;
				FloodFiller.Get().CreatePaths();
	    	}
	    }
	}*/
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

public enum LevelStates{
	None
}
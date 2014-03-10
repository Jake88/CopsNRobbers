#pragma strict


private static var Instance : LevelMaster = null;
var _mallWidth : int;
var _mallHeight : int;
var _startTile : Tile;
var _endTile : Tile;
var _tiles : Tile[,];
var _path = new Array();
private var _astar : MyAStar;

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

	_tiles = new Tile[_mallWidth, _mallHeight];
		
	for (var x = 0; x < _mallWidth; x++) {
		for (var y = 0; y <  _mallHeight; y++) {
			var tile : GameObject = Instantiate(Resources.Load("Mall Tile"));
			tile.transform.position.x = x;
			tile.transform.position.y = y;
			
			var castedTile:Tile = tile.GetComponent("Tile");
			castedTile._x = x;
			castedTile._y = y;
		
			// check if this tile is the entrance or bank of the mall.
			if (y == 0 && x == Mathf.FloorToInt(_mallWidth/2)) {
				// center of the bottom row means this tile is the bank.
				tile.tag = ("EndTile");
				_endTile = castedTile;
			} else if (y == _mallHeight-1 && x == Mathf.FloorToInt(_mallWidth/2)) {
				// center of the top row means this tile is the entrance.
				tile.tag = ("StartTile");
				_startTile = castedTile;
			}
			
		_tiles[x, y] = castedTile;
		}
	}
	
	Debug.Log("_Tiles count : " + _tiles.length);
	
	
	MyAStar.Get().Init();
}

function Start() {
	
}

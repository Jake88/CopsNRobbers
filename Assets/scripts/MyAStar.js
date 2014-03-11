#pragma strict


class MyAStar

{
    private static var Instance : MyAStar=new MyAStar();
    var _openList = new Array();
	var _closedList = new Array();

    public static function Get(): MyAStar{
        return Instance;
    }

    private function MySingletonClass() {}
    
    function Init() {
		SetHScores();
		CreatePath();
	}

	function CreatePath() {
		Debug.Log("Creating path");
		LevelMaster.Get()._startTile._GScore = 0;
		_openList.Add(LevelMaster.Get()._startTile);
		CheckTilesRecursive();
		
		for (tile in LevelMaster.Get()._path) {
			Debug.Log(tile);
		}
	}



	function CheckTilesRecursive() : boolean {
		if(_openList.length < 1) {
			// Recursive loop finished. No path found.
			Debug.Log("Recursive loop finished. No path found.");
		} else {
			var tile : Tile = GetLowestFTile();
			_openList.Remove(tile);
			_closedList.Add(tile);
			
			if (IsInClosedList(LevelMaster.Get()._endTile._x, LevelMaster.Get()._endTile._y)) {
				// Path to end tile found.
				SetPath();
				return true;
			} else {
				//south
				if (IsValidTile(tile._x, tile._y-1)) {
					LevelMaster.Get()._tiles[tile._x, tile._y-1]._parentTile = tile;
					LevelMaster.Get()._tiles[tile._x, tile._y-1]._GScore = tile._GScore+1;
					LevelMaster.Get()._tiles[tile._x, tile._y-1]._FScore = tile._GScore+1 + LevelMaster.Get()._tiles[tile._x, tile._y-1]._HScore;
					_openList.Add(LevelMaster.Get()._tiles[tile._x, tile._y-1]);
				}
				//east
				if (IsValidTile(tile._x+1, tile._y)) {
					LevelMaster.Get()._tiles[tile._x+1, tile._y]._parentTile = tile;
					LevelMaster.Get()._tiles[tile._x+1, tile._y]._GScore = tile._GScore+1;
					LevelMaster.Get()._tiles[tile._x+1, tile._y]._FScore = tile._GScore+1 + LevelMaster.Get()._tiles[tile._x+1, tile._y]._HScore;
					_openList.Add(LevelMaster.Get()._tiles[tile._x+1, tile._y]);
				}
				//west
				if (IsValidTile(tile._x-1, tile._y)) {
					LevelMaster.Get()._tiles[tile._x-1, tile._y]._parentTile = tile;
					LevelMaster.Get()._tiles[tile._x-1, tile._y]._GScore = tile._GScore+1;
					LevelMaster.Get()._tiles[tile._x-1, tile._y]._FScore = tile._GScore+1 + LevelMaster.Get()._tiles[tile._x-1, tile._y]._HScore;
					_openList.Add(LevelMaster.Get()._tiles[tile._x-1, tile._y]);
				}
				//north
				if (IsValidTile(tile._x, tile._y+1)) {
					LevelMaster.Get()._tiles[tile._x, tile._y+1]._parentTile = tile;
					LevelMaster.Get()._tiles[tile._x, tile._y+1]._GScore = tile._GScore+1;
					LevelMaster.Get()._tiles[tile._x, tile._y+1]._FScore = tile._GScore+1 + LevelMaster.Get()._tiles[tile._x, tile._y+1]._HScore;
					_openList.Add(LevelMaster.Get()._tiles[tile._x, tile._y+1]);
				}
				
				CheckTilesRecursive();
			}
		}
	}

	function SetPath() {
		Debug.Log("Setting Path");
		var tile : Tile = LevelMaster.Get()._endTile;
		var sr : SpriteRenderer;

		while (tile.tag != "StartTile") {
			sr = tile.GetComponent("SpriteRenderer");
			sr.color = Color.blue;
			LevelMaster.Get()._path.Add(tile);
			tile = tile._parentTile;
		}
		sr = tile.GetComponent("SpriteRenderer");
		sr.color = Color.blue;
		LevelMaster.Get()._path.Add(tile);
		Debug.Log("Path Set. Path count: " + LevelMaster.Get()._path.length);
	}

	function GetLowestFTile() {
		var tile : Tile = _openList[0];
		for (var i = 1; i < _openList.length; i++) {
			var tileToTest : Tile = _openList[i];
			if (tile._FScore > tileToTest._FScore) {
				tile = tileToTest;
			}
		}
		return tile;
	}

	function IsValidTile(x:int, y:int) {
		Debug.Log("Checking if valid tile: X="+x + " Y="+y);
		// Check if the tile is within the bounds of the array.
		if(IsWithinGrid(x,y) && !IsOccupied(x,y) && !IsInClosedList(x,y) && !IsInOpenList(x,y)) {
			return true;
		}
		return false;
	}

	function IsInOpenList(x, y) {
		return LevelMaster.Get()._tiles[x, y] in _openList;
	}

	function IsInClosedList(x, y) {
		return LevelMaster.Get()._tiles[x, y] in _closedList;
	}

	function IsOccupied(x:int, y:int) {
		return LevelMaster.Get()._tiles[x, y]._occupied;
	}

	function IsWithinGrid(x:int, y:int) {
		return x < LevelMaster.Get()._mallWidth && x >= 0 && y < LevelMaster.Get()._mallHeight && y >= 0;
	}

	function SetHScores() {
		for (var tile in LevelMaster.Get()._tiles) {
			var x = Mathf.Abs(LevelMaster.Get()._endTile._x - tile._x);
			var y = Mathf.Abs(LevelMaster.Get()._endTile._y - tile._y);
			tile._HScore = x + y;
		}
	}
	
	function Reset() {
		_openList.Clear();
		_closedList.Clear();
	}
}
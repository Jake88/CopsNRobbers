#pragma strict
class FloodFiller {
    private static var Instance : FloodFiller=new FloodFiller();
   	var _openList = new Array();
   	var _closedList = new Array();

    public static function Get(): FloodFiller{
        return Instance;
    }

    private function FloodFiller() {
    }
    
    function CreatePaths() {
    	Reset();
    	// Create 'To Bank' path
    	SetDistance(LevelMaster.Get().GetEndTile());
    	_openList.Add(LevelMaster.Get().GetEndTile());
    	FillRecursive(false);
    	
    	Reset();
    	// Create 'To Exit' path
    	SetDistance(LevelMaster.Get().GetStartTile());
    	_openList.Add(LevelMaster.Get().GetStartTile());
    	FillRecursive(true);
    	
    	//Update the grid of available tiles.
    	SetAvailableTiles();
    }
    
    function SetAvailableTiles() {
    	for (var x = 0; x < LevelMaster.Get()._mallWidth; x++) {
			for (var y = 1; y < LevelMaster.Get(). _mallHeight-1; y++) {
				if(!LevelMaster.Get()._tiles[x,y]._occupied) {
					LevelMaster.Get()._tiles[x,y]._occupied = true;
					if(IsPathPossible()) {
						LevelMaster.Get()._tiles[x,y].SetAvailability(true);
					} else {
						LevelMaster.Get()._tiles[x,y].SetAvailability(false);
					}
					LevelMaster.Get()._tiles[x,y]._occupied = false;
				} else {
					LevelMaster.Get()._tiles[x,y].SetAvailability(false);
				}
			}
		}
    }
    
    private function FillRecursive(returning : boolean) {
    	if(_openList.length > 0) {
	    	var tile : Tile = GetLowestDistanceTile();
	    	_openList.Remove(tile);
	    	_closedList.Add(tile);
	    	
	    	var adjacentTile : Tile;
	    	//south
			if (IsValidTile(tile._x, tile._y-1)) {
				adjacentTile = LevelMaster.Get()._tiles[tile._x, tile._y-1];
				_openList.Add(adjacentTile);
				if (returning) {
					adjacentTile._nextTileToExit = tile;
				} else {
					adjacentTile._nextTileToBank = tile;
				}
			}
			//east
			if (IsValidTile(tile._x+1, tile._y)) {
				adjacentTile = LevelMaster.Get()._tiles[tile._x+1, tile._y];
				_openList.Add(adjacentTile);
				if (returning) {
					adjacentTile._nextTileToExit = tile;
				} else {
					adjacentTile._nextTileToBank = tile;
				}
			}
			//west
			if (IsValidTile(tile._x-1, tile._y)) {
				adjacentTile = LevelMaster.Get()._tiles[tile._x-1, tile._y];
				_openList.Add(adjacentTile);
				if (returning) {
					adjacentTile._nextTileToExit = tile;
				} else {
					adjacentTile._nextTileToBank = tile;
				}
			}
			//north
			if (IsValidTile(tile._x, tile._y+1)) {
				adjacentTile = LevelMaster.Get()._tiles[tile._x, tile._y+1];
				_openList.Add(adjacentTile);
				if (returning) {
					adjacentTile._nextTileToExit = tile;
				} else {
					adjacentTile._nextTileToBank = tile;
				}
			}
			
			FillRecursive(returning);
		}
    }
    
    function IsPathPossible() : boolean{
    	Reset();
    	_openList.Add(LevelMaster.Get().GetStartTile());
    	return CheckPathRecursive();
    }
    
    function CheckPathRecursive() : boolean {
    	var possible : boolean = false;
    	if(_openList.length > 0) {
	    	var tile : Tile = _openList[_openList.length-1] as Tile;
	    	_openList.Remove(tile);
	    	_closedList.Add(tile);
	    	
	    	//south
			if (IsValidTile(tile._x, tile._y-1)) {
				_openList.Add(LevelMaster.Get()._tiles[tile._x, tile._y-1]);
			}
			//east
			if (IsValidTile(tile._x+1, tile._y)) {
				_openList.Add(LevelMaster.Get()._tiles[tile._x+1, tile._y]);
			}
			//west
			if (IsValidTile(tile._x-1, tile._y)) {
				_openList.Add(LevelMaster.Get()._tiles[tile._x-1, tile._y]);
			}
			//north
			if (IsValidTile(tile._x, tile._y+1)) {
				_openList.Add(LevelMaster.Get()._tiles[tile._x, tile._y+1]);
			}
			
			if(IsInOpenList(LevelMaster.Get().GetEndTile()._x, LevelMaster.Get().GetEndTile()._y)) {
				possible =  true;
			} else {
				possible = CheckPathRecursive();
			}
		}
		return possible;
    }
    
    
    private function SetDistance(destinationTile : Tile) {
		for (var tile in LevelMaster.Get()._tiles) {
			var x = Mathf.Abs(destinationTile._x - tile._x);
			var y = Mathf.Abs(destinationTile._y - tile._y);
			tile._distance = x + y;
		}
	}
	
	private function GetLowestDistanceTile() {
		var tile : Tile = _openList[0] as Tile;
		for (var i = 1; i < _openList.length; i++) {
			var tileToTest : Tile = _openList[i] as Tile;
			if (tile._distance > tileToTest._distance) {
				tile = tileToTest;
			}
		}
		return tile;
	}
	
	private function IsValidTile(x:int, y:int) {
		// Check if the tile is within the bounds of the array.
		if(GameUtils.IsWithinGrid(x,y) && !GameUtils.IsOccupied(x,y) && !IsInClosedList(x,y) && !IsInOpenList(x,y)) {
			return true;
		}
		return false;
	}

	private function IsInOpenList(x:int, y:int) : boolean {
		return (LevelMaster.Get()._tiles[x, y] in _openList);
	}

	private function IsInClosedList(x:int, y:int) : boolean{
		return (LevelMaster.Get()._tiles[x, y] in _closedList);
	}
	
	function Reset() {
		_openList.Clear();
		_closedList.Clear();
	}
}
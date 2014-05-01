#pragma strict

public class GameUtils {
	public static function IsValidTile(x:int, y:int) {
		// Check if the tile is within the bounds of the array.
		if(IsWithinGrid(x,y) && !IsOccupied(x,y)) {
			return true;
		}
		return false;
	}

	public static function IsOccupied(x:int, y:int) : boolean{
		return LevelMaster.Get()._tiles[x, y]._occupied;
	}

	public static function IsWithinGrid(x:int, y:int) : boolean {
		return x < LevelMaster.Get()._mallWidth && x >= 0 && y < LevelMaster.Get()._mallHeight && y >= 0;
	}
	
	public static function CenterPointBetweenManyVectors(vecs : Vector3[]) : Vector3{
		var x : float = 0;
		var y : float = 0;
		
		// Find the min and max bounds of each vector
		for (var vec : Vector3 in vecs) {
			x += vec.x;
			y += vec.y;
		}
		
		x = x / vecs.Length;
		y = y / vecs.Length;
		
		return new Vector3(x, y, 0);
	}
	
	public static function CenterPointBetweenManyVectors(vecs : Vector2[]) : Vector2{
		var x : float = 0;
		var y : float = 0;
		
		// Find the min and max bounds of each vector
		for (var vec : Vector3 in vecs) {
			x += vec.x;
			y += vec.y;
		}
		
		x = x / vecs.Length;
		y = y / vecs.Length;
		
		return new Vector2(x, y);
	}
	
	public static function ShuffleArray(arr : Array) {
		var temp : Object;
		var randomArray = new Array();
		
		while (0 < arr.length) {
			var i = Random.Range(0, arr.length);
			temp = arr[i];
			arr.Remove(temp);
			randomArray.Add(temp);
		}
		return randomArray;
	}
	
	public static function DpiDifference() {
		var DEFAULT_DPI : float = 160;
		var dpiDifference : float;
		if ( Screen.dpi == 0 ) {
	    	dpiDifference = 1;
	    } else {
	     	dpiDifference = Screen.dpi / DEFAULT_DPI;
	    }
		return dpiDifference;
	}
    
	
}
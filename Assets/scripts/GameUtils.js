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
		var maxVec : Vector3 = vecs[0];
		var minVec : Vector3 = vecs[0];
		// Find the min and max bounds of each vector
		for (var vec : Vector3 in vecs) {
			if (vec.x < minVec.x){vec.x = minVec.x;}
			if (vec.y < minVec.y){vec.y = minVec.y;}
			if (vec.z < minVec.z){vec.z = minVec.z;}
			
			if (vec.x < maxVec.x){vec.x = maxVec.x;}
			if (vec.y < maxVec.y){vec.y = maxVec.y;}
			if (vec.z < maxVec.z){vec.z = maxVec.z;}
		}
		
		return maxVec - minVec;
	}
	
	public static function ShuffleArray(arr : Array) {
		var temp : Object;
		var randomArray = new Array();
		
		while (0 < arr.length) {
			Debug.Log(arr.length);
			var i = Random.Range(0, arr.length);
			temp = arr[i];
			arr.Remove(temp);
			randomArray.Add(temp);
		}
		return randomArray;
	}
	
}
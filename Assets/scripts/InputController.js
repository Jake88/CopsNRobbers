#pragma strict

private static var Instance : InputController = null;
var _mask : LayerMask;
private var _prevTile : Tile;

public static function Get() : InputController
{
    return Instance;
}

public function InputController()
{
}

function Awake()
{
    Instance = this;
}

function Update () {
	if (Input.GetMouseButton(0)) {
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	    var hit : RaycastHit2D = Physics2D.GetRayIntersection(ray, 100, _mask);
	    
	    if (hit && hit.transform.tag == "Tile") {
	    	var tile : Tile = hit.transform.GetComponent("Tile") as Tile;
	    	if(_prevTile == null || _prevTile != tile) { 
				_prevTile = tile;
	    		BuildManager.Get().CheckBuildPosition(tile);
	    	} else {
    			Debug.Log("checking");
    		}
	    }
	}
}
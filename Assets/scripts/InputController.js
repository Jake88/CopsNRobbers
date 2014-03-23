#pragma strict

private static var Instance : InputController = null;
var _mask : LayerMask;

public static function Get() : InputController

{
    return Instance;
}

public function InputController()
{
    //if the constructor must be public, you can do this:
    if (Instance != null)
    {
    }
}

function Awake()
{
    Instance = this;
}

function Start () {

}

function Update () {
	if (Input.GetMouseButtonDown(1)) {
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	    var hit : RaycastHit2D = Physics2D.GetRayIntersection(ray, 100, _mask);
	    
	    if (hit && hit.transform.tag == "Tile") {
	    	var tile : Tile = hit.transform.GetComponent("Tile") as Tile;
	    	
	    	switch(LevelMaster.Get()._currentState) {
	    		case LevelStates.Building :
	    			ShopBuilder.Get().Build(tile);
	    		break;
	    		case LevelStates.None :
	    		
	    		break;
	    	}
	    	//call static builder method and pass in the tile
	    }
	}
}
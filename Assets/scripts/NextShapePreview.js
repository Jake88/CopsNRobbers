#pragma strict

private static var Instance : NextShapePreview = null;
private static var SIZE : int = 4;
private var _tiles : GameObject[,];

public static function Get() : NextShapePreview

{
    return Instance;
}

public function NextShapePreview()
{
    //if the constructor must be public, you can do this:
    if (Instance != null)
    {
    }
}

function Awake()
{
    Instance = this;
    _tiles = new GameObject[SIZE, SIZE];
	CreateGrid();
	SetPosition();
}

public function ChangeShape(shape : Shape) {
	var vectors = _shapes[_nextShape].GetVectorArray();
	Clear();
	// Pick a 'start' or 'relative' tile
	
	// grab the tiles around it (from vectors array)
	
	// set their renderer.enabled to true
}

private function Clear() {
	for (var i = 0; i < SIZE; i++) {
		for(var j = 0; j < SIZE; j++) {
			_tiles[i,j].renderer.enabled = false;
		}
	}
}

private function SetPosition() {
	//position and scale this
	var screenPos : Vector3 = new Vector3(0.8, 0.5, 0);
	this.transform.position = Camera.main.ViewportToWorldPoint(screenPos);
	this.transform.position.z = 2;
	
	this.transform.localScale = new Vector3(0.5, 0.5, 1);
}

private function CreateGrid() {
	for (var i = 0; i < SIZE; i++) {
		for(var j = 0; j < SIZE; j++) {
			var go : GameObject = Instantiate(Resources.Load("TileOverlay")) as GameObject;
			go.transform.parent = this.transform;
			//gameObject.renderer.enabled = false;
			go.transform.position = new Vector3(-i, -j, 2);
			_tiles[i,j] = go;
		}
	}
}
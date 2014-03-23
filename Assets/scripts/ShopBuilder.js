#pragma strict

private static var Instance : ShopBuilder = null;
private static var SHAPE_COUNT : int = 7;
private static var _nextShape : int;
private static var _shapes : Shape[];

public static function Get() : ShopBuilder

{
    return Instance;
}

public function ShopBuilder()
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
	_shapes = new Shape[SHAPE_COUNT];
	_shapes[0] = new Shape("Zed");
	_shapes[1] = new Shape("ReverseZed");
	_shapes[2] = new Shape("Square");
	_shapes[3] = new Shape("Straight");
	_shapes[4] = new Shape("Tee");
	_shapes[5] = new Shape("El");
	_shapes[6] = new Shape("ReverseEl");
	NewNextShape();
}

function Update () {
}

function Build(selectedTile : Tile) {
	var vectors = _shapes[_nextShape].GetVectorArray();
	// Get the tiles relative to the selected tile
	var tiles = new Tile[Shape.TILES_PER_SHAPE];
	
	var positionToTest : Vector2;
	var validPos : boolean = true;
	
	for (var i = 0; i < vectors.length; i++) {
		var vec2 : Vector2 = vectors[i];
		positionToTest.x = selectedTile._x + vec2.x;
		positionToTest.y = selectedTile._y + vec2.y;
	
		if (GameUtils.IsValidTile(positionToTest.x, positionToTest.y)) {
			tiles[i] = LevelMaster().Get()._tiles[positionToTest.x,positionToTest.y];
		} else {
			validPos = false;
		}
	}
	
	if (validPos) {
		// are they all valid?
		for (var tile : Tile in tiles) {
			tile._occupied = true;
		}
		if(!FloodFiller.Get().IsPathPossible()) {
			for (var tile : Tile in tiles) {
				tile._occupied = false;
			}
			validPos = false;
		}
	}
	
	// are they all valid?
		// if yes: place the shop
	if (validPos) {
		var go : GameObject = Instantiate(Resources.Load("DansDiscountDoodadDen")) as GameObject;
		var shop : Shop = go.GetComponent("Shop") as Shop;
		shop.Init(tiles);
		FloodFiller.Get().CreatePaths();
		NewNextShape();
		// TODO set tile overlay to green and wait for confirm or cancel button.
	} else {
		// TODO set tile overlay to red and disable the confirm button.
	}
	
}

private function NewNextShape() {
	_nextShape = Random.Range(0, SHAPE_COUNT);
}
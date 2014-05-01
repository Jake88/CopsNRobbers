#pragma strict

private static var Instance : ShopBuilder = null;
private static var SHAPE_COUNT : int = 7;
private static var _nextShape : int;
private static var _shapes : Shape[];
private static var _tiles : Tile[];
private static var _validPos : boolean;

public static function Get() : ShopBuilder{return Instance;}
public function ShopBuilder(){}

function Awake()
{
    Instance = this;
    _tiles = new Tile[0];
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

function Build(selectedTile : Tile) : boolean {
	Reset();
	var vectors = _shapes[_nextShape].GetVectorArray();
	// Get the tiles relative to the selected tile
	_tiles = new Tile[Shape.TILES_PER_SHAPE];
	
	var positionToTest : Vector2;
	_validPos = true;
	
	for (var i = 0; i < vectors.length; i++) {
		var vec2 : Vector2 = vectors[i];
		positionToTest.x = selectedTile._x + vec2.x;
		positionToTest.y = selectedTile._y + vec2.y;
	
		if (GameUtils.IsValidTile(positionToTest.x, positionToTest.y)) {
			if(!LevelMaster().Get()._tiles[positionToTest.x,positionToTest.y]._isAvailable) {
				_validPos = false;
			}
			_tiles[i] = LevelMaster().Get()._tiles[positionToTest.x,positionToTest.y];
		} else {
			_validPos = false;
		}
	}
	
	// Even if all the tiles are available we need to check that
	// the shop doesn't block off the path completely.
	if (_validPos) {
		// are they all valid?
		for (var tile : Tile in _tiles) {
			tile._occupied = true;
		}
		if(!FloodFiller.Get().IsPathPossible()) {
			_validPos = false;
		}
		for (var tile : Tile in _tiles) {
			tile._occupied = false;
		}
	}
	
	// Was it a valid position
	if (_validPos) {
		for (var tile : Tile  in _tiles) {
			tile.Highlight(true);
		}
	} else {
		for (var tile : Tile in _tiles) {
			if(tile != null) {
				tile.Highlight(false);
			}
		}
	}
	return _validPos;
}

function ConfirmBuild(shopName : String) {
	for (var tile : Tile in _tiles) {
		tile._occupied = true;
	}
	var go : GameObject = Instantiate(Resources.Load(shopName)) as GameObject;
	var shop : Shop = go.GetComponent("Shop") as Shop;
	shop.Init(_tiles);
	FloodFiller.Get().CreatePaths();
	NewNextShape();
}

function NewNextShape() {
	Reset();
	_nextShape = Random.Range(0, SHAPE_COUNT);
	NextShapePreview.Get().ChangeShape(_shapes[_nextShape]);
}

function Rotate() {
	Reset();
	_shapes[_nextShape].Rotate();
	NextShapePreview.Get().ChangeShape(_shapes[_nextShape]);
}

function Reset() {
	for(var tile : Tile in _tiles) {
		if(tile != null) {
			tile.Unhighlight();
			tile = null;
		}
	}
	_tiles = new Tile[0];
}
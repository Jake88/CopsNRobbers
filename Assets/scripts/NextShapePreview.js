#pragma strict

private static var Instance : NextShapePreview = null;
var _previewBlocks : GUITexture[];

public static function Get() : NextShapePreview{ return Instance;}
public function NextShapePreview(){}

function Awake()
{
    Instance = this;
}

public function ChangeShape(shape : Shape) {
	// Get the shape positions as a 2D vector
	var vectors = shape.GetVectorArray();
	var vectors2D : Vector2[] = new Vector2[vectors.length];
	for (var i = 0; i < vectors.length; i++) {
		vectors2D[i] = vectors[i];
	}
	
	// Get the center point of the shape
	var centerPoint : Vector2 = GameUtils.CenterPointBetweenManyVectors(vectors2D);
	
	//Align the vectors to a center point.
	for (var j = 0; j < vectors2D.length; j++) {
		vectors2D[j].x -= centerPoint.x;
		vectors2D[j].y -= centerPoint.y;
	}
	
	//Position the boxes
	var boxSize : float = 6.0;
	var xOffset : float = -26;
	var yOffset : float = TopBarHandler.Get()._backgroundOffset + TopBarHandler.Get().GetHeight() - 26;
	for(var k = 0; k < vectors2D.length; k++) {
		var x : float = boxSize*vectors2D[k].x + xOffset;
		var y : float = boxSize*vectors2D[k].y + yOffset;
		_previewBlocks[k].pixelInset.x = x;
		_previewBlocks[k].pixelInset.y = y;
	}
}

public function Move(x : float, y : float) {
	for(var i = 0; i < _previewBlocks.length; i++) {
		_previewBlocks[i].pixelInset.x += x;
		_previewBlocks[i].pixelInset.y += y;
	}
}
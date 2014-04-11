#pragma strict

private static var Instance : NextShapePreview = null;
private var vectors2D : Vector2[];
var _previewBlocks : GUITexture[];

public static function Get() : NextShapePreview{ return Instance;}
public function NextShapePreview(){}

function Awake()
{
    Instance = this;
    
    
}

function Update() {
}

public function ChangeShape(shape : Shape) {
	var vectors = shape.GetVectorArray();
	vectors2D = new Vector2[vectors.length];
	for (var i = 0; i < vectors.length; i++) {
		vectors2D[i] = vectors[i];
	}
	
	var centerPoint : Vector2 = GameUtils.CenterPointBetweenManyVectors(vectors2D);
	
	//Align the vectors to a center point.
	for (var j = 0; j < vectors2D.length; j++) {
		vectors2D[j].x -= centerPoint.x;
		vectors2D[j].y -= centerPoint.y;
	}
	
	var boxSize : float = 6.0;
	for(var k = 0; k < vectors2D.length; k++) {
		var x : float = boxSize*vectors2D[k].x -26;
		var y : float = boxSize*vectors2D[k].y -26;
		_previewBlocks[k].pixelInset.x = x;
		_previewBlocks[k].pixelInset.y = y;
	}
}
#pragma strict

private static var Instance : NextShapePreview = null;
var _previewBlocks : GUITexture[];
var _rotateBtn : GUITexture;
var _newShapeBtn : GUITexture;
var _border : GUITexture;
var _label : GUIText;
var newShapeCost : int;
private var blockOffset : float = -26;
private var blockSize : float = 8;

public static function Get() : NextShapePreview{ return Instance;}
public function NextShapePreview(){}

function Awake()
{
    Instance = this;
    
    var diff : float = GameUtils.DpiDifference();
    
    blockOffset *= diff;
    blockSize *= diff;
    for (var i = 0; i < _previewBlocks.length; i++) {
    	_previewBlocks[i].pixelInset.width = blockSize;
    	_previewBlocks[i].pixelInset.height = blockSize;
    }
    
    _rotateBtn.pixelInset.height *= diff;
    _rotateBtn.pixelInset.width *= diff;
    _rotateBtn.pixelInset.x *= diff;
    _rotateBtn.pixelInset.y *= diff;
    
    _newShapeBtn.pixelInset.height *= diff;
    _newShapeBtn.pixelInset.width *= diff;
    _newShapeBtn.pixelInset.x *= diff;
    _newShapeBtn.pixelInset.y *= diff;
    
    _border.pixelInset.height *= diff;
    _border.pixelInset.width *= diff;
    _border.pixelInset.x *= diff;
    _border.pixelInset.y *= diff;
    
    _label.fontSize *= diff;
    _label.pixelOffset.x *= diff;
    _label.pixelOffset.y *= diff;
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
	var xOffset : float = blockOffset - 85*GameUtils.DpiDifference();
	var yOffset : float = TopBarHandler.Get()._backgroundOffset + TopBarHandler.Get().GetHeight() + blockOffset;
	for(var k = 0; k < vectors2D.length; k++) {
		var x : float = blockSize*vectors2D[k].x + xOffset;
		var y : float = blockSize*vectors2D[k].y + yOffset;
		_previewBlocks[k].pixelInset.x = x;
		_previewBlocks[k].pixelInset.y = y;
	}
}

public function Move(x : float, y : float) {
	for(var i = 0; i < _previewBlocks.length; i++) {
		_previewBlocks[i].pixelInset.x += x;
		_previewBlocks[i].pixelInset.y += y;
	}
	_rotateBtn.pixelInset.y += y;
    _newShapeBtn.pixelInset.y += y;
    _border.pixelInset.y += y;
    _label.pixelOffset.y += y;
}

var NewShapeFunc : Function = function() {
	if(MoneyManager.Get().AlterMoney(newShapeCost)) {
		ShopBuilder.Get().NewNextShape();
	}
};

public function Click(name : String) {
	switch (name) {
		case "RotateBtn" :
			ShopBuilder.Get().Rotate();
			break;
		case "NewShapeBtn" :
			ModalManager.Get().CreateTwoButtonModal("NEW BLUEPRINTS?",
					 "Are you sure you'd like to purchase\na random shape for $" + newShapeCost + "?",
					 null, NewShapeFunc);
			break;
	}
}
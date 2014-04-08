#pragma strict
import System.Xml;

public class Shape {
	static var TILES_PER_SHAPE : int = 4;
	private var _rotations : int;
	private var _currentRotation : int;
	private var _tiles : Vector2[,];
	var _name : String;
	
	public function Shape(shapeName : String) {
		_name = shapeName;
		var xmlDoc : XmlDocument = new XmlDocument();
	  	var ta : TextAsset = Resources.Load("Shapes");
		xmlDoc.LoadXml(ta.text);
	  	var root : XmlNode = xmlDoc.DocumentElement;
		root = root.SelectNodes("descendant::shape[@id='" + shapeName + "']")[0];
		
		if (root != null) {
			_currentRotation = 0;
			var rotationList : XmlNodeList;
	  		var vectorList : XmlNodeList;
	  		
	  		rotationList = root.SelectNodes("descendant::rotation");
	  		_rotations = rotationList.Count -1;
	  		_tiles = new Vector2[rotationList.Count, TILES_PER_SHAPE];
	  		
	  		var rotationIndex = 0;
	  		for (var rotation : XmlNode in rotationList)
	  		{
	  			vectorList = rotation.SelectNodes("descendant::tile");
	  			
	  			var vectorIndex = 0;
	  			for (var vector : XmlNode in vectorList)
	  			{
	  				var x = parseInt(vector.Attributes["x"].Value);
	  				var y = parseInt(vector.Attributes["y"].Value);
	  				
	  				_tiles[rotationIndex, vectorIndex] = new Vector2(x, y);
	  				vectorIndex ++;
	  			}
	  			rotationIndex++;
			}
		}
	}
	
	public function GetVectorArray() : Array {
		var arr = new Array();
		for (var i = 0; i < TILES_PER_SHAPE; i++) {
			arr.Add(_tiles[_currentRotation, i]);
		}
		return arr;
	}
	
	public function Rotate() {
		_currentRotation++;
		if (_currentRotation > _rotations) {
			_currentRotation = 0;
		}
	}
}
#pragma strict

public class StartTile extends Tile {

	private var _collisionCount : int;
	var _entranceSprites : Sprite[];
	
	function Start () {
		_collisionCount = 0;
	}

	function Update () {

	}

	function OnTriggerEnter2D (other : Collider2D) {
		if(other.transform.tag == "Robber") {
			if (_collisionCount < 1) {
				var sr : SpriteRenderer = this.GetComponent("SpriteRenderer") as SpriteRenderer;
				sr.sprite = _entranceSprites[1];
			}
			_collisionCount++;
		}
	}

	function OnTriggerExit2D (other : Collider2D) {
		if (other.transform.tag == "Robber") {
			_collisionCount--;
			if (_collisionCount < 1) { 
				var sr : SpriteRenderer = this.GetComponent("SpriteRenderer") as SpriteRenderer;
				sr.sprite = _entranceSprites[0];
			}
		}
	}
	
	function Highlight(valid : boolean) {}

	function Unhighlight() {}
	
	function ToggleOverlay() {}

}
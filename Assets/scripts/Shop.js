#pragma strict

public class Shop extends Building {
	var _tiles : Tile[];
	var _padydayEarnings : int;
	var _paydayCooldown : float;

	function Awake () {
		transform.renderer.enabled = false;
	}

	function Update () {

	}

	function Init(tiles : Tile[]) {
		// ENABLE THE RENDERER SO WE CAN SEE THE SHOP
		transform.renderer.enabled = true;
		// START THE TIMER FOR SHOP PAYDAY
		//SET THE POSITIONS OF CHILD SPRITES FOR SHOP
		//var vecs : Vector3[] = new Vector3[tiles.length];
		tiles = GameUtils.ShuffleArray(tiles);
		for (var i = 0; i < tiles.length; i++) {
			var shopTile : Transform = transform.GetChild(i);
			shopTile.position.x = tiles[i]._x;
			shopTile.position.y = tiles[i]._y;
			//vecs[i] = shopTile.position;
		}
		//transform.position = GameUtils.CenterPointBetweenManyVectors(vecs);
	}

	function Sell() {
		// Give player the money.
		MoneyManager.Get().AlterMoney(this._cost/2);
		for (var tile : Tile in _tiles) {
			tile._occupied = false;
			tile._occupiedUnit = null;
		}
		GameObject.Destroy(this.gameObject);
	}
}
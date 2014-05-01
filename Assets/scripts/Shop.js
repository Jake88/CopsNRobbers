#pragma strict

public class Shop extends Building {
	var _tiles : Tile[];
	var _padydayEarnings : int;
	var _paydayCooldown : float;
	var _center : Vector3;

	function Init(tiles : Tile[]) {
		//START THE TIMER FOR SHOP PAYDAY
		InvokeRepeating("Payday", _paydayCooldown, _paydayCooldown);
		//SET THE POSITIONS OF CHILD SPRITES FOR SHOP
		tiles = GameUtils.ShuffleArray(tiles);
		var vecs : Vector3[] = new Vector3[tiles.length];
		for (var i = 0; i < tiles.length; i++) {
			var shopTile : Transform = transform.GetChild(i);
			shopTile.position.x = tiles[i]._x;
			shopTile.position.y = tiles[i]._y;
			vecs[i] = shopTile.position;
		}
		
		_center = GameUtils.CenterPointBetweenManyVectors(vecs);
		_center.z = -2;
	}
	
	function Payday() {
		var go : GameObject = Instantiate(Resources.Load("CashWad")) as GameObject;
		var cash : CashWad = go.GetComponent("CashWad") as CashWad;
		cash.Init(_padydayEarnings, _center);
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
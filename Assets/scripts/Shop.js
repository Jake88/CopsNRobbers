#pragma strict

public class Shop extends Building {
	var _tiles : Tile[];
	var _padydayEarnings : int;
	var _paydayCooldown : float;
	private var _paydayTimer : float;
	var _center : Vector3;

	function Update () {
		if (Time.time > _paydayTimer) {
			_paydayTimer += _paydayCooldown + Random.Range(-_paydayCooldown*0.2, _paydayCooldown*0.2);
			var go : GameObject = Instantiate(Resources.Load("CashWad")) as GameObject;
			var cash : CashWad = go.GetComponent("CashWad") as CashWad;
			cash.Init(_padydayEarnings, _center);
		}
	}

	function Init(tiles : Tile[]) {
		//START THE TIMER FOR SHOP PAYDAY
		_paydayTimer = Time.time + _paydayCooldown;
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
		_center.z = -0.2;
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
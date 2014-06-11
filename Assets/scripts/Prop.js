#pragma strict

public class Prop extends Building {
	var _tile : Tile;

	function Sell() {
		// Give player the money.
		MoneyManager.Get().AddMoney(_cost * 0.5);
		_tile._occupied = false;
		_tile._occupiedUnit = null;
		GameObject.Destroy(this.gameObject);
	}
}
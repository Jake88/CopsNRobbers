#pragma strict

public class BuildingButton extends Button {
	var shopName : String;
	var cost : int;
	
	function Start() {
		this.label.text = cost.ToString("n0");
	}
}
#pragma strict

private static var Instance : InputController = null;
var _buildingMask : LayerMask;
var _normalMask : LayerMask;
private var _prevTile : Tile;
private var guiLayer : GUILayer;
private var prevButton : GUIElement;
private var hit : RaycastHit2D;
private var touchDevice : boolean = true;

public static function Get() : InputController{return Instance;}

public function InputController(){}

function Awake(){
	Instance = this;
	guiLayer = Camera.main.GetComponent(GUILayer);
	
	if (Input.mousePresent) {
		touchDevice = false;
	}
}

function Update () {
	var touchedOff : boolean;
	var touchPos : Vector3;
	var touchDown : boolean;
	if (touchDevice) {
		touchedOff = Input.touchCount > 0 && Input.touches[0].phase == TouchPhase.Ended;
		touchDown = Input.touchCount > 0;
		touchPos = Input.touches[0].position;
	} else {
		touchedOff = Input.GetMouseButtonUp(0);
		touchDown = Input.GetMouseButton(0);
		touchPos = Input.mousePosition;
	}

	if (touchedOff) {
		if (prevButton) {
			PressButton();
			prevButton.transform.localScale = Vector3.zero;
			prevButton = null;
		} else if (hit.transform.tag == "Cash") {
    		var cash : CashWad = hit.transform.GetComponent("CashWad") as CashWad;
    		cash.Collect();
    	}
		
	} else if (touchDown) {
		// Get the GUI Element we're touching (if we're touching one).
		var curButton : GUIElement = guiLayer.HitTest(touchPos);
		
		// Check that out selected GUI element exists and that it's not untagged (aka is not just a static texture)
		if (curButton != null && curButton.tag != "Untagged") {
			// If we don't already have a previous button selected OR the previous button is different to
			// our current button...
			if (!prevButton || curButton != prevButton) {
				// if we had a previous button, reset it's scale.
				ResetPrevButton();
				// set the new button's scale slightly higher to indicated a pressed state.
				curButton.transform.localScale += Vector3(0.01,0.01,0.01);
				prevButton = curButton;
			}
		} else {
			// if we had a previous button selected, reset it.
			ResetPrevButton();
			var ray : Ray = Camera.main.ScreenPointToRay(touchPos);
			if (Time.timeScale > 0) {
		    	hit = Physics2D.GetRayIntersection(ray, 100, _normalMask);
		    } else {
		    	hit = Physics2D.GetRayIntersection(ray, 100, _buildingMask);
		    }
		    
		    if (hit && GUIUtility.hotControl == 0) {
		    	if (hit && hit.transform.tag == "Tile") {
			    	var tile : Tile = hit.transform.GetComponent("Tile") as Tile;
			    	if(_prevTile == null || _prevTile != tile) { 
						_prevTile = tile;
			    		BuildManager.Get().CheckBuildPosition(tile);
			    	}
			    }
		    }
	    }
	} else {
		ResetPrevButton();
	}
}

// Work out what button was pressed and call the click event
// of the handler class of that button.
private function PressButton() {
	Debug.Log(prevButton.name);
	switch (prevButton.tag) {
		case "TopBarGUI" :
			TopBarHandler.Get().Click(prevButton.name);
			break;
		case "BottomBuildGUI" :
			BuildManager.Get().Click(prevButton.name);
			break;
		case "NewShapePreviewGUI" :
			NextShapePreview.Get().Click(prevButton.name);
			break;
		case "ModalGUI" :
			ModalManager.Get().Click(prevButton.name);
			break;
	}
}

private function ResetPrevButton() {
	if (prevButton) {
		prevButton.transform.localScale = Vector3.zero;
		prevButton = null;
	}
}
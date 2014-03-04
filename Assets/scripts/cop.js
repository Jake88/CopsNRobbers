#pragma strict

var cost : float;
var minDamage : float;
var maxDamage : float;
var attackRange : float;
var attackSpeed : float;

var target : Transform;

// Sprites
var _spriteUp : Sprite;
var _spriteDown : Sprite;
var _spriteLeft : Sprite;
var _spriteRight : Sprite;


function Start () {
}



function OnTriggerStay2D (other : Collider2D) {
	// check if the Collider is a robber and make sure we don't already have a target
	if(other.gameObject.tag == "Robber" && !target) {
		// set this Collider as our target
		target = other.gameObject.transform;
	}
		
}

function OnTriggerExit (other : Collider) {
	// check if the Collider is our current target
	if (other.gameObject.transform == target) {
		// Set target to null
		target = null;
	}
}

function Update () {
	// check if we have a traget
	if (target) {
		// aim at robber
		//var rotation : Quaternion = Quaternion.LookRotation(target.position - transform.position, transform.TransformDirection(Vector3.up));
        //transform.rotation = new Quaternion(0, 0, rotation.z, rotation.w);
        
        //NEED TO SUSS THIS CRAZY SHIT OUT. transform.rotation.z returns 0 - 1 but that's 180, then in reverse 1-0 for -180.
        /*transform.Rotate(0, 0, -.1f);
        Debug.Log(transform.rotation.z);
        if (transform.rotation.z >= .125 && transform.rotation.z < .375) {
        	Debug.Log("down");
        	GetComponent(SpriteRenderer).sprite = _spriteDown;
        } else if (transform.rotation.z >= .375 && transform.rotation.z < .625) {
        	Debug.Log("right");
        	 GetComponent(SpriteRenderer).sprite = _spriteRight;
        } else if (transform.rotation.z >= .625 && transform.rotation.z < .875) {
        	Debug.Log("up");
        	GetComponent(SpriteRenderer).sprite = _spriteUp;
        } else {
        	Debug.Log("left");
        	GetComponent(SpriteRenderer).sprite = _spriteLeft;
        }*/
        
		// if so check if we are off attack cooldown
			// attack()
	}
}

function Attack() {
	// check if we have a target
		// check to see what damage between min - max we will deal
		// call the targets TakeDamage function and pass in the damage value
			// If the take damage function returns true(target is dead), set target to null.
		// call the fire animation of this tower
}
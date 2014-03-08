#pragma strict

var _cost : float;
var _minDamage : float;
var _maxDamage : float;
var _attackRange : float;
var _attackSpeed : float;


private var _target : Transform;
private var _attackCooldown : float;
private var _anim : Animator;

function Start () {
}



function OnTriggerStay2D (other : Collider2D) {
	// check if the Collider is a robber and make sure we don't already have a target
	if(other.gameObject.tag == "Robber" && !_target) {
		// set this Collider as our target
		_target = other.gameObject.transform;
	}
		
}

function OnTriggerExit (other : Collider) {
	// check if the Collider is our current target
	if (other.gameObject.transform == _target) {
		// Set target to null
		_target = null;
	}
}

function Update () {
	// check if we have a traget
	if (_target) {
		// aim at robber
		var rotation : Quaternion = Quaternion.LookRotation(_target.position - transform.position, transform.TransformDirection(Vector3.up));
        transform.rotation = new Quaternion(0, 0, rotation.z, rotation.w);
       
		// if so check if we are off attack cooldown
		if (Time.time > _attackCooldown){
			// attack()
		}
	}
}

function Attack() {
	// check if we have a target
		// check to see what damage between min - max we will deal
		// call the targets TakeDamage function and pass in the damage value
			// If the take damage function returns true(target is dead), set target to null.
		// call the fire animation of this tower
}
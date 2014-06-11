#pragma strict

public class Cop extends Building {
	var _minDamage : float;
	var _maxDamage : float;
	var _attackSpeed : float;
	var _tile : Tile;

	protected var _targets = new Array();
	protected var _target : Robber;
	protected var _attackCooldown : float;
	protected var _anim : Animator;

	function Start () {
		_attackCooldown = Time.time;
		_attackSpeed /= 3;
	}

	function OnTriggerEnter2D (other : Collider2D) {
		// check if the Collider is a robber and make sure we don't already have a target
		if(other.gameObject.tag == "Robber") {
			// set this Collider as our target
			var rob : Robber = other.gameObject.GetComponent("Robber");
			if (!rob._sneaky) {
				_targets.Add(rob);
			}
		}
	}

	function OnTriggerExit2D (other : Collider2D) {
		// check if the Collider is our current target
		if (other.gameObject.tag == "Robber") {
			// Set target to null
			var rob : Robber = other.gameObject.GetComponent("Robber");
			if (!rob._sneaky) {
				_targets.Remove(other.gameObject.GetComponent("Robber"));
				SetTarget();
			}
		}
	}

	function SetTarget() {
		 _target = null;
		
		for (var current : Robber in _targets) {
			if (!_target || _target._curHP > current._curHP) {
				_target = current;
			}
		}
	}

	function Update () {
		// check if we have a traget
		if (_target) {
			// aim at robber
			   	transform.rotation = Quaternion.LookRotation(Vector3.forward, _target.transform.position - transform.position);
	       
			// if so check if we are off attack cooldown
			if (Time.time > _attackCooldown){
				Attack();
			}
		} else {
			SetTarget();
		}
	}

	function Attack() {
		// check if we have a target
		if (_target) {
			// check to see what damage between min - max we will deal
			var dmg = Random.Range(_minDamage, _maxDamage);
			// call the targets TakeDamage function and pass in the damage value
			var rob : Robber = _target.GetComponent("Robber") as Robber;
			if(rob.TakeDamage(dmg)) {
				// If the take damage function returns true(target is dead), set target to null.
				_target = null;	
			}
			
			_attackCooldown = Time.time + _attackSpeed;
			// call the fire animation of this tower
		}
	}
	
	function Sell() {
		// Give player the money.
		MoneyManager.Get().AddMoney(_cost * 0.5);
		_tile._occupied = false;
		_tile._occupiedUnit = null;
		GameObject.Destroy(this.gameObject);
	}
}
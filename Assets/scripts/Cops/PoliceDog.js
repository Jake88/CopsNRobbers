#pragma strict

public class PoliceDog extends Cop {
	function OnTriggerEnter2D (other : Collider2D) {
		// check if the Collider is a robber and make sure we don't already have a target
		if(other.gameObject.tag == "Robber") {
			// set this Collider as our target
			var rob : Robber = other.gameObject.GetComponent("Robber");
			_targets.Add(rob);
		}
	}

	function OnTriggerExit2D (other : Collider2D) {
		// check if the Collider is our current target
		if (other.gameObject.tag == "Robber") {
			// Set target to null
			var rob : Robber = other.gameObject.GetComponent("Robber");
			_targets.Remove(other.gameObject.GetComponent("Robber"));
			SetTarget();
		}
	}
	
	function Attack() {
		// check if we have a target
		if (_target) {
			var slow : boolean = true;
			// check to see what damage between min - max we will deal
			var dmg = Random.Range(_minDamage, _maxDamage);
			
			//If the target is weak to the police dog
			if(_target.name == "CatBurgerler") {
				dmg *= 2;
			}
			
			// call the targets TakeDamage function and pass in the damage value
			var rob : Robber = _target.GetComponent("Robber") as Robber;
			rob.Slow();
			if(rob.TakeDamage(dmg)) {
				// If the take damage function returns true(target is dead), set target to null.
				_target = null;	
			}
			
			_attackCooldown = Time.time + _attackSpeed;
			// call the fire animation of this tower
			_attackSprite.enabled = true;
			Invoke("HideAttackSprite", .2);
		}
	}
}
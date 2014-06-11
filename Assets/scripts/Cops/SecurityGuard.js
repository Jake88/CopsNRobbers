#pragma strict

public class SecurityGuard extends Cop {
	function Attack() {
		// check if we have a target
		if (_target) {
			var slow : boolean = true;
			// check to see what damage between min - max we will deal
			var dmg = Random.Range(_minDamage, _maxDamage);
			// call the targets TakeDamage function and pass in the damage value
			var rob : Robber = _target.GetComponent("Robber") as Robber;
			rob.Stun();
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
#pragma strict

private static var Instance : WaveSpawner = null;
var _waves : String[];
var _curDifficulty : int;
var _timeBetweenSpawns : int;
var _spawnRandomness : float;
var _spawnDelay : float;
private var _spawnTimer : float;


public static function Get() : WaveSpawner

{
    return Instance;
}

public function WaveSpawner()
{
    //if the constructor must be public, you can do this:
    if (Instance != null)
    {
    }
}

function Awake() {
	Instance = this;
}

function Start () {
	_spawnTimer = Time.time + _spawnDelay;
}

function Update () {
	if (_spawnTimer < Time.time) {
		_spawnTimer = Time.time + _timeBetweenSpawns + Random.Range(-_spawnRandomness, _spawnRandomness);
		// spawn an enemy based on current difficulty
	}
}

public function MidnightTrigger() {
	Debug.Log("spawn the midnight wave");
}
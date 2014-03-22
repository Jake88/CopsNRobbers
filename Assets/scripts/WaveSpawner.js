#pragma strict

private static var Instance : WaveSpawner = null;
var _curDifficulty : int;
var _timeBetweenSpawns : int;
var _genericSpawnRandomness : float;
var _firstSpawnDelay : float;
private var _spawnTimer : float;
private var _spawnList = new Array();
private var _spawnDelay : float = 0;




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
	_spawnTimer = Time.time + _firstSpawnDelay;
}

function Update () {
	if (_spawnTimer < Time.time) {
		_spawnTimer = Time.time + _timeBetweenSpawns + Random.Range(-_genericSpawnRandomness, _genericSpawnRandomness);
		// add a robber to the spawn list based on the generic wave list
		var wave = WaveLoader._genericWaves[_curDifficulty];
		for(var name : String in wave.robberNames) {
			_spawnList.Add(name);
			
			Debug.Log(_spawnList.length);
		}
	}
	
	if (_spawnList.length > 0 && Time.time > _spawnDelay) {
		_spawnDelay = Time.time + 0.2f;
		Instantiate(Resources.Load(_spawnList[_spawnList.length-1] as String));
		_spawnList.pop();
	}
}

public function MidnightTrigger() {
	Debug.Log("spawn the midnight wave");
	var wave = WaveLoader._levelWaves[_curDifficulty];
	
	for(var name : String in wave.robberNames) {
		_spawnList.Add(name);
		Debug.Log(_spawnList.length);
	}
}
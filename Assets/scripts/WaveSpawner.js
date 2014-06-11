#pragma strict

private static var Instance : WaveSpawner = null;
var _curDifficulty : int;
var _timeBetweenSpawns : int;
var _firstSpawnDelay : float;
private var _spawnList = new Array();


public static function Get() : WaveSpawner{return Instance;}
public function WaveSpawner(){}

function Awake() {
	Instance = this;
	_curDifficulty=0;
}

function Start () {
	InvokeRepeating("AddGeneric", _firstSpawnDelay, _timeBetweenSpawns);
	InvokeRepeating("SpawnFromList", _firstSpawnDelay, 0.3f);
}

function Stop() {
	CancelInvoke("AddGeneric");
	CancelInvoke("SpawnFromList");
}

private function AddGeneric() {
	var wave = WaveLoader._genericWaves[_curDifficulty];
	for(var name : String in wave.robberNames) {
		_spawnList.Add(name);
	}
}

public function MidnightTrigger() {
	var wave = WaveLoader._levelWaves[_curDifficulty];
	
	for(var name : String in wave.robberNames) {
		_spawnList.Add(name);
	}
	
	if(_curDifficulty < WaveLoader._levelWaves.length-1) {
		_curDifficulty++;
		Debug.Log("_curDifficulty " + _curDifficulty);
	}
}

private function SpawnFromList() {
	if (_spawnList.length > 0) {
		Instantiate(Resources.Load(_spawnList[_spawnList.length-1] as String));
		_spawnList.pop();
	}
}
#pragma strict

import System.Xml;

static var _waves : Wave[,];

function Start () {
	var xmlDoc : XmlDocument = new XmlDocument();
  	xmlDoc.Load("Assets/other/Waves.xml");
  	
  	var nodeList : XmlNodeList;

    var root : XmlNode = xmlDoc.DocumentElement;
  	var difficultyList : XmlNodeList = root.SelectNodes("descendant::difficulty");
  	var waveList : XmlNodeList;
  	var robberList : XmlNodeList;
  	
  	var difficultyCount = difficultyList.Count;
  	var possibleWaveCount = parseInt(root.Attributes["possibleWavesPerDifficulty"].Value);
  	_waves = new Wave[difficultyCount,possibleWaveCount];
  	
  	var difficultyIndex = 0;
  	for (var difficulty : XmlNode in difficultyList)
  	{
  		waveList = difficulty.SelectNodes("descendant::wave");
  		var waveIndex = 0;
	  	for (var wave : XmlNode in waveList)
	  	{
	  		_waves[difficultyIndex, waveIndex] = new Wave();
	  		robberList = wave.SelectNodes("descendant::robber");
	  		for (var robber : XmlNode in robberList) {
	  			var name = robber.Attributes["name"].Value;
	  			var amt = parseInt(robber.Attributes["amount"].Value);
	  			for ( var i = 0; i < amt; i++) {
	  				_waves[difficultyIndex, waveIndex].robberNames.Add(name);
	  			}
	  		}
	  		waveIndex++;
	  	}
  		difficultyIndex++;
  	}
}

function Update () {
} 
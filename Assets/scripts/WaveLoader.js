#pragma strict

import System.Xml;

static var _genericWaves : Wave[];
static var _levelWaves : Wave[];

var levelWaveFilename : String;

function Start () {
	LoadGenericWaves();
	LoadLevelWaves();
}

private function LoadGenericWaves() {
	var xmlDoc : XmlDocument = new XmlDocument();
  	var ta : TextAsset = Resources.Load("GenericWaves");
	xmlDoc.LoadXml(ta.text);
  	var root : XmlNode = xmlDoc.DocumentElement;
  	var waveList : XmlNodeList;
  	var robberList : XmlNodeList;
  	
	waveList = root.SelectNodes("descendant::wave");
	_genericWaves = new Wave[waveList.Count];
	
	var waveIndex = 0;
  	for (var wave : XmlNode in waveList)
  	{
  		_genericWaves[waveIndex] = new Wave();
  		robberList = wave.SelectNodes("descendant::robber");
  		for (var robber : XmlNode in robberList) {
  			var name = robber.Attributes["name"].Value;
  			var amt = parseInt(robber.Attributes["amount"].Value);
  			for ( var i = 0; i < amt; i++) {
  				_genericWaves[waveIndex].robberNames.Add(name);
  			}
  		}
  		waveIndex++;
  	}
}

private function LoadLevelWaves() {
	var xmlDoc : XmlDocument = new XmlDocument();
	var ta : TextAsset = Resources.Load(levelWaveFilename);
	xmlDoc.LoadXml(ta.text);
  	var root : XmlNode = xmlDoc.DocumentElement;
  	var waveList : XmlNodeList;
  	var robberList : XmlNodeList;
  	
	waveList = root.SelectNodes("descendant::wave");
	_levelWaves = new Wave[waveList.Count];
	
	var waveIndex = 0;
  	for (var wave : XmlNode in waveList)
  	{
  		_levelWaves[waveIndex] = new Wave();
  		robberList = wave.SelectNodes("descendant::robber");
  		for (var robber : XmlNode in robberList) {
  			var name = robber.Attributes["name"].Value;
  			var amt = parseInt(robber.Attributes["amount"].Value);
  			for ( var i = 0; i < amt; i++) {
  				_levelWaves[waveIndex].robberNames.Add(name);
  			}
  		}
  		waveIndex++;
  	}
}
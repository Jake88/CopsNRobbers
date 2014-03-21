#pragma strict

import System.Xml;

static var _genericWaves : Wave[];
static var _levelWaves : Wave[];

var levelWaveFilename : String;

function Start () {
	
}

private function LoadGenericWaves() {
	var xmlDoc : XmlDocument = new XmlDocument();
  	xmlDoc.Load("Assets/other/waves/GenericWaves");
  	LoadWaves(xmlDoc, _genericWaves);
}

private function LoadLevelWaves() {
	var xmlDoc : XmlDocument = new XmlDocument();
  	xmlDoc.Load("Assets/other/waves/" + levelWaveFilename);
  	LoadWaves(xmlDoc, _levelWaves);
}

private function LoadWaves(xmlDoc : XmlDocument, waves : Wave[]) {
	

    var root : XmlNode = xmlDoc.DocumentElement;
  	var waveList : XmlNodeList;
  	var robberList : XmlNodeList;
  	
	waveList = root.SelectNodes("descendant::wave");
	waves = new Wave[waveList.Count];
	
	var waveIndex = 0;
  	for (var wave : XmlNode in waveList)
  	{
  		waves[waveIndex] = new Wave();
  		robberList = wave.SelectNodes("descendant::robber");
  		for (var robber : XmlNode in robberList) {
  			var name = robber.Attributes["name"].Value;
  			var amt = parseInt(robber.Attributes["amount"].Value);
  			for ( var i = 0; i < amt; i++) {
  				waves[waveIndex].robberNames.Add(name);
  			}
  		}
  		waveIndex++;
  	}
}

function Update () {
} 
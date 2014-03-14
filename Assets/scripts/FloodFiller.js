#pragma strict
class FloodFiller

{
    private static var Instance : FloodFiller=new FloodFiller();
    private _openList

    public static function Get(): FloodFiller{
        return Instance;
    }

    private function FloodFiller() {}
    
    function Fill() {
    	LevelMaster.Get()._tiles
    }
}
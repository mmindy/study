class Board {
	constructor (width, height) {
		this.width = width;
		this.height = height;
		this.tiles = [];
		this.initialize();
	}

	initialize() {
		for ( let i = 0; i < this.width; i++){
			this.tiles[i] = [];
			for ( let j = 0; j < this.height; j++) {
				this.tiles[i][j] = new Tile();
			}
		}
	}

	getTile(x, y) {
		return this.tiles[x-1][y-1];
	}

	addUnit(unit, x, y) {
		let tiles = getTile(x,y);
		tiles.addUnit(unit);
	}

	removeUnit(unit, x, y) {
		let tiles = getTile(x,y);
		tiles.removeUnit(unit);
	}

	removeUnits(x, y) {
		let tiles = getTile(x,y);
		tiles.removeUnits();
	}

	getUnits(x, y) {
		let tiles = getTile(x,y);
		return tiles.getUnits();
	}

}

class Unit {
	constructor() {  }
}

class Tile {
	constructor() {
		this.units = new Set();
	}

	addUnit(unit){
		units.add(unit)
	}

	removeUnit(unit) {
		units.delete(unit);
	}

	removeUnits() {
		units.clear();
	}

	getUnits() {
		return this.units;
	}

}

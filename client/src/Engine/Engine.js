import Player from '../Objects/Player';
import Terrain from '../Objects/Terrain';

// Class Representing the Engine
export default class Engine {
	constructor(renderer) {
		// Instance of Renderer class
		this.renderer = renderer;
		// Instance of the Terrain class
		this.terrain = undefined;
		// List of all players. {Player.id: Player}
		this.players = {};
	}

	/**
	 * Adds a terrain to the game.
	 * @param {Terrain} terrain An instance of Terrain object ot add.
	 */
	registerTerrain(terrain) {
		const backgroundCanvas = this.renderer.getLayer('Background');
		const backgroundCanvasContext = backgroundCanvas.getContext();

		terrain.setContext(backgroundCanvasContext);
		terrain.genTerrain();
		this.terrain = terrain;
	}

	/**
	 * Adds a player to the game.
	 * @param {Player} player An instance of Player object ot add.
	 */
	registerPlayer(player) {
		const spriteCanvas = this.renderer.getLayer('Sprite');
		const spriteCanvasContext = spriteCanvas.getContext();

		player.setContext(spriteCanvasContext);
		player.addDomNode();
		this.players[player.id] = player;
	}

	registerBackground(nodes, seed) {
		const backgroundCanvas = this.renderer.getLayer('Background');
		backgroundCanvas.scatterNodes(nodes, seed);
	}

	/**
	 * Updates current list of players with a new list of Players.
	 * @param {Array<Object>} players Array of players to update current list of players with.
	 */
	updatePlayers(players) {
		console.log('up', players);
		Object.values(this.players).forEach((p) => {
			p.removeDomNode();
		});
		this.players = {};
		players.forEach((p) => {
			this.registerPlayer(
				new Player({
					id: p.id,
					position: p.position,
					rotation: p.rotation,
				})
			);
		});
	}

	/**
	 * Updates a single player in the players list
	 * @param {Object} Player to update in the players list
	 */
	updatePlayer(player) {
		if (this.players[player.id]) {
			this.players[player.id].removeDomNode();
			this.players[player.id] = undefined;
			this.registerPlayer(
				new Player({
					id: player.id,
					position: player.position,
					rotation: player.rotation,
				})
			);
		}
	}

	/**
	 * Runs every frame. Calls update method of all players.
	 * @param {Number} dt Delta-time.
	 */
	update(dt) {
		if (this.terrain) {
			if (this.terrain.needsUpdate) {
				this.terrain.drawTerrain(this.terrain.heightBuffer);
				this.terrain.needsUpdate = false;
			}
		}

		Object.values(this.players).forEach((p) => {
			p.update();
		});
	}
}

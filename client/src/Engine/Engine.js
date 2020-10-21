import Player from '../Objects/Player';
import Terrain from '../Objects/Terrain';

// Class Representing the Engine
export default class Engine {
	constructor(renderer, me) {
		// Instance of Renderer class
		this.renderer = renderer;
		// Instance of the Terrain class
		this.terrain = [];
		// List of all players. {Player.id: Player}
		this.players = {};
		// Get Update function
		this.updateHUD = () => {};

		this.offset = 0;
		this.dOffset = 0;
		this.pOffset = 0;

		this.me = me;
		this.width = window.innerWidth;
	}

	registerHUD(HUD) {
		const HUDCanvas = this.renderer.getLayer('HUD');
		const HUDCanvasContext = HUDCanvas.getContext();

		HUD.setContext(HUDCanvasContext);
		this.updateHUD = HUD.update.bind(HUD);
	}

	/**
	 * Adds a terrain to the game.
	 * @param {Terrain} terrain An instance of Terrain object ot add.
	 */
	registerTerrain(terrain) {
		const terrainCanvas = this.renderer.getLayer('Terrain');
		const terrainCanvasContext = terrainCanvas.getContext();

		terrain.setContext(terrainCanvasContext);
		terrain.genNode();
		this.terrain.push(terrain);
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
			const pos0 = this.players[player.id].position;

			this.players[player.id].removeDomNode();
			this.players[player.id] = undefined;

			if (player.id === this.me) {
				this.offset = player.position.x - pos0.x;
				player.position.x = this.width / 4;

				this.terrain[0].needsUpdate = true;
				this.terrain[1].needsUpdate = true;
			} else {
				player.position.x -= this.offset;
			}

			this.registerPlayer(
				new Player({
					id: player.id,
					position: player.position,
					rotation: player.rotation,
					fuel: player.fuel,
					updateHUD: this.updateHUD,
				})
			);

			this.dOffset = this.offset - this.pOffset;
			this.pOffset = this.offset;
		}
	}

	/**
	 * Runs every frame. Calls update method of all players.
	 * @param {Number} dt Delta-time.
	 */
	update(dt) {
		if (this.terrain) {
			this.terrain.forEach((t) => {
				if (t.needsUpdate) {
					t.drawTerrain(this.offset);
					t.needsUpdate = false;
				}
			});
		}

		Object.values(this.players).forEach((p) => {
			p.update();
		});
	}
}

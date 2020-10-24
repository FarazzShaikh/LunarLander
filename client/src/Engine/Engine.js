import Player from '../Objects/Player';
import Terrain from '../Objects/Terrain';

// Class Representing the Engine
export default class Engine {
	constructor(renderer, me) {
		this.d0 = Date.now();
		this.renderer = renderer;
		this.me = me;
		this.isAnchored = false;

		this.terrain = [];
		this.offset = 0;
		this.pOffset = -1;

		this.players = {};
	}

	addNodes(nodes, layers) {
		nodes.forEach((n, i) => {
			if (layers[i] === 'Terrain') {
				this.terrain.push(n);
			}
			if (layers[i] === 'Players') {
				this.players[n.name] = n;
			}
			this.renderer.addNode(layers[i], n);
		});
	}

	setAnchor(anchor) {
		this.isAnchored = true;
		this.renderer.setAnchor(anchor);
	}

	applyController(input) {
		this.players[this.me].setBoostState(input);
	}

	/**
	 * Updates current list of players with a new list of Players.
	 * @param {Array<Object>} players Array of players to update current list of players with.
	 */
	updatePlayers(players) {
		Object.values(this.players).forEach((p) => {
			p.removeDomNode();
			this.renderer.removeNode(p.id);
		});

		this.players = {};

		players.forEach((p) => {
			this.addNodes(
				[
					new Player({
						id: p.id,
						position: p.position,
						rotation: p.rotation,
					}),
				],
				['Players']
			);
		});

		this.setAnchor(`Players-${this.players[this.me].name}`);
	}

	updatePlayer(player) {
		if (player.id !== this.me) {
			if (this.players[player.id]) {
				this.players[player.id].transform({
					position: {
						x: player.position.x + window.innerWidth / 2,
						y: player.position.y,
					},
					rotation: player.rotation,
				});
			}
			return;
		}
		if (this.players[player.id]) {
			this.players[player.id].transform({
				position: player.position,
				rotation: player.rotation,
			});
		}
	}

	update() {
		const dt = this._tick() / 1000;
		this.dt = dt;
		if (this.isAnchored) {
			const me = this.players[this.me];
			this.offset = me.position.x;
			if (this.pOffset !== this.offset) {
				this.terrain[0].needsUpdate = true;
				this.terrain[1].needsUpdate = true;
				this.pOffset = this.offset;
			}
		}

		this.terrain.forEach((t) => {
			if (t.needsUpdate) {
				t.drawTerrain(this.offset);
				t.needsUpdate = false;
			}
		});

		this.renderer.render(this.offset);
	}

	/**
	 * @private Used to calculate delta-time (dt, time between consecutive ticks)
	 */
	_tick() {
		var now = Date.now();
		var dt = now - this.d0;
		this.d0 = now;
		return dt;
	}
}

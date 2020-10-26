import { EVENTS } from '../../../shared/Consts';
import CrashedShip from '../Objects/CrashedShip';
import Player from '../Objects/Player';
import Terrain from '../Objects/Terrain';

// Class Representing the Engine
export default class Engine {
	constructor(renderer, me, socket) {
		this.d0 = Date.now();

		this.socket = socket;
		this.renderer = renderer;
		this.me = me;
		this.isAnchored = false;

		this.terrain = [];
		this.offset = 0;
		this.pOffset = -1;

		this.players = {};
		this.ships = [];
		this.radar = null;
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

	getNode(name) {
		return this.renderer.getNode(name);
	}

	setAnchor(anchor) {
		this.isAnchored = true;
		this.renderer.setAnchor(anchor);
	}

	setRadar(radar) {
		this.radar = radar;
	}

	applyController(input) {
		this.players[this.me].setBoostState(input);
	}

	collectResource(ship) {
		this.renderer.removeNode(`CrashedShips-${ship.name}`);

		this.ships = this._removeByAttr(this.ships, 'name', `${ship.name}`);

		this.socket.emit(EVENTS.PLAYER_SEND_RESOURCES, {
			resources: ship.resources,
			name: `${ship.name}`,
		});
	}

	addCrashedShips(ships, addDot) {
		this.ships.forEach((s, i) => {
			this.renderer.removeNode(`CrashedShips-${s.name}`);
		});

		this.ships = ships;

		ships.forEach((s, i) => {
			this.addNodes(
				[
					new CrashedShip({
						name: `${s.name}`,
						position: {
							x: s.xPosition + window.innerWidth / 2,
							y: this.terrain[1].sample(s.xPosition, this.offset) - 20,
						},
						resources: s.resources,
						collectResource: this.collectResource.bind(this),
					}),
				],
				['CrashedShips']
			);

			addDot(s.xPosition, this.players[this.me].position.x);
		});

		addDot(
			this.players[this.me].position.x,
			this.players[this.me].position.x,
			true
		);
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

		let radarPlayers = [];
		players.forEach((p) => {
			if (p.id !== this.me) {
				radarPlayers.push(p);
			}
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

		this.radar.setPlayers(radarPlayers);
		this.setAnchor(`Players-${this.players[this.me].name}`);
	}

	updatePlayer(player) {
		let radarPlayers = this.radar.players;
		if (player.id !== this.me) {
			if (this.players[player.id]) {
				this.players[player.id].transform({
					position: {
						x: player.position.x + window.innerWidth / 2,
						y: player.position.y,
					},
					rotation: player.rotation,
				});
				this.players[player.id].setBoostState(player.movementState);
			}

			radarPlayers = this._removeByAttr(radarPlayers, 'id', player.id);
			radarPlayers.push(player);
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

	_removeByAttr(arr, attr, value) {
		var i = arr.length;
		while (i--) {
			if (
				arr[i] &&
				arr[i].hasOwnProperty(attr) &&
				arguments.length > 2 &&
				arr[i][attr] === value
			) {
				arr.splice(i, 1);
			}
		}
		return arr;
	}
}

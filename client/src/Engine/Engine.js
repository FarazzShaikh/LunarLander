import { EVENTS } from '../../../shared/Consts';
import Resource from '../Objects/Resource';
import Player from '../Objects/Player';
import Terrain from '../Objects/Terrain';

import sprite_rechargeStation from '../../Assets/Misc/RechargeStation/RechargeStation.webm';
import sprite_ships from '../../Assets/Misc/Ships/Ships.webm';
import NameTag from '../Objects/NameTag';

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
		this.rechargeStations = [];
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

	getVelocity() {
		if (this.players[this.me]) {
			return this.players[this.me].velocity;
		}
	}

	getSystems() {
		if (this.players[this.me]) {
			return {
				fuel: this.players[this.me].fuel,
				health: this.players[this.me].health,
			};
		}
	}

	setAnchor(anchor) {
		this.isAnchored = true;
		this.renderer.setAnchor(anchor);
	}

	setRadar(radar) {
		this.radar = radar;
	}

	toggleLayer(name) {
		const layer = this.renderer.getLayer(name);
		layer.isHidden ? layer.show() : layer.hide();
	}

	collectResource(ship) {
		// this.renderer.removeNode(`Resources-${ship.name}`);
		// this.ships = this._removeByAttr(this.ships, 'name', `${ship.name}`);
		// this.rechargeStations = this._removeByAttr(
		// 	this.rechargeStations,
		// 	'name',
		// 	`${ship.name}`
		// );
		// this.socket.emit(EVENTS.PLAYER_SEND_RESOURCES, {
		// 	resources: ship.resources,
		// 	name: `${ship.name}`,
		// });
		//console.log(ship);
	}

	addRechargeStation(resources) {
		this.radar.setRechargeStations(resources);
		this.rechargeStations.forEach((s, i) => {
			this.renderer.removeNode(`Resources-${s.name}`);
		});

		this.rechargeStations = resources;

		resources.forEach((s, i) => {
			this.addNodes(
				[
					new Resource({
						name: `${s.name}`,
						position: {
							x: s.xPosition + window.innerWidth / 2 - 60,
							y: this.terrain[1].sample(s.xPosition, this.offset) - 60,
						},
						hitbox: {
							w: 60,
							h: 60,
						},
						resources: s.resources,
						collectResource: this.collectResource.bind(this),
						scale: 3,
						zIndex: 11,
						sprite: sprite_rechargeStation,
						type: 'gif',
					}),
					new NameTag({
						name: `${s.name}`,
						color: '#eeedab',
						string: `
							<div>
								<div>${s.name}</div>
								<div>&emsp;{</div>
								<div>&emsp;&emsp;Fuel: ${s.resources.fuel}</div>
								<div>&emsp;&emsp;W: ${s.resources.W}</div>
								<div>&emsp;&emsp;Scrap: ${s.resources.scrap}</div>
								<div>&emsp;}</div>
							</div>
						`,
						position: {
							x: s.xPosition + window.innerWidth / 2 + 60,
							y: this.terrain[1].sample(s.xPosition, this.offset) - 110,
						},
					}),
				],
				['Resources', 'NameTags']
			);

			this.radar.addDot(s.xPosition, this.players[this.me].position.x);
		});
	}

	addShips(resources) {
		this.radar.setShips(resources);
		this.ships.forEach((s, i) => {
			this.renderer.removeNode(`Resources-${s.name}`);
		});

		this.ships = resources;

		resources.forEach((s, i) => {
			this.addNodes(
				[
					new Resource({
						name: `${s.name}`,
						position: {
							x: s.xPosition + window.innerWidth / 2 - 300,
							y: this.terrain[1].sample(s.xPosition, this.offset) - 300,
						},
						hitbox: {
							w: 300,
							h: 300,
						},
						resources: s.resources,
						collectResource: this.collectResource.bind(this),
						size: {
							w: 100,
							h: 100,
						},
						scale: 5,
						rotation: -0.5 + Math.random() * 0.2,
						zIndex: 10,
						sprite: sprite_ships,
						type: 'gif',
					}),
					new NameTag({
						name: `${s.name}`,
						color: '#abeeab',
						string: `
							<div>
								<div>${s.name}</div>
								<div>&emsp;{</div>
								<div>&emsp;&emsp;Fuel: ${s.resources.fuel}</div>
								<div>&emsp;&emsp;W: ${s.resources.W}</div>
								<div>&emsp;&emsp;Scrap: ${s.resources.scrap}</div>
								<div>&emsp;}</div>
							</div>
						`,
						position: {
							x: s.xPosition + window.innerWidth / 2,
							y: this.terrain[1].sample(s.xPosition, this.offset) - 250,
						},
					}),
				],
				['Resources', 'NameTags']
			);

			this.radar.addDot(s.xPosition, this.players[this.me].position.x);
		});
	}

	/**
	 * Updates current list of players with a new list of Players.
	 * @param {Array<Object>} players Array of players to update current list of players with.
	 */
	updatePlayers(players) {
		Object.values(this.players).forEach((p) => {
			if (p.nameTag) {
				this.renderer.removeNode(`NameTags-${p.name}`);
			}

			p.removeDomNode();
			this.renderer.removeNode(p.name);
		});

		this.players = {};

		let radarPlayers = [];
		let nameTag = null;
		players.forEach((p) => {
			if (p.id !== this.me) {
				radarPlayers.push(p);

				nameTag = new NameTag({
					name: `${p.id}`,
					color: '#eeabab',
					string: `
						<div>
							<div>${p.name}</div>
							<div>&emsp;{</div>
							<div>&emsp;&emsp;Fuel: ${p.resources.fuel}</div>
							<div>&emsp;&emsp;W: ${p.resources.W}</div>
							<div>&emsp;&emsp;Scrap: ${p.resources.scrap}</div>
							<div>&emsp;}</div>
						</div>
					`,
					position: {
						x: p.position.x + window.innerWidth / 2,
						y: p.position.y - 110,
					},
				});
			}

			this.addNodes(
				[
					new Player({
						id: p.id,
						position: p.position,
						rotation: p.rotation,
						velocity: p.velocity,
						fuel: p.resources.fuel,
						health: p.health,
						nameTag: nameTag,
					}),
				],
				['Players']
			);

			if (nameTag) {
				this.addNodes([nameTag], ['NameTags']);
			}
		});

		this.radar.setPlayers(radarPlayers);
		setTimeout(() => {
			this.setAnchor(`Players-${this.players[this.me].name}`);
		}, 100);
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

				this.players[player.id].nameTag.transform({
					position: {
						x: player.position.x + window.innerWidth / 2,
						y: player.position.y - 110,
					},
					rotation: 0,
				});
			}

			radarPlayers = this._removeByAttr(radarPlayers, 'id', player.id);
			radarPlayers.push(player);
		} else {
			if (this.players[player.id]) {
				this.players[player.id].transform({
					position: player.position,
					rotation: player.rotation,
				});

				this.players[player.id].setVelocity(player.velocity);
				this.players[player.id].setSystems({
					fuel: player.resources.fuel,
					health: player.health,
				});
			}
		}

		this.players[player.id].setBoostState(player.movementState);
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

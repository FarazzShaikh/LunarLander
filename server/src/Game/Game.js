// Interface imports
import { Socket } from 'socket.io';

// Import Objects and Classes
import { DEFAULTS, EVENTS } from '../../../shared/Consts';
import { Player } from './Player';

import Collision from './Collision';
import RechargeStation from './RechargeStation';

import * as DB from '../../db/db';

// Class representing the Game.
export default class Game {
	constructor() {
		// Used to calculate delta-time (dt, time between consecutive ticks)
		this.d0 = Date.now();
		// List of all the players in the game. {Socket.id: Socket}
		this.players = {};
		// Seed for terrain. Consistant across all clients.
		this.terrainSeed = 0.4989523467257342;

		this.window = {};

		this.collision = undefined;
		this.didCollide = () => {};

		this.rechargeStations = [];

		// Runs the update function every 1/60th of a second.
		setInterval(this.update.bind(this), 1000 / DEFAULTS.CORE.FRAMERATE);

		this.genRechargeStations();
	}

	genRechargeStations() {
		const number = DEFAULTS.GENERATION.N_RECHARGE_STATION;
		const interval = DEFAULTS.GENERATION.INTERVAL_RECHARGE_STATION;

		this.rechargeStations = [];
		for (let i = 0; i < number * interval; i += interval) {
			this.rechargeStations.push(
				new RechargeStation({
					xPosition: i * interval * Math.random() + this.terrainSeed * 100,
					seed: this.terrainSeed,
				})
			);
		}
	}

	getRechargeStations() {
		return this.rechargeStations.map((s) => s.getSerialized());
	}

	setWindow(window) {
		this.window = window;
		this.collision = new Collision(this.terrainSeed, window);
		this.didCollide = this.collision.didColide.bind(this.collision);
	}

	async setResources(id, resources) {
		console.log(resources);
		const currResources = this.players[id].resources;
		return DB.UPDATE(resources.id, 'CronStore', {
			resources: {
				fuel: 0,
				W: 0,
				scrap: 0,
			},
		})
			.then(() =>
				DB.UPDATE(this.players[id].uuid, 'HighScores', {
					resources: {
						fuel: currResources.fuel + resources.resources.fuel,
						W: currResources.W + resources.resources.W,
						scrap: currResources.scrap + resources.resources.scrap,
					},
				})
			)
			.catch((e) => console.error(e));
	}

	async getResources(data) {
		return DB.GET(data.uuid, 'HighScores').then((r) => r.resources);
	}

	/**
	 * @returns All players in the game.
	 */
	getPlayers() {
		return Object.values(this.players).map((v) => v.getSerialized());
	}

	/**
	 * Adds a player to the game.
	 * @param {Socket} socket Socket of the player to add.
	 */
	async addPlayer(socket, data) {
		const resources = await this.getResources(data);
		this.players[socket.id] = new Player({
			uuid: data.uuid,
			name: data.name,
			socket: socket,
			position: { x: 50000, y: 0 },
			velocity: { x: 2, y: 0 },
			rotation: Math.PI / 2,
			resources: resources,
		});
		this.collision.setPlayers(this.players);
	}

	/**
	 * Removes a player to the game.
	 * @param {Socket} socket Socket of the player to remove.
	 */
	removePlayer(socket) {
		delete this.players[socket.id];
		this.collision.setPlayers(this.players);
	}

	/**
	 * Function that moves the player in responce to Keybpard input
	 * @param {Socket} socket
	 * @param {String} type
	 */
	movePlayer(socket, type) {
		if (this.players[socket.id]) {
			switch (type) {
				case 'BOOST':
					this.players[socket.id].applyForce(
						{
							x: DEFAULTS.MOVEMENT_STRENGTH.BOOST,
							y: DEFAULTS.MOVEMENT_STRENGTH.BOOST,
						},
						true,
						this.dt
					);
					break;

				case 'P_ROTATE':
					this.players[socket.id].applyTorque(DEFAULTS.MOVEMENT_STRENGTH.P_ROTATE);
					break;

				case 'N_ROTATE':
					this.players[socket.id].applyTorque(DEFAULTS.MOVEMENT_STRENGTH.N_ROTATE);
					break;

				default:
					break;
			}
			this.players[socket.id].setMovementState(type);
		}
	}

	/**
	 * Update Function called every 1/60th of a second.
	 */
	update() {
		const dt = this._tick() / 1000;
		this.dt = dt;

		Object.values(this.players).forEach((player) => {
			player.socket.emit(EVENTS.SERVER_TICK, dt);

			const doesPlayerUpdate = player.update(dt, this.didCollide);

			//Checks for player position changes and updates their position
			if (doesPlayerUpdate) {
				player.socket.emit(EVENTS.SERVER_UPDATE_PLAYER, player.getSerialized());
			}
			player.socket.broadcast.emit(
				EVENTS.SERVER_UPDATE_PLAYER,
				player.getSerialized()
			);
		});
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

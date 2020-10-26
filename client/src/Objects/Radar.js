import { Node } from '../Engine/Renderer.js';
import './Components/Radar.css';

export default class Radar extends Node {
	constructor({ name, data }) {
		const node = document.createElement('div');
		node.innerHTML = require('./Components/Radar.html');
		super(name, node.children[0]);
		this.dots = [];

		this.ships = [];
		this.players = [];
		this.rechargeStations = [];
	}

	setShips(ships) {
		this.ships = ships;
	}

	setPlayers(players) {
		this.players = players;
	}

	setRechargeStations(stations) {
		this.rechargeStations = stations;
	}

	addDot(ship, player, type) {
		const containerWidth = window.innerWidth * 0.8;
		const shipPos = containerWidth / 2 - (player - ship) / 20;

		if (
			shipPos < containerWidth - 10 &&
			shipPos > window.innerWidth - containerWidth
		) {
			const dot = document.createElement('div');
			dot.style.transform = `translate(${shipPos}px, 0px)`;

			switch (type) {
				case 'Player':
					dot.classList += 'Radar-line';
					break;

				case 'OtherPlayer':
					dot.classList += 'Radar-otherPlayer';
					break;

				case 'CrashedShip':
					dot.classList += 'Radar-dot';
					break;

				case 'RechargeStations':
					dot.classList += 'Radar-RS';
					break;
				default:
					break;
			}

			const container = this.HTML.children[0].children[0];

			this.dots.push(dot);
			container.appendChild(dot);
			this.needsUpdate = true;
		}
	}

	removeDots() {
		this.dots.forEach((d) => d.remove());
		this.dots = [];
	}

	update(node) {
		const self = node;
		self.removeDots();
		if (self.ships) {
			self.ships.forEach((s) => {
				self.addDot(s.xPosition, this.anchor.position.x, 'CrashedShip');
			});
			self.addDot(this.anchor.position.x, this.anchor.position.x, 'Player');
		}
		if (self.players) {
			self.players.forEach((p) => {
				self.addDot(p.position.x, this.anchor.position.x, 'OtherPlayer');
			});
		}

		if (self.rechargeStations) {
			self.rechargeStations.forEach((s) => {
				self.addDot(s.xPosition, this.anchor.position.x, 'RechargeStations');
			});
		}
	}
}

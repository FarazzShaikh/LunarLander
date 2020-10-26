import numeral from 'numeral';

import { Node } from '../../Engine/Renderer';
import '../Components/Radar.css';

export default class Radar {
	constructor(container) {
		const node = document.createElement('div');
		node.innerHTML = require('../Components/Radar.html');
		container.appendChild(node);

		this.HTML = node.children[0];
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
		const shipPos = containerWidth / 2 - (player - ship) / 10;

		if (
			shipPos < containerWidth - 10 &&
			shipPos > window.innerWidth - containerWidth
		) {
			const dot = document.createElement('div');
			dot.style.transform = `translate(${shipPos}px, 0px)`;
			switch (type) {
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
		}
	}

	removeDots() {
		this.dots.forEach((d) => d.remove());
		this.dots = [];
	}

	update(anchor) {
		this.removeDots();
		if (anchor) {
			if (this.ships) {
				this.ships.forEach((s) => {
					this.addDot(s.xPosition, anchor.position.x, 'CrashedShip');
				});
			}
			if (this.players) {
				this.players.forEach((p) => {
					this.addDot(p.position.x, anchor.position.x, 'OtherPlayer');
				});
			}

			if (this.rechargeStations) {
				this.rechargeStations.forEach((s) => {
					this.addDot(s.xPosition, anchor.position.x, 'RechargeStations');
				});
			}

			const p = {
				x: numeral(anchor.position.x).format('+0.00'),
				y: numeral(window.innerHeight * 0.5 - anchor.position.y).format('+0.00'),
			};

			this.HTML.children[1].children[0].textContent = `{ ${p.x}, ${p.y} }`;
		}
	}
}

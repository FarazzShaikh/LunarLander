import numeral from 'numeral';
import Audio from '../../Engine/Audio';

import sound_textType from '../../../Assets/Sounds/TextType.mp3';

import '../Components/Radar.css';

export default class Radar {
	constructor(container, { resources }) {
		const node = document.createElement('div');
		node.innerHTML = require('../Components/Radar.html');
		container.appendChild(node);

		this.HTML = node.children[0];
		this.dots = [];

		this.ships = [];
		this.players = [];
		this.rechargeStations = [];

		this.sound_textType = new Audio(sound_textType);
		this.getResources = resources;
		this.prevResources = {
			w: 0,
			s: 0,
		};

		this.frameCounter = 0;

		setTimeout(() => {
			this.notification = document.querySelector('.HUD-notification-text');

			this.posText = document.querySelector('.HUD-Coordinate-text');
			this.resText = document.querySelector('.HUD-resource-text');
		}, 3000);
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

	setRaderText(text) {
		this.sound_textType.stop();
		if (text.length > 0) {
			this.sound_textType.play();
		}

		if (this.notification) {
			this.notification.innerHTML = `<h1>${text}</h1>`;
			this.notification.addEventListener(
				'animationend',
				() => {
					this.sound_textType.stop();
				},
				false
			);
		}
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
		this.frameCounter++;

		if (this.frameCounter % 10 === 0) {
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

				if (this.posText && this.resText) {
					const p = {
						x: numeral(anchor.position.x).format('+0.00'),
						y: numeral(window.innerHeight * 0.5 - anchor.position.y).format('+0.00'),
					};

					const resources = this.getResources();
					const r = {
						w: numeral(resources.W).format('0,0'),
						s: numeral(resources.scrap).format('0,0'),
					};

					if (this.prevResources.w !== r.w || this.prevResources.s !== r.s) {
						this.resText.innerHTML = `{&nbsp;<p class="strike">W&nbsp;</p><p>:</p>&nbsp;${r.w},&nbsp;<p class="strike">S&nbsp;</p><p>:</p>&nbsp;${r.s}&nbsp;}`;
					}

					this.posText.innerHTML = `{&nbsp;<p>X:</p>&nbsp;${p.x},&nbsp;<p>Y:</p>&nbsp;${p.y}&nbsp;}`;

					this.prevResources.w = r.w;
					this.prevResources.s = r.s;
				}
			}
			this.frameCounter = 0;
		}
	}
}

import io from 'socket.io-client';

// Class imports
import { EVENTS, INTERRUPT, REQUEST } from '../../shared/Consts';
import Controller from './Engine/Controller';
import Engine from './Engine/Engine';
import Renderer, { Layer } from './Engine/Renderer';
import Sprite from './Objects/Sprite';
import Terrain from './Objects/Terrain';
import PostProcess, { Volume } from './Objects/PostProcess';
import * as Cookies from './Engine/Cookies';

import Sprite_Earth from '../Assets/Planets/Earth.png';
import Sprite_Baren from '../Assets/Planets/Baren.png';
import Sprite_Ice from '../Assets/Planets/Ice.png';
import Sprite_Lava from '../Assets/Planets/Lava.png';
import Sprite_Background from '../Assets/Planets/background-black.png';

import Radar from './Objects/HUD/Radar';
import FPS from './Objects/HUD/FPS';
import HUD from './Objects/HUD/_HUD';

import GameOver from './Views/GameOverScreen/GameOver';

let frameCounter = 0;

// Main
export default function main(radio) {
	// Declaring in scope of main
	let renderer, engine, controller, gamepad, hud;
	let init = true;

	const gameOverScrren = new GameOver();

	// Create a Socket io instance.
	const socket = io();

	// Listens for 'connect' event.
	socket.on('connect', () => {
		console.log('connected');
		//getScore();
		socket.id = replaceAt(socket.id, 0, 'A');

		// Initialize Renderer
		renderer = initRenderer();

		// Initialize Engine
		engine = new Engine(renderer, socket.id, socket);

		hud = new HUD({
			name: 'HUD',
			components: {
				radar: {
					class: Radar,
					options: {
						resources: () => engine.getResources(),
					},
				},
				fps: {
					class: FPS,
					options: {
						data: {
							get: () => frameCounter,
							set: (v) => (frameCounter = v),
							velocity: () => engine.getVelocity(),
							systems: () => engine.getSystems(),
						},
					},
				},
			},
		});

		engine.setRadar(hud.components.radar);

		// Initialize Controller
		controller = new Controller({
			socket: socket,
			enableDS4: true,
			control: engine.control.bind(engine),
			getCurrentResource: engine.getCurrentResource.bind(engine),
			setRaderText: engine.setRaderText.bind(engine),
			radio: radio,
		});

		// Requests terrain options.
		socket.emit(REQUEST.REQUEST_TERRAIN.req, {
			w: window.innerWidth,
			h: window.innerHeight,
		});
	});

	// Listens for terrain options request acknowledgement.
	socket.on(REQUEST.REQUEST_TERRAIN.ack, (seed) => {
		// Registers a terrain with given seed.
		engine.addNodes(
			[
				new PostProcess({
					name: 'Vignette-PP',
					zIndex: 13,
					volume: new Volume({
						background:
							'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0) 61%, rgba(0,0,0,0.52) 100%) no-repeat 50% 50% / 100% 100%',
					}).getVolume(),
				}),

				new Terrain({
					name: 'BackgroundTerrain',
					scrollspeed: 0.5,
					zIndex: 0, //10
					seed: seed * seed,
				}),

				new PostProcess({
					name: 'Terrain-Glow-PP',
					zIndex: 11,
					volume: new Volume({
						background:
							'linear-gradient(rgba(154,154,154,0) 65%, rgba(255,255,255,0.5) 100%)',
					}).getVolume(),
				}),

				new PostProcess({
					name: 'Terrain-Glow-PP',
					zIndex: 11,
					volume: new Volume({
						background: 'rgba(0 ,0 ,0, 0.2)',
					}).getVolume(),
				}),

				new Terrain({
					name: 'ForegroundTerrain',
					scrollspeed: 1,
					zIndex: 5, //15
					seed: seed,
				}),

				new PostProcess({
					name: 'Terrain-Glow-PP',
					zIndex: 9,
					volume: new Volume({
						background:
							'linear-gradient(rgba(154,154,154,0) 50%, rgba(255,255,255,0.5) 100%)',
					}).getVolume(),
				}),

				new Sprite({
					name: 'Earth',
					position: { x: 70, y: 70 },
					scale: 3.5,
					sprite: Sprite_Earth,
					shadowColor: 'rgba(0, 139, 139, 0.5)',
					zIndex: 8,
					absoluteScale: true,
				}),
				new Sprite({
					name: 'Baren',
					position: { x: 80, y: 75 },
					scale: 3,
					sprite: Sprite_Baren,
					shadowColor: 'rgba(255, 255, 255, 0.2)',
					zIndex: 9,
					absoluteScale: true,
				}),
				new Sprite({
					name: 'Ice',
					position: { x: 500, y: 75 },
					scale: 2,
					sprite: Sprite_Ice,
					shadowColor: 'rgba(255, 255, 255, 0.2)',
					zIndex: 8,
					absoluteScale: true,
				}),
				hud,
			],
			[
				'PostProcess',
				'Terrain',
				'PostProcess',
				'PostProcess',
				'Terrain',
				'PostProcess',
				'Background',
				'Background',
				'Background',
				'HUD',
			]
		);

		renderer.scatterNode({
			layerName: 'Background',
			Class: Sprite,
			options: {
				name: 'Ice',
				sprite: Sprite_Ice,
				shadowColor: 'rgba(255, 255, 255, 0.2)',
				zIndex: 5,
				absoluteScale: true,
			},
			number: 2,
			seed: seed,
		});
		renderer.scatterNode({
			layerName: 'Background',
			Class: Sprite,
			options: {
				name: 'Baren',
				sprite: Sprite_Baren,
				shadowColor: 'rgba(255,255,255,0.2)',
				zIndex: 5,
				absoluteScale: true,
			},
			number: 2,
			seed: seed / 10,
		});
		renderer.scatterNode({
			layerName: 'Background',
			Class: Sprite,
			options: {
				name: 'Lava',
				sprite: Sprite_Lava,
				shadowColor: 'rgba(220,20,60,0.05)',
				zIndex: 5,
				absoluteScale: true,
			},
			number: 1,
			seed: seed / 10,
		});

		const cookies = Cookies.getCookies();
		socket.emit(REQUEST.REQUEST_NEW_PLAYER.req, {
			name: cookies.name,
			uuid: cookies.uuid,
		});
	});

	// Listens for new player request acknowledgement. Then updates list of all players.
	socket.on(REQUEST.REQUEST_NEW_PLAYER.ack, (players) =>
		engine.updatePlayers(players)
	);

	socket.on(EVENTS.SERVER_SEND_CRASHED_SHIPS, ({ recharge }) => {
		getCrashedShips()
			.then((s) => {
				engine.addShips(s);
				getDeadPLayers()
					.then((p) => {
						engine.addDeadPlayers(p);
						if (recharge) {
							engine.addRechargeStation(recharge);
						}
						if (!init) {
							engine.setRaderText('Collected!');
							setTimeout(() => {
								engine.setRaderText('');
							}, 3000);
						}
						init = false;
					})
					.catch((e) => console.error(e));
			})
			.catch((e) => console.error(e));
	});

	// Listens for Update PLayerss event. Then updates list of all players.
	socket.on(EVENTS.SERVER_UPDATE_PLAYERS, (players) =>
		engine.updatePlayers(players)
	);
	// Listen for Player Update Events and fire the function to update a single player
	socket.on(EVENTS.SERVER_UPDATE_PLAYER, (player) =>
		engine.updatePlayer(player)
	);

	socket.on(REQUEST.REQUEST_DELETE_PLAYER.req, () => {
		INTERRUPT.set('INTERRUPT-PLAYER-DEAD', true);
	});

	// setTimeout(() => {
	// 	INTERRUPT.set('INTERRUPT-PLAYER-DEAD', true);
	// }, 5000);

	// GListens for Server Tick events.
	socket.on(EVENTS.SERVER_TICK, (dt) => {
		if (!INTERRUPT.get('INTERRUPT-PLAYER-DEAD')) {
			if (radio.filtered) {
				radio.toggleLowPass();
			}

			frameCounter++;
			//console.log('server-tick');
			// Calls engine update on every tick with given delta time.
			if (controller.enableDS4 && frameCounter % 4 === 0) {
				controller.getControllerState();
			}

			engine.update(dt);
		} else {
			if (hud) {
				if (!hud.hidden) {
					gameOverScrren.show();
					hud.hide();
					socket.emit(REQUEST.REQUEST_DELETE_PLAYER.ack);
				}
			}
		}
	});

	// Listens for Delete_Player event
}

/**
 * @returns {Renderer} An instance of the Renderer.
 */
function initRenderer() {
	const renderer = new Renderer([
		new Layer({
			name: 'Background',
			backgroundColor: 'black',
			zIndex: 0,
			image: Sprite_Background,
		}),
		new Layer({
			name: 'Terrain',
			zIndex: '',
		}),
		// Layer for Players
		new Layer({
			name: 'Players',
			zIndex: 14,
		}),
		// Layer for HUD
		new Layer({
			name: 'HUD',
			zIndex: 30,
		}),
		new Layer({
			name: 'PostProcess',
			zIndex: '',
		}),
		new Layer({
			name: 'Resources',
			zIndex: '',
		}),
		new Layer({
			name: 'NameTags',
			zIndex: 50,
		}),
		new Layer({
			name: 'Bullets',
			zIndex: 60,
		}),
	]);

	return renderer;
}

async function getCrashedShips() {
	const url = `${window.location.href}api/CrashedShips/`;
	const data = await fetch(url);
	return await data.json();
}

async function getDeadPLayers() {
	const url = `${window.location.href}api/DeadPlayers/`;
	const data = await fetch(url);
	return await data.json();
}

function replaceAt(str, index, replacement) {
	return (
		str.substr(0, index) + replacement + str.substr(index + replacement.length)
	);
}

import io from 'socket.io-client';

// Class imports
import { EVENTS, REQUEST } from '../../shared/Consts';
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

let frameCounter = 0;

// Main
export default function main() {
	// Declaring in scope of main
	let renderer, engine, controller, gamepad, hud;

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
				radar: { class: Radar, options: {} },
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
		controller = new Controller(
			socket,
			engine.applyController.bind(engine),
			true
		);

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
							'linear-gradient(rgba(154,154,154,0) 70%, rgba(255,255,255,0.5) 100%)',
					}).getVolume(),
				}),

				new Terrain({
					name: 'ForegroundTerrain',
					scrollspeed: 1,
					zIndex: 2, //12
					seed: seed,
				}),

				new PostProcess({
					name: 'Terrain-Glow-PP',
					zIndex: 9,
					volume: new Volume({
						background:
							'linear-gradient(rgba(154,154,154,0) 30%, rgba(255,255,255,0.5) 100%)',
					}).getVolume(),
				}),

				new Sprite({
					name: 'Earth',
					position: { x: 70, y: 70 },
					scale: 4,
					sprite: Sprite_Earth,
					shadowColor: 'rgba(0, 139, 139, 0.5)',
					zIndex: 8,
				}),
				new Sprite({
					name: 'Baren',
					position: { x: 80, y: 75 },
					scale: 3,
					sprite: Sprite_Baren,
					shadowColor: 'rgba(255, 255, 255, 0.2)',
					zIndex: 9,
				}),
				new Sprite({
					name: 'Ice',
					position: { x: 500, y: 75 },
					scale: 2,
					sprite: Sprite_Ice,
					shadowColor: 'rgba(255, 255, 255, 0.2)',
					zIndex: 8,
				}),
				hud,
			],
			[
				'PostProcess',
				'Terrain',
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
			},
			number: 2,
			seed: seed * 6,
		});
		renderer.scatterNode({
			layerName: 'Background',
			Class: Sprite,
			options: {
				name: 'Baren',
				sprite: Sprite_Baren,
				shadowColor: 'rgba(255,255,255,0.2)',
				zIndex: 5,
			},
			number: 2,
			seed: seed * 7,
		});
		renderer.scatterNode({
			layerName: 'Background',
			Class: Sprite,
			options: {
				name: 'Lava',
				sprite: Sprite_Lava,
				shadowColor: 'rgba(220,20,60,0.05)',
				zIndex: 5,
			},
			number: 3,
			seed: seed * 8,
		});

		const cookies = Cookies.getCookies();
		socket.emit(REQUEST.REQUEST_NEW_PLAYER.req, {
			name: cookies.name,
			fingerprint: cookies.fingerprint,
			uuid: cookies.uuid,
		});
	});

	// Listens for new player request acknowledgement. Then updates list of all players.
	socket.on(REQUEST.REQUEST_NEW_PLAYER.ack, (players) =>
		engine.updatePlayers(players)
	);

	socket.on(EVENTS.SERVER_SEND_CRASHED_SHIPS, ({ recharge }) => {
		getCrashedShips().then((s) => {
			engine.addShips(s);
			if (recharge) {
				engine.addRechargeStation(recharge);
			}
		});
	});

	// Listens for Update PLayerss event. Then updates list of all players.
	socket.on(EVENTS.SERVER_UPDATE_PLAYERS, (players) =>
		engine.updatePlayers(players)
	);
	// Listen for Player Update Events and fire the function to update a single player
	socket.on(EVENTS.SERVER_UPDATE_PLAYER, (player) =>
		engine.updatePlayer(player)
	);

	// GListens for Server Tick events.
	socket.on(EVENTS.SERVER_TICK, (dt) => {
		frameCounter++;
		//console.log('server-tick');
		// Calls engine update on every tick with given delta time.
		if (controller.enableDS4 && frameCounter % 4 === 0) {
			controller.getControllerState();
		}

		engine.update(dt);
	});

	// Listens for Delete_Player event
	socket.on(REQUEST.REQUEST_DELETE_PLAYER.req, () => 
		console.log('Dead')	
	);
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
			zIndex: 20,
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
	]);

	return renderer;
}

async function getScore() {
	const url = `${window.location.href}api/scores/`;
	console.log(await (await fetch(url)).json());
}

async function getCrashedShips() {
	const url = `${window.location.href}api/CrashedShips/`;
	const data = await fetch(url);
	return await data.json();
}

function replaceAt(str, index, replacement) {
	return (
		str.substr(0, index) + replacement + str.substr(index + replacement.length)
	);
}

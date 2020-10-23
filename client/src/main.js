import io from 'socket.io-client';

// Class imports
import { EVENTS, REQUEST } from '../../shared/Consts';
import Controller from './Engine/Controller';
import Engine from './Engine/Engine';
import Renderer, { Layer } from './Engine/Renderer';
import Sprite from './Objects/Sprite';
import Terrain from './Objects/Terrain';

import Sprite_Earth from '../Assets/Earth.png';
import Sprite_Baren from '../Assets/Baren.png';
import Sprite_Ice from '../Assets/Ice.png';
import Sprite_Lava from '../Assets/Lava.png';
import Sprite_Background from '../Assets/background-black.png';

import HUD from './Objects/HUD';

var d = new Date();
let frameCounter = 0;

// Main
export default function main() {
	// Declaring in scope of main
	let renderer, engine, controller;

	// Create a Socket io instance.
	const socket = io();

	// Listens for 'connect' event.
	socket.on('connect', () => {
		console.log('connected');
		//getScore();

		// Initialize Renderer
		renderer = initRenderer();
		// Initialize Engine
		engine = new Engine(renderer, socket.id);
		// Initialize Controller
		controller = new Controller(socket);

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
				new Terrain({
					name: 'BackgroundTerrain',
					scrollspeed: 0.5,
					zIndex: 0,
					seed: seed * seed,
				}),
				new Terrain({
					name: 'ForegroundTerrain',
					scrollspeed: 1,
					zIndex: 2,
					seed: seed,
				}),
				new Sprite({
					name: 'Earth',
					position: { x: 70, y: 70 },
					scale: 5,
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
				new HUD({
					name: 'FPS',
					data: {
						get: () => frameCounter,
						set: (v) => (frameCounter = v),
					},
				}),
			],
			['Terrain', 'Terrain', 'Background', 'Background', 'Background', 'HUD']
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
			number: 6,
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
			},
			number: 7,
			seed: seed,
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
			number: 5,
			seed: seed,
		});

		console.log(seed);
		socket.emit(REQUEST.REQUEST_NEW_PLAYER.req);
	});

	// Listens for new player request acknowledgement. Then updates list of all players.
	socket.on(REQUEST.REQUEST_NEW_PLAYER.ack, (players) => {
		engine.updatePlayers(players);
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
		engine.update(dt);
	});
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
			zIndex: 10,
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
	]);

	return renderer;
}

async function getScore() {
	const url = `${window.location.href}scores/all`;
	console.log(await (await fetch(url)).json());
}

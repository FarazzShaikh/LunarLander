import io from 'socket.io-client';

// Class imports
import { EVENTS, REQUEST } from '../../shared/Consts';
import Controller from './Engine/Controller';
import Engine from './Engine/Engine';
import HUD from './Engine/HUD';
import Renderer, { Layer } from './Engine/Renderer';
import Planet from './Objects/PassiveObjects/Planet';
import Terrain from './Objects/Terrain';

var d = new Date();

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
		engine.registerTerrain(
			new Terrain({
				seed: seed,
				scrollspeed: 0.5,
				zIndex: 0,
			})
		);

		engine.registerTerrain(
			new Terrain({
				seed: seed,
				scrollspeed: 1,
				zIndex: 1,
			})
		);
		// Register Background Elements
		engine.registerBackground([Planet], seed);
		// Register HUD Element
		engine.registerHUD(new HUD());
		// Requests new player.
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
		//console.log('server-tick');
		// Calls engine update on every tick with given delta time.
		engine.update(dt);
	});
}

/**
 * @returns {Renderer} An instance of the Renderer.
 */
function initRenderer() {
	const renderer = new Renderer({
		layers: [
			// Layer for the terrrain
			new Layer({ name: 'Background', backgroundColor: 'black' }),
			// Layer for Players
			new Layer({ name: 'Sprite' }),
			// Layer for HUD
			new Layer({ name: 'HUD' }),
		],
	});

	//Get layers as divs
	const nodes = renderer.getDoccumentNodes();
	//add Layers to the page
	nodes.forEach((n) => document.body.append(n));
	return renderer;
}

async function getScore() {
	const url = `${window.location.href}scores/all`;
	console.log(await (await fetch(url)).json());
}

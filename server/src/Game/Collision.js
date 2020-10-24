import { DEFAULTS, EVENTS } from '../../../shared/Consts';
import { makeOctaves, Simple1DNoise } from '../../../shared/utils/SimplexNoise';

export default class Collision {
	constructor(seed, window) {
		this.seed = seed;
		this.window = window;
		this.players = {};

		this.noise = new Simple1DNoise(seed);
	}

	setPlayers(players) {
		this.players = players;
	}

	didColide(player) {
		const noise =
			makeOctaves(this.noise.getVal, player.position.x, {
				octaves: DEFAULTS.GENERATION.OCTAVES,
				frequency: DEFAULTS.GENERATION.SCALE,
				lacunarity: DEFAULTS.GENERATION.LACUNARITY,
				persistence: DEFAULTS.GENERATION.PERSISTANCE,
				amplitude: 100,
			}) +
			(this.window.h * 0.7 - this.window.h * 0.55) +
			this.window.h * 0.55 -
			58;
		
		if(player.position.y >= noise) {
			player.socket.emit(EVENTS.GAME_OVER)		
		}
		return player.position.y >= noise;
	}
}

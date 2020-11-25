import { DEFAULTS, REQUEST } from '../../../shared/Consts';
import {
	noise as noisefunc,
	noiseSeed,
	makeOctaves,
} from '../../../shared/utils/noise';

export default class Collision {
	constructor(seed, window) {
		this.seed = seed;
		this.window = window;
		this.players = {};
		noiseSeed(seed);
	}

	setPlayers(players) {
		this.players = players;
	}

	didColide(player) {
		const noise =
			makeOctaves(noisefunc, player.position.x + this.window.w / 2, {
				octaves: DEFAULTS.GENERATION.OCTAVES,
				frequency: DEFAULTS.GENERATION.SCALE,
				lacunarity: DEFAULTS.GENERATION.LACUNARITY,
				persistence: DEFAULTS.GENERATION.PERSISTANCE,
				amplitude: 100,
			}) +
			(this.window.h * 0.7 - this.window.h * 0.55) +
			this.window.h * 0.55;

		if (
			player.position.y + 60 >= noise &&
			(player.velocity.y > 0.5 || player.velocity.x > 0.3)
		) {
			player.damage(player.velocity.y * DEFAULTS.COLLISION.dmg);
		}

		return player.position.y + 55 >= noise;
	}
}

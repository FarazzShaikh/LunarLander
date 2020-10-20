import { DEFAULTS } from '../../../shared/Consts';
import { makeOctaves, Simple1DNoise } from '../../../shared/SimplexNoise';
import { noise as Perlin, noiseSeed } from '../../utils/Perlin';

export default class Collision {
	constructor(seed, window) {
		this.seed = seed;
		this.window = window;
		this.heightBuffer = [];
		this.players = {};

		this._genTerrain();

		this.noise = new Simple1DNoise(seed);
	}

	setPlayers(players) {
		this.players = players;
	}

	_genTerrain() {
		noiseSeed(this.seed);

		for (let x = 0; x < this.window.w; x++) {
			const cratorBig =
				Math.sin(x * 0.009) > 0 ? Math.sin(x * 0.009) * 1.5 + 0.7 : 1;
			const cratorSmall =
				Math.sin(x * 0.05) > 0 ? Math.sin(x * 0.05) * 0.2 + 1 : 1;

			const noise = 1 * 1 * Perlin(x * 0.01) * 100 + 500;

			this.heightBuffer.push(noise);
		}
	}

	didColide(player) {
		const noise =
			makeOctaves(this.noise.getVal, player.position.x, {
				octaves: DEFAULTS.GENERATION.OCTAVES,
				frequency: DEFAULTS.GENERATION.SCALE,
				lacunarity: DEFAULTS.GENERATION.LACUNARITY,
				persistence: DEFAULTS.GENERATION.PERSISTANCE,
				amplitude: 100,
			}) + 500;
		return player.position.y > noise;
	}
}

import { DEFAULTS } from '../../../shared/Consts';
import { Node } from '../Engine/Renderer';
import { noise, noiseSeed, makeOctaves } from '../../../shared/utils/noise';

// Class representing the terrain.
export default class Terrain extends Node {
	constructor({ name, seed, scrollspeed, zIndex }) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		var polygon = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'polygon'
		);
		svg.style.width = '100%';
		svg.style.height = '100%';
		// svg.style.filter = `drop-shadow(0px -10px 10px rgba(255, 255, 255, ${
		// 	0.1 * zIndex
		// }))`;
		svg.style.transform = 'scale(1.01, 1.01)';
		svg.style.position = 'absolute';
		svg.style.zIndex = `${zIndex + 10}`;
		svg.style.fill = zIndex === 0 ? '#202020' : '#191919';

		polygon.style.zIndex = '100';
		polygon.style.stroke = `rgba(255, 255, 255, ${1 * zIndex + 0.5})`;
		polygon.style.strokeWidth = '1px';
		polygon.style.zIndex = '100';

		svg.appendChild(polygon);
		super(name, svg);

		this.polygon = polygon;
		// Seed for consistant terrain generation across clients.
		noiseSeed(seed);
		this.scrollspeed = scrollspeed;
		this.zIndex = zIndex;

		this.drawTerrain(0);
	}

	/**
	 * Draws a given height buffer ot the screen using SVGSVGElement.
	 * @param {Array<number>} terrain The Height Buffer to draw.
	 */
	drawTerrain(offset) {
		const polygon = this.polygon;
		const svg = this.HTML;

		polygon.points.clear();
		for (let x = 0; x < window.innerWidth; x += 4) {
			var point = svg.createSVGPoint();
			const scale =
				(this.zIndex / 5) * (window.innerHeight * 0.7 - window.innerHeight * 0.55) +
				window.innerHeight * 0.55;

			point.x = x;

			point.y =
				makeOctaves(noise, x + offset * this.scrollspeed, {
					octaves: DEFAULTS.GENERATION.OCTAVES,
					frequency: DEFAULTS.GENERATION.SCALE * this.scrollspeed,
					lacunarity: DEFAULTS.GENERATION.LACUNARITY,
					persistence: DEFAULTS.GENERATION.PERSISTANCE,
					amplitude: 100,
				}) + scale;

			polygon.points.appendItem(point);
		}
		const lPoint = svg.createSVGPoint();
		lPoint.x = 0;
		lPoint.y = window.innerHeight;
		const rPoint = svg.createSVGPoint();
		rPoint.x = window.innerWidth;
		rPoint.y = window.innerHeight;

		polygon.points.appendItem(rPoint);
		polygon.points.insertItemBefore(lPoint, 0);
	}

	static sample(x, offset) {
		const scale =
			window.innerHeight * 0.7 -
			window.innerHeight * 0.55 +
			window.innerHeight * 0.55;
		return (
			makeOctaves(noise, x + offset, {
				octaves: DEFAULTS.GENERATION.OCTAVES,
				frequency: DEFAULTS.GENERATION.SCALE,
				lacunarity: DEFAULTS.GENERATION.LACUNARITY,
				persistence: DEFAULTS.GENERATION.PERSISTANCE,
				amplitude: 100,
			}) + scale
		);
	}

	update() {}
}

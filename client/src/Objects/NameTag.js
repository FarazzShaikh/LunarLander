import { Node } from '../Engine/Renderer';

export default class NameTag extends Node {
	constructor({ name, position, rotation, scale, string, color }) {
		const node = document.createElement('div');

		node.style.padding = '8px';
		node.style.margin = '0';

		node.style.position = 'absolute';
		node.style.backgroundColor = 'rgba(0,0,0,0.2)';
		node.style.boxShadow = '0 0 5px 10px rgba(0,0,0,0.2)';

		node.style.fontFamily = 'monospace';
		node.style.fontSize = '15px';
		node.style.fontWeight = '100';

		node.style.color = color;
		node.style.textShadow = `0px 0px 13px ${color}`;
		node.innerHTML = string;

		super(name, node);

		const p = position || { x: 0, y: 0 };
		const r = rotation || 0;
		const s = scale || 1;

		this.transform({ position: p, rotation: r, scale: s });
	}

	update(node) {
		const self = node;
		let p = { ...self.position };
		const s = self.scale;
		const r = self.rotation;

		if (this.anchor) {
			if (this.anchor.name === self.name) {
				p.x = window.innerWidth / 2;
				//p.y = window.innerHeight / 2;
			} else {
				p.x -= this.anchor.position.x;
				//p.y -= this.anchor.position.y;
			}
		}

		if (self._isInViewport(p, 300 * 2)) {
			if (self.HTML.style.display !== 'block') self.HTML.style.display = 'block';
			self.HTML.style.transform = `scale(${s},${s}) translate(${p.x}px,${p.y}px) rotate(${r}rad)`;
		} else {
			if (self.HTML.style.display !== 'none') self.HTML.style.display = 'none';
		}
	}
}

function createLineElement(x, y, length, angle) {
	var line = document.createElement('div');
	var styles =
		'border: 1px solid black; ' +
		'width: ' +
		length +
		'px; ' +
		'height: 0px; ' +
		'-moz-transform: rotate(' +
		angle +
		'rad); ' +
		'-webkit-transform: rotate(' +
		angle +
		'rad); ' +
		'-o-transform: rotate(' +
		angle +
		'rad); ' +
		'-ms-transform: rotate(' +
		angle +
		'rad); ' +
		'position: absolute; ' +
		'top: ' +
		y +
		'px; ' +
		'left: ' +
		x +
		'px; ';
	line.setAttribute('style', styles);
	return line;
}

function createLine(x1, y1, x2, y2) {
	var a = x1 - x2,
		b = y1 - y2,
		c = Math.sqrt(a * a + b * b);

	var sx = (x1 + x2) / 2,
		sy = (y1 + y2) / 2;

	var x = sx - c / 2,
		y = sy;

	var alpha = Math.PI - Math.atan2(-b, a);

	return createLineElement(x, y, c, alpha);
}

import Sprite from './Sprite';

export default class CrashedShip extends Sprite {
	constructor({
		name,
		position,
		rotation,
		scale,
		sprite,
		shadowColor,
		zIndex,
		invert,

		resources,
		collectResource,
	}) {
		super({
			name,
			position,
			rotation,
			scale,
			sprite,
			shadowColor,
			zIndex,
			invert,
		});

		this.resources = resources;
		this.collectResource = collectResource;
		this.needsUpdate = true;
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

		const screenPosX = self.position.x - window.innerWidth / 2;

		if (
			this.anchor.position.x < screenPosX + 10 &&
			this.anchor.position.x > screenPosX - 40 &&
			this.anchor.position.y < self.position.y + 100 &&
			this.anchor.position.y > self.position.y - 100
		) {
			self.collectResource(self);
		}

		self.HTML.style.transform = `scale(${s},${s}) translate(${p.x}px,${p.y}px) rotate(${r}rad)`;
	}
}

import Sprite from './Sprite';

export default class Resource extends Sprite {
	constructor({
		name,
		position,
		rotation,
		scale,
		sprite,
		shadowColor,
		zIndex,
		invert,
		size,
		type,

		resources,
		collectResource,
		hitbox,
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
			size,
			type,
		});

		this.resources = resources;
		this.collectResource = collectResource;
		this.needsUpdate = true;
		this.hitbox = hitbox;
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

			if (AABB.collide(self.HTML, this.anchor.HTML)) {
				self.collectResource(self);
				console.log('s');
			}

			if (self._isInViewport(p, self.hitbox.w * 2)) {
				if (self.HTML.style.display !== 'block') self.HTML.style.display = 'block';
				self.HTML.style.transform = `translate(${p.x}px,${p.y}px) rotate(${r}rad)`;
				self.HTML.style.width = `${s * self.size.w}px`;
				self.HTML.style.height = `${s * self.size.h}px`;
			} else {
				if (self.HTML.style.display !== 'none') self.HTML.style.display = 'none';
			}
		}
	}
}

var AABB = {
	collide: function (el1, el2) {
		var rect1 = el1.getBoundingClientRect();
		var rect2 = el2.getBoundingClientRect();

		return !(
			rect1.top > rect2.bottom ||
			rect1.right < rect2.left ||
			rect1.bottom < rect2.top ||
			rect1.left > rect2.right
		);
	},

	inside: function (el1, el2) {
		var rect1 = el1.getBoundingClientRect();
		var rect2 = el2.getBoundingClientRect();

		return (
			rect2.top <= rect1.top &&
			rect1.top <= rect2.bottom &&
			rect2.top <= rect1.bottom &&
			rect1.bottom <= rect2.bottom &&
			rect2.left <= rect1.left &&
			rect1.left <= rect2.right &&
			rect2.left <= rect1.right &&
			rect1.right <= rect2.right
		);
	},
};

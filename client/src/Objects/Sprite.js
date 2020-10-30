import { Node } from '../Engine/Renderer';

export default class Sprite extends Node {
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
	}) {
		const DOMnode = document.createElement('div');
		DOMnode.classList += `${name}`;

		if (!sprite) {
			DOMnode.style.width = '25px';
			DOMnode.style.height = '25px';

			DOMnode.style.justifyContent = 'center';

			const normal = document.createElement('div');
			normal.style.width = `${25 / 4}px`;
			normal.style.height = `${25 * 2}px`;
			normal.style.backgroundColor = 'blue';
			DOMnode.appendChild(normal);
		}

		DOMnode.style.display = 'flex';

		DOMnode.style.position = 'absolute';
		DOMnode.style.top = '0';
		DOMnode.style.left = '0';
		DOMnode.style.zIndex = `${zIndex}`;

		DOMnode.style.backgroundColor = sprite ? 'transparent' : 'red';

		if (shadowColor) {
			DOMnode.style.filter = `drop-shadow(0px 0px 5px ${shadowColor}`;
		}

		if (invert) {
			DOMnode.style.filter += `invert(100)`;
		}

		if (sprite) {
			if (type === 'gif') {
				const vid = document.createElement('video');
				vid.style.minWidth = '100%';
				vid.style.minHeight = '100%';
				vid.style.flexShrink = '0';
				vid.style.imageRendering = 'pixelated';

				vid.autoplay = true;
				vid.loop = true;
				vid.muted = true;
				vid.playsinline = true;
				vid.playbackRate = 0.5;

				const src = document.createElement('source');
				src.src = sprite;
				src.type = 'video/webm';

				vid.appendChild(src);
				DOMnode.appendChild(vid);
			} else {
				const img = document.createElement('img');
				img.style.minWidth = '100%';
				img.style.minHeight = '100%';
				img.style.flexShrink = '0';
				img.style.imageRendering = 'pixelated';
				img.src = sprite;

				DOMnode.appendChild(img);
			}
		}

		super(name, DOMnode);

		const p = position || { x: 0, y: 0 };
		const r = rotation || 0;
		const s = scale || 1;

		this.size = size || {
			w: 25,
			h: 25,
		};
		this.transform({ position: p, rotation: r, scale: s });
		this.scaleMultiplier = 3;
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

		self.HTML.style.transform = `scale(${s},${s}) translate(${p.x}px,${p.y}px) rotate(${r}rad)`;
		self.needsUpdate = false;
	}
}

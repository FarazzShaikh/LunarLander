import { Node } from '../Engine/Renderer';

import sound_explosion from '../../Assets/Sounds/Explosion.mp3';
import Shot_explosion from '../../Assets/drone/explosion.webm';
import Shot_explosionBig from '../../Assets/drone/explosionBig.webm';
import Terrain from './Terrain';
import Audio from '../Engine/Audio';

export default class Bullet extends Node {
	constructor({ framerate, _src, position, rotation, scale }) {
		const bullet = document.createElement('video');
		// bullet.style.width = '50px';
		// bullet.style.width = '50px';
		bullet.style.flexShrink = '0';
		bullet.style.imageRendering = 'pixelated';
		bullet.style.position = 'absolute';
		bullet.style.zIndex = '14';

		bullet.autoplay = true;
		bullet.loop = true;
		bullet.muted = true;
		bullet.playsinline = true;
		bullet.playbackRate = 1;

		const src = document.createElement('source');
		src.src = _src;
		src.type = 'video/webm';

		bullet.appendChild(src);

		const name = `${Math.random()}-Bullet`;
		super(name, bullet);

		this.lifetime = 3 * framerate;
		const p = position || { x: 0, y: 0 };
		const r = rotation || 0;
		const s = scale || 1;

		this.removeNode = null;
		this.getPlayers = null;
		this.meName = null;

		this.sound_explosion = new Audio(sound_explosion);

		this.transform({ position: p, rotation: r, scale: s });
	}

	explosion(p, _src) {
		const explosion = document.createElement('video');
		explosion.style.flexShrink = '0';
		explosion.style.imageRendering = 'pixelated';
		explosion.style.position = 'absolute';
		explosion.style.zIndex = '14';
		explosion.style.transform = `translate(${p.x}px,${p.y - 55}px)`;

		explosion.autoplay = true;
		explosion.muted = true;
		explosion.playsinline = true;
		explosion.playbackRate = 1;

		this.sound_explosion.play();

		const src = document.createElement('source');
		src.src = _src;
		src.type = 'video/webm';

		explosion.appendChild(src);
		document.body.appendChild(explosion);

		explosion.addEventListener('ended', () => {
			explosion.remove();
		});
	}

	setGetPlayers(f, meName) {
		this.getPlayers = f;
		this.meName = meName;
	}

	setPosition(pos) {
		this.transform({ position: pos });
	}

	setRemoveNode(removeNode) {
		this.removeNode = removeNode;
	}

	update(node) {
		const self = node;

		let p = { ...self.position };
		const s = self.scale;
		const r = self.rotation;

		self.lifetime--;
		if (self.lifetime <= 0) {
			if (self.removeNode) {
				self.removeNode(`Bullets-${self.name}`);
			}
		}

		if (this.anchor) {
			if (this.anchor.name === self.name) {
				p.x = window.innerWidth / 2;
				//p.y = window.innerHeight / 2;
			} else {
				p.x -= this.anchor.position.x;
				//p.y -= this.anchor.position.y;
			}
		}

		self.position.x += 10 * Math.sin(r);
		self.position.y += 10 * -Math.cos(r);

		let skip = false;
		if (self.getPlayers()) {
			const players = self.getPlayers();
			for (const key in players) {
				if (players.hasOwnProperty(key)) {
					const pl = players[key];
					if (key !== self.meName) {
						if (AABB.collide(self.HTML, pl.HTML)) {
							self.explosion(
								{
									x: p.x - 70,
									y: p.y + 50,
								},
								Shot_explosion
							);
							pl.damagePlayer(pl.name, 20);
							self.lifetime = -1;
							skip = true;
						}
					}
				}
			}
		}

		if (self._isInViewport(p, 300 * 2)) {
			if (self.HTML.style.display !== 'block') self.HTML.style.display = 'block';

			if (p.y + 20 >= Terrain.sample(p.x, this.anchor.position.x)) {
				self.explosion(p, Shot_explosion);
				self.lifetime = -1;
			} else {
				if (!skip) {
					self.HTML.style.transform = `
					scale(${s},${s}) 
					translate(${p.x}px,${p.y}px) 
					rotate(${r - Math.PI / 2}rad)`;
				}
			}
		} else {
			if (self.HTML.style.display !== 'none') self.HTML.style.display = 'none';
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

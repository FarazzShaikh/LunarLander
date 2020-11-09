import Sprite from './Sprite';

import Char_Fly from '../../Assets/drone/drone-3.png';

import Exhaust_Norm1 from '../../Assets/Normal_flight/Exhaust1/exhaust1.png';
import Exhaust_Norm2 from '../../Assets/Normal_flight/Exhaust1/exhaust2.png';
import Exhaust_Norm3 from '../../Assets/Normal_flight/Exhaust1/exhaust3.png';
import Exhaust_Norm4 from '../../Assets/Normal_flight/Exhaust1/exhaust4.png';

import Side_booster1 from '../../Assets/RotationBoosters/exhaust1.png';
import Side_booster2 from '../../Assets/RotationBoosters/exhaust2.png';
import Side_booster3 from '../../Assets/RotationBoosters/exhaust3.png';
import Side_booster4 from '../../Assets/RotationBoosters/exhaust4.png';

import Shot_vid from '../../Assets/drone/shot.webm';
import Shot_explosion from '../../Assets/drone/explosion.webm';
import Shot_explosionBig from '../../Assets/drone/explosionBig.webm';

import { DEFAULTS } from '../../../shared/Consts';
import Terrain from './Terrain';
import Bullet from './Bullet';

// Class representing client side Player.
export default class Player extends Sprite {
	constructor({
		id,
		position,
		rotation,
		velocity,
		scale,
		movementState,
		fuel,
		health,
		nameTag,
		usrname,
		getPlayers,
	}) {
		super({
			name: `${id}`,
			sprite: Char_Fly,
			position: position,
			rotation: rotation,
			//scale: 0.5,
		});
		this.usrname = usrname;

		this.HTML.style.padding = '8px';

		this.HTML.style.transition = '300ms ease-in-out';
		this.HTML.style.transitionProperty =
			'width, height, background-color, border';

		const flame = document.createElement('img');
		flame.style.minWidth = '100%';
		flame.style.minHeight = '100%';
		flame.style.flexShrink = '0';
		flame.style.imageRendering = 'pixelated';
		flame.src = Exhaust_Norm1;

		flame.style.position = 'absolute';
		flame.style.top = '0';
		flame.style.left = '0';

		flame.style.transition = 'opacity 300ms ease-in-out';
		flame.style.transform = 'rotate(90deg) translate(45px, 0px)';

		this.velocity = velocity;
		this.flame = flame;
		this.frameIndex = 0;
		this.flameFrames = [
			Exhaust_Norm1,
			Exhaust_Norm2,
			Exhaust_Norm3,
			Exhaust_Norm4,
		].reverse();
		this.booserFrames = [
			Side_booster1,
			Side_booster2,
			Side_booster3,
			Side_booster4,
		];
		this.boostState = null;
		this.isOffscreen = false;

		this.HTML.appendChild(flame);

		this.booserR = this.genSideBooser({ x: -30, y: 0 }, 0, 0.5);
		this.booserL = this.genSideBooser({ x: -25, y: 0 }, 180, 0.5);

		this.HTML.appendChild(this.booserR);
		this.HTML.appendChild(this.booserL);

		this.framerate = DEFAULTS.CORE.FRAMERATE;
		this.fuel = fuel;
		this.health = health;
		this.nameTag = nameTag;
		this.score = 0;

		this.radarText = '';
		this.bullets = [];
		this.getPlayers = getPlayers;
	}

	fire() {
		const bullet = new Bullet(this.framerate, this.rotation, Shot_vid);

		this.bullets.push(bullet);
	}

	animate(i) {
		if (this.fuel > 0) {
			if (this.boostState === 'BOOST') {
				this.flame.style.opacity = '1';
			} else {
				this.flame.style.opacity = '0';
			}
			if (this.boostState === 'N_ROTATE') {
				this.booserR.style.opacity = '0';
				this.booserL.style.opacity = '1';
			} else if (this.boostState === 'P_ROTATE') {
				this.booserR.style.opacity = '1';
				this.booserL.style.opacity = '0';
			} else {
				this.booserR.style.opacity = '0';
				this.booserL.style.opacity = '0';
			}

			const frameRateCompensation = this.framerate / 15;
			if (i % frameRateCompensation === 0) {
				this.flame.src = this.flameFrames[
					(i / frameRateCompensation) % this.flameFrames.length
				];
				this.booserR.src = this.booserFrames[
					(i / frameRateCompensation) % this.booserFrames.length
				];
				this.booserL.src = this.booserFrames[
					(i / frameRateCompensation) % this.booserFrames.length
				];
			}
			if (!this.isOffscreen) {
				if (this.HTML.style.backgroundColor !== 'transparent') {
					this.HTML.style.backgroundColor = 'transparent';
					this.HTML.style.border = '0px solid white';
					this.HTML.style.width = '';
					this.HTML.style.height = '';
					this.HTML.style.overflow = 'visible';
				}
			} else {
				this.HTML.style.backgroundColor = '#191919';
				this.HTML.style.border = '1px solid white';
				this.HTML.style.overflow = 'hidden';
			}
		} else {
			this.flame.style.opacity = '0';
			this.booserR.style.opacity = '0';
			this.booserL.style.opacity = '0';
		}
	}

	setBoostState(state) {
		this.boostState = state;
	}

	setVelocity(velocity) {
		this.velocity = velocity;
	}

	setSystems({ fuel, health }) {
		this.fuel = fuel;
		this.health = health;
	}

	setNameTag(score) {
		this.score = score;
		if (this.nameTag) {
			this.nameTag.setText(`
		<div>
			<div>${this.usrname}</div>
			<div>&emsp;{</div>
			<div>&emsp;&emsp;Value: ${this.score}</div>
			<div>&emsp;}</div>
		</div>
		`);
		}
	}

	update(node) {
		const self = node;

		self.frameIndex++;
		self.animate.call(node, self.frameIndex);

		let p = { ...self.position };
		const s = self.scale;
		const r = self.rotation;

		if (p.y < 0) {
			self.isOffscreen = true;
			p.y = 0;
		} else {
			self.isOffscreen = false;
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

		self.bullets.forEach((b, i) => {
			if (b.pos.x === null) {
				b.pos = {
					x: p.x + 5,
					y: p.y + 5,
				};
			}
			const fPos = {
				x: (b.pos.x += 10 * Math.sin(b.rot)),
				y: (b.pos.y += 10 * -Math.cos(b.rot)),
			};
			if (fPos.y + 20 >= Terrain.sample(fPos.x, this.anchor.position.x)) {
				b.explosion(fPos, Shot_explosion);
				b.lifetime = -1;
			} else {
				let skip = false;
				const players = self.getPlayers();
				for (const key in players) {
					if (players.hasOwnProperty(key)) {
						const pl = players[key];
						if (key !== self.name) {
							if (AABB.collide(b.HTML, pl.HTML)) {
								b.explosion(
									{
										x: pl.position.x - this.anchor.position.x,
										y: pl.position.y + 30,
									},
									Shot_explosion
								);
								b.lifetime = -1;
								skip = true;
							}
						}
					}
				}
				if (!skip) {
					b.HTML.style.transform = `translate(
						${fPos.x}px,
						${fPos.y}px) 
						rotate(${b.rot - Math.PI / 2}rad)`;
					b.lifetime--;
				}
			}

			if (b.lifetime <= 0) {
				b.HTML.remove();
				b.explosion(fPos);
				self.bullets.splice(i, 1);
			}
		});

		if (self._isInViewport(p, 300 * 2)) {
			if (self.HTML.style.display !== 'block') self.HTML.style.display = 'block';
			self.HTML.style.transform = `scale(${s},${s}) translate(${p.x}px,${p.y}px) rotate(${r}rad)`;
			self.needsUpdate = false;
		} else {
			if (self.HTML.style.display !== 'none') self.HTML.style.display = 'none';
		}
	}

	removeDomNode() {
		document.querySelector(`.${this.name}`).remove();
	}

	genSideBooser(translate, rotate, scale) {
		const sideBooster = document.createElement('img');
		sideBooster.style.minWidth = '100%';
		sideBooster.style.minHeight = '100%';
		sideBooster.style.flexShrink = '0';
		sideBooster.style.imageRendering = 'pixelated';
		sideBooster.src = Side_booster1;

		sideBooster.style.position = 'absolute';
		sideBooster.style.top = '0';
		sideBooster.style.left = '0';

		sideBooster.style.transition = 'opacity 300ms ease-in-out';

		sideBooster.style.transform = `rotate(${rotate}deg) translate(${translate.x}px, ${translate.y}px) scale(${scale}, ${scale})`;

		return sideBooster;
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

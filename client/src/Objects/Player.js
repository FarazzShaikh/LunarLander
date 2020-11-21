import Sprite from './Sprite';

import Char_Fly from '../Assets/drone/drone-3.png';

import sound_boost_f from '../Assets/Sounds/boost_f.mp3';

import Exhaust_Norm1 from '../Assets/Normal_flight/Exhaust1/exhaust1.png';
import Exhaust_Norm2 from '../Assets/Normal_flight/Exhaust1/exhaust2.png';
import Exhaust_Norm3 from '../Assets/Normal_flight/Exhaust1/exhaust3.png';
import Exhaust_Norm4 from '../Assets/Normal_flight/Exhaust1/exhaust4.png';

import Side_booster1 from '../Assets/RotationBoosters/exhaust1.png';
import Side_booster2 from '../Assets/RotationBoosters/exhaust2.png';
import Side_booster3 from '../Assets/RotationBoosters/exhaust3.png';
import Side_booster4 from '../Assets/RotationBoosters/exhaust4.png';

import Shot_vid from '../Assets/drone/shot.webm';
import sound_shootRetro from '../Assets/Sounds/shootRetro.mp3';

import { DEFAULTS, EVENTS, REQUEST } from '../../../shared/Consts';
import Terrain from './Terrain';
import Bullet from './Bullet';
import Audio from '../../Shared/Audio';

// Class representing client side Player.
export default class Player extends Sprite {
	constructor({
		id,
		position,
		rotation,
		velocity,
		scale,
		movementState,
		resources,
		health,
		nameTag,
		usrname,
		getPlayers,
		getSocket,
		damagePlayer,
		value,
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
		this.HTML.style.borderRadius = '50px';

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
		this.resources = resources;

		this.health = health;
		this.nameTag = nameTag;
		this.value = value;

		this.radarText = '';
		this.bullets = [];

		this.getPlayers = getPlayers;
		this.getSocket = getSocket;
		this.sound_shootRetro = new Audio(sound_shootRetro);
		this.sound_boost_f = new Audio(sound_boost_f);
		this.damagePlayer = damagePlayer;
	}

	fire() {
		this.sound_shootRetro.play();
		const bullet = new Bullet({
			framerate: this.framerate,
			_src: Shot_vid,
			position: { ...this.position },
			rotation: this.rotation,
		});
		this.bullets.push({ node: bullet, didAdd: false });
	}

	animate(i) {
		if (this.resources.fuel > 0) {
			if (this.boostState === 'BOOST') {
				this.sound_boost_f.play();
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

	setResources({ resources, health }) {
		this.resources = resources;
		this.health = health;
	}

	setNameTag(value) {
		this.value = value;
		if (this.nameTag) {
			this.nameTag.setText(`
		<div>
			<div>${this.usrname}</div>
			<div>&emsp;{</div>
			<div>&emsp;&emsp;Value: ~${this.value}</div>
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
			if (!b.didAdd) {
				if (this.anchor) {
					if (this.anchor.name === self.name) {
						b.node.setPosition({
							x: self.position.x + window.innerWidth / 2,
							y: self.position.y,
						});
					}
				}

				b.node.setRemoveNode(this.removeNode.bind(this));
				b.node.setGetPlayers(self.getPlayers, self.name);
				this.addNode('Bullets', b.node);
				b.didAdd = true;
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

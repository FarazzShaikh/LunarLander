export default class Bullet {
	constructor(framerate, rot, _src) {
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
		document.body.appendChild(bullet);

		this.HTML = bullet;
		this.pos = {
			x: null,
			y: null,
		};
		this.rot = rot;
		this.lifetime = 3 * framerate;
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

		const src = document.createElement('source');
		src.src = _src;
		src.type = 'video/webm';

		explosion.appendChild(src);
		document.body.appendChild(explosion);

		explosion.addEventListener('ended', () => {
			explosion.remove();
		});
	}

	update() {}
}

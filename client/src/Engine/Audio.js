export default class Audio {
	constructor(src, vol) {
		this.sound = document.createElement('audio');
		this.sound.src = src;
		this.sound.setAttribute('preload', 'auto');
		this.sound.setAttribute('controls', 'none');
		this.sound.style.display = 'none';

		this.sound.volume = vol ? vol : 0.3;

		document.body.appendChild(this.sound);
	}

	setSrc(src) {
		this.sound.src = src;
	}

	destroy() {
		this.sound.remove();
	}

	play() {
		this.sound.play();
	}

	stop() {
		this.sound.pause();
	}
}

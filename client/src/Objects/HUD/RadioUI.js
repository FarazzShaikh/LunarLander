import '../Components/Radio.css';

export default class RadioUI {
	constructor(container, { radio }) {
		const node = document.createElement('div');
		node.innerHTML = require('../Components/Radio.html');
		container.appendChild(node);

		this.HTML = node;
		this.HTML.style.transition = 'all 300ms ease-in-out';

		this.radio = radio;

		this.hideTimer = null;

		setTimeout(() => {
			this.radioUI = {
				name: document.querySelector('.Song-Display .text .name'),
				artist: document.querySelector('.Song-Display .text .artist'),
				album: document.querySelector('.Song-Display .text .album'),
			};

			this.radio.setOnSongChange(this.setRadio.bind(this));
			this.setRadio(this.radio.getSongData.call(this.radio));
		}, 3000);
	}

	show() {
		this.HTML.style.display = 'flex';
		setTimeout(() => {
			this.HTML.style.opacity = '1';
		}, 300);
		this.hideTimer = 0;
	}

	hide() {
		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.style.display = 'none';
		}, 300);
		this.hideTimer = null;
	}

	setRadio(songData) {
		if (this.radioUI.name && this.radioUI.artist && this.radioUI.album) {
			this.show();

			this.radioUI.name.textContent = songData.name;
			this.radioUI.artist.textContent = songData.artist;
			this.radioUI.album.textContent = songData.album;
		}
	}

	update() {
		if (this.hideTimer !== null) {
			if (this.hideTimer >= 200) {
				this.hide();
			}
			this.hideTimer++;
		}
	}
}

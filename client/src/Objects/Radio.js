import { getSong } from '../../Assets/Sounds/Radio/Before the night/BeforeTheNight';
import Audio from '../Engine/Audio';
import {
	HasAudioContext,
	Reverb,
	Distortion,
	Volume,
	Output,
} from 'audio-effects';
import { call } from 'file-loader';

export default class Radio {
	constructor() {
		const node = document.createElement('div');
		node.classList.add('Radio');
		node.style.display = 'none';

		document.body.appendChild(node);

		this.songIndex = 1;

		this.audio = new Audio('', 1);
		// getSong(this.songIndex, songTable.HOME.tracks[this.songIndex - 1]).then(
		// 	(s) => {
		// 		this.audio.setSrc(s.default);
		// 		setTimeout(() => {
		// 			this.play();
		// 		}, 1000);
		// 	}
		// );

		let audioContext = null;

		if (HasAudioContext) {
			audioContext = new AudioContext();
		}

		const source = audioContext.createMediaElementSource(this.audio.sound);

		const filter = audioContext.createBiquadFilter();
		source.connect(filter);
		filter.connect(audioContext.destination);

		filter.type = 'highshelf';
		filter.frequency.value = 910;
		filter.gain.value = -24;

		this.filter = filter;
		this.audioContext = audioContext;

		this.filtered = true;
	}

	toggleLowPass() {
		if (this.filtered) {
			this.filter.gain.linearRampToValueAtTime(
				-10,
				this.audioContext.currentTime + 30
			);
		} else {
			this.filter.gain.linearRampToValueAtTime(
				-24,
				this.audioContext.currentTime + 30
			);
		}
		this.filtered = !this.filtered;
	}

	setOnSongChange(f) {
		this.onSongChange = f;
	}

	getSongData() {
		return {
			name: songTable.HOME.tracks[this.songIndex - 1],
			artist: songTable.HOME.artist,
			album: songTable.HOME.album,
		};
	}

	play() {
		this.audio.play();
	}

	stop() {
		this.audio.stop();
	}

	next() {
		// this.songIndex++;
		// if (this.songIndex === 12) this.songIndex = 1;
		// getSong(this.songIndex, songTable.HOME.tracks[this.songIndex - 1]).then(
		// 	(s) => {
		// 		this.audio.setSrc(s.default);
		// 		setTimeout(() => {
		// 			this.play();
		// 		}, 1000);
		// 	}
		// );
		// const data = this.getSongData();
		// if (this.onSongChange) this.onSongChange(data);
	}

	previous() {
		// this.songIndex--;
		// if (this.songIndex === 0) this.songIndex = 11;
		// getSong(this.songIndex, songTable.HOME.tracks[this.songIndex - 1]).then(
		// 	(s) => {
		// 		this.audio.setSrc(s.default);
		// 		setTimeout(() => {
		// 			this.play();
		// 		}, 1000);
		// 	}
		// );
		// const data = this.getSongData();
		// if (this.onSongChange) this.onSongChange(data);
	}
}

var songTable = {
	HOME: {
		artist: 'HOME',
		album: 'Before The Night',
		tracks: [
			"We're Finally Landing",
			'Synchronize',
			'Overflow',
			'Without A Sound',
			'Above All',
			'Pyxis',
			'Before The Night',
			"If I'm Wrong",
			'Nosebleed',
			'Sun',
			'Sleep',
		],
	},
};

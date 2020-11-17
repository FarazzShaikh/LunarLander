import * as BeofreTheNight from '../../Assets/Sounds/Radio/Before the night/BeforeTheNight';
import Audio from '../Engine/Audio';
import {
	HasAudioContext,
	Reverb,
	Distortion,
	Volume,
	Output,
} from 'audio-effects';

export default class Radio {
	constructor() {
		const node = document.createElement('div');
		node.classList.add('Radio');
		node.style.display = 'none';

		document.body.appendChild(node);

		this.tracks = BeofreTheNight;
		this.tracks.get = function (index) {
			return this[inWords(index)];
		};

		this.songIndex = 1;

		this.audio = new Audio(this.tracks.get(this.songIndex), 1);

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

	play() {
		this.audio.play();
	}

	stop() {
		this.audio.stop();
	}

	next() {
		this.songIndex++;
		if (this.songIndex === 12) this.songIndex = 1;
		this.audio.setSrc(this.tracks.get(this.songIndex));
	}

	previous() {
		this.songIndex--;
		if (this.songIndex === 0) this.songIndex = 11;
		this.audio.setSrc(this.tracks.get(this.songIndex));
	}
}

var a = [
	'Zero',
	'One',
	'Two',
	'Three',
	'Four',
	'Five',
	'Six',
	'Seven',
	'Eight',
	'Nine',
	'Ten',
	'Eleven',
];

function inWords(num) {
	return a[num];
}

import Audio from './Audio';

export default class Radio {
	constructor() {
		const node = document.createElement('div');
		node.classList.add('Radio');
		node.style.display = 'none';

		document.body.appendChild(node);

		this.songIndex = 10;

		this.audio = new Audio('', 1);
		this.audio.sound.muted = true;

		setTimeout(() => {
			this.audio.sound.crossOrigin = 'anonymous';
			this.audio.setSrc(sanitizeLink(songTable.HOME.url[this.songIndex - 1]));
		}, 2000);

		const interval = setInterval(() => {
			if (!this.audio.sound.muted) {
				this.audio.play();

				clearInterval(interval);
			}
		}, 100);

		this.audio.sound.addEventListener('ended', () => {
			this.stop();
			this.next();
			this.play();
		});

		let audioContext = new AudioContext();

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
		this.songIndex++;
		if (this.songIndex === 12) this.songIndex = 1;

		this.audio.setSrc(sanitizeLink(songTable.HOME.url[this.songIndex - 1]));

		const data = this.getSongData();
		if (this.onSongChange) this.onSongChange(data);
	}

	previous() {
		this.songIndex--;
		if (this.songIndex === 0) this.songIndex = 11;

		this.audio.setSrc(sanitizeLink(songTable.HOME.url[this.songIndex - 1]));

		const data = this.getSongData();
		if (this.onSongChange) this.onSongChange(data);
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
		url: [
			`https://www.dropbox.com/s/7wapxmlov3j2rj3/1-%20We%27re%20Finally%20Landing.mp3?dl=0`,
			`https://www.dropbox.com/s/oy6wsxs9z4vada1/2-%20Synchronize.mp3?dl=0`,
			`https://www.dropbox.com/s/2nd286ybzu4ssni/3-%20Overflow.mp3?dl=0`,
			`https://www.dropbox.com/s/fwyv7ktcvd9hlbz/4-%20Without%20A%20Sound.mp3?dl=0`,
			`https://www.dropbox.com/s/oa4ld7obq74b42m/5-%20Above%20All.mp3?dl=0`,
			`https://www.dropbox.com/s/l83e9h92h99gkse/6-%20Pyxis.mp3?dl=0`,
			`https://www.dropbox.com/s/6wn831srlhs9902/7-%20Before%20The%20Night.mp3?dl=0`,
			`https://www.dropbox.com/s/l2wc3k8m6fa91o5/8-%20If%20I%27m%20Wrong.mp3?dl=0`,
			`https://www.dropbox.com/s/l2wc3k8m6fa91o5/8-%20If%20I%27m%20Wrong.mp3?dl=0`,
			`https://www.dropbox.com/s/xxp4fjyfqyu81mj/10-%20Sun.mp3?dl=0`,
			`https://www.dropbox.com/s/p3657xnj0pbznnk/11-%20Sleep.mp3?dl=0`,
		],
	},
};

function sanitizeLink(link) {
	const sub = link.substring(0, link.length - 5);
	return sub.replace('www', 'dl');
}

import Error from '../Views/Error/Error';
import './TitleScreen.css';

export default class SplashScreen {
	constructor() {
		const node = document.createElement('div');
		node.innerHTML = require('./TitleScreen.html');

		this.HTML = node;

		this.HTML.style.transition = 'all 300ms ease-in-out';
		this.HTML.style.opacity = '0';

		this.activeScreen = -1;
		this.onReady = null;

		setTimeout(() => {
			this.items = document.querySelectorAll(
				'.SplashScreen-container .options .item'
			);
			this.items.forEach((i, ind) => {
				i.addEventListener('click', () => this.selectItem(ind));
			});
		}, 1000);
	}

	closeSubTab(classname) {
		this.selectItem(-1, classname);
	}

	selectItem(i, className) {
		const injectPoint = document.querySelector('.inject-html');
		this.activeScreen = i;

		switch (i) {
			case 0:
				injectPoint.innerHTML = require('./Components/Play.html');
				injectPoint.classList.add('inject-html-style');
				injectPoint.classList.add('slide-opacity');

				setTimeout(() => {
					document
						.querySelector('.SplashScreen-container .play-container .icons')
						.addEventListener(
							'click',
							this.closeSubTab.bind(this, ['play-container'])
						);
					const input = document.querySelector(
						'.SplashScreen-container .play-container input'
					);
					document
						.querySelectorAll('.play-container table tbody tr td')
						.forEach((cell) => {
							cell.addEventListener('click', () => {
								if (input.value.length < 10) input.value += cell.textContent;
							});
						});
					document
						.querySelector('.play-container .play-container-holder .buttons button')
						.addEventListener('click', () => {
							input.value = input.value.substring(0, input.value.length - 1);
						});
					document
						.querySelectorAll(
							'.play-container .play-container-holder .buttons button'
						)[1]
						.addEventListener('click', () => this.onReady(input.value));
				}, 2000);

				break;

			case 1:
				injectPoint.innerHTML = require('./Components/Controls.html');
				document.querySelectorAll('video').forEach((v) => {
					v.playbackRate = 0.5;
				});
				injectPoint.classList.add('inject-html-style');
				injectPoint.classList.add('slide-opacity');
				document
					.querySelector('.SplashScreen-container .controls-container .icons')
					.addEventListener(
						'click',
						this.closeSubTab.bind(this, ['controls-container'])
					);

				break;

			default:
				document
					.querySelector(`.SplashScreen-container .${className} .icons`)
					.removeEventListener('click', this.closeSubTab.bind(this));
				const b = document.querySelectorAll(
					'.play-container .play-container-holder .buttons button'
				)[1];
				if (b) {
					b.removeEventListener('click', () => this.onReady);
				}

				injectPoint.innerHTML = '';
				injectPoint.classList.remove('inject-html-style');
				injectPoint.classList.remove('slide-opacity');

				break;
		}

		this.items.forEach((item, ind) => {
			if (ind !== i) {
				if (item.classList.contains('active')) {
					item.classList.remove('active');
					item.classList.remove('crt');
				}
			} else {
				if (!item.classList.contains('active')) {
					item.classList.add('active');
					item.classList.add('crt');
				}
			}
		});
	}

	show() {
		document.body.appendChild(this.HTML);
		setTimeout(() => {
			this.HTML.style.opacity = '1';
		}, 100);
	}

	hide() {
		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.remove();
		}, 300);
	}
}

export function Modal_main(setCookies) {
	console.log('modal');

	const modal = new SplashScreen();
	modal.onReady = onReady.bind(modal);
	modal.show();

	function onReady(val) {
		const name = val.trim();
		if (name.length <= 0) {
			new Error().show({
				title: 'Enter a Name.',
				body: 'Please set a username! ',
			});
			return;
		}

		getScore()
			.then((scores) => {
				if (scores.find((s) => s.userName === name)) {
					new Error().show({
						title: 'Name Taken.',
						body: 'This username is already taken. Please try a different one.',
					});
					return;
				} else {
					const postData = { name };
					setUser(postData).then((r) => {
						if (r.status === 200) {
							r.json()
								.then((body) => {
									this.hide();
									setCookies({ ...postData, uuid: body.uuid });
								})
								.catch((e) => console.error(e));
						}
					});
				}
			})
			.catch((e) => console.error(e));
	}
}

async function getScore() {
	const url = `${window.location.href}api/scores/null`;
	const data = await fetch(url);
	return await data.json();
}

async function setUser(body) {
	let response = await fetch(`${window.location.href}api/registerUser`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(body),
	});
	return response;
}

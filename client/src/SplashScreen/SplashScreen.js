import './SplashScreen.css';

export default class SplashScreen {
	constructor() {
		const node = document.createElement('div');
		node.innerHTML = require('./SplashScreen.html');

		this.HTML = node;

		this.HTML.style.transition = 'all 300ms ease-in-out';
		this.HTML.style.opacity = '0';
	}

	show(onReady) {
		document.body.appendChild(this.HTML);
		setTimeout(() => {
			this.HTML.style.opacity = '1';
			this.input = document.querySelector('.Modal-input');
			this.button = document.querySelector('.Modal-button');
			onReady();
		}, 100);
	}

	hide() {
		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.remove();
		}, 300);
	}
}

export function Modal_main(setCookies, fingerprint) {
	console.log('modal');

	const modal = new SplashScreen();
	modal.show(onReady.bind(modal));

	function onReady() {
		this.button.addEventListener('click', () => {
			const name = this.input.value.trim();

			getScore()
				.then((scores) => {
					if (
						scores.find((n) => n.userName === name && n.fingerprint !== fingerprint)
					) {
						alert('Username Taken');
					} else {
						const postData = { name, fingerprint };
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
		});
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

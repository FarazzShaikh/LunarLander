import { deleteCookies, getCookies } from '../Engine/Cookies';
import './GameOver.css';

export default class GameOver {
	constructor() {
		const node = document.createElement('div');
		node.style.width = '100vw';
		node.style.height = '100vh';
		node.style.zIndex = '100';

		node.style.position = 'absolute';
		node.style.top = '0';
		node.style.left = '0';
		node.innerHTML = require('./GameOver.html');

		this.HTML = node;
		this.HTML.style.transition = 'all 300ms ease-in-out';
		this.HTML.style.opacity = '0';
	}

	show() {
		document.body.appendChild(this.HTML);
		this.HTML.style.opacity = '1';
		setTimeout(() => {
			const currUser = {
				name: document.querySelector(
					'.Game-over-container table tbody .currentUser .userName'
				),
				value: document.querySelector(
					'.Game-over-container table tbody .currentUser .userScore'
				),
				rank: document.querySelector(
					'.Game-over-container table tbody .currentUser .userRank'
				),
			};

			const topUsers = {
				name: document.querySelectorAll(
					'.Game-over-container table tbody .topUser .userName'
				),
				value: document.querySelectorAll(
					'.Game-over-container table tbody .topUser .userScore'
				),
				rank: document.querySelectorAll(
					'.Game-over-container table tbody .topUser .userRank'
				),
			};

			getScore('null')
				.then((scores) => {
					scores.sort((a, b) => {
						if (a.value < b.value) {
							return 1;
						}
						if (a.value > b.value) {
							return -1;
						}
						return 0;
					});

					topUsers.name.forEach(
						(n, i) => (n.textContent = scores[i].userName || '')
					);
					topUsers.value.forEach((n, i) => (n.textContent = scores[i].value || ''));
					topUsers.rank.forEach((n, i) => (n.textContent = scores[i] ? i + 1 : ''));

					scores.forEach((s, i) => {
						if (s.uuid === getCookies().uuid) {
							currUser.name.textContent = s.userName || '';
							currUser.value.textContent = s.value || '';
							currUser.rank.textContent = i + 1 || '';
							deleteCookies();
							return;
						}
					});
				})

				.catch((e) => console.error);
		}, 100);
	}

	hide() {
		this.HTML.style.opacity = '0';
		setTimeout(() => {
			this.HTML.remove();
		}, 300);
	}
}

async function getScore(uuid) {
	const url = `${window.location.href}api/scores/${uuid}`;
	return await (await fetch(url)).json();
	//return 'TODO';
}

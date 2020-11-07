const functions = require('firebase-functions');
const CrashedShip = require('./src/CrashedShip');
const { POST } = require('./src/db');

const runtimeOpts = {
	timeoutSeconds: 300,
};

exports.genCrachedShips = functions
	.runWith(runtimeOpts)
	.pubsub.schedule('*/30 * * * *')
	.timeZone('Asia/Dubai')
	.onRun((ctx) => {
		const number = 25;
		const minInterval = 3000;

		let pPos = 0;
		let tries = 0;

		const crashedShips = [];
		for (let i = 0; i < number; i++) {
			let pos = Math.random() * 500000;
			while (Math.abs(pos - pPos) < minInterval || tries < 5) {
				pos = Math.random() * 500000;
				tries++;
			}
			crashedShips.push(
				new CrashedShip({
					xPosition: pos,
					seed: 1,
				})
			);
			pPos = pos;
		}

		return POST(crashedShips)
			.catch((e) => console.log(e.description))
			.then(() => null);
	});

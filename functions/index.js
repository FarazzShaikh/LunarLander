const functions = require('firebase-functions');
const CrashedShip = require('./src/CrashedShip');
const { POST } = require('./src/db');

exports.genCrachedShips = functions.pubsub
	.schedule('*/30 * * * *')
	.timeZone('Asia/Dubai')
	.onRun((ctx) => {
		const number = 30;
		const interval = 173;

		const crashedShips = [];
		for (let i = 0; i < number; i++) {
			crashedShips.push(
				new CrashedShip({
					xPosition: i * interval * Math.random() + 1 * 100,
					seed: 1,
				})
			);
		}

		return POST(crashedShips)
			.catch((e) => console.log(e.description))
			.then(() => null);
	});

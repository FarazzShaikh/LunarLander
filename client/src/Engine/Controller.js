import { DEFAULTS, EVENTS } from '../../../shared/Consts';

// Class Representing the COntroller for the game
export default class Controller {
	constructor({ socket, enableDS4, getCurrentResource, control, radio }) {
		// The Socket of the player
		this.socket = socket;
		// A Map, mapping the keyboard keys -> movement commands
		this.keyMap = DEFAULTS.KEYMAP;
		// Enable Dualshock 4 controlls TODO
		this.enableDS4 = enableDS4 || false;

		this.using = null;

		this.getCurrentResource = getCurrentResource;

		// Listen for keyboard key-down events
		document.addEventListener('keydown', (e) => {
			this.using = 'k';
			// If keycode maps to an input...

			if (control(this.keyMap[e.code], socket)) return;

			switch (this.keyMap[e.code]) {
				case 'COLLECT-RESOURCES':
					const resource = this.getCurrentResource();
					if (resource) {
						this.socket.emit(EVENTS.PLAYER_SEND_RESOURCES, resource.getSerialized());
					}

					return;

				case 'RADIO-REWIND':
					radio.stop();
					radio.previous();
					radio.play();
					return;

				case 'RADIO-NEXT':
					radio.stop();
					radio.next();
					radio.play();
					return;

				default:
					break;
			}

			if (this.keyMap[e.code]) {
				if (this.using === 'k') {
					// ...Send an event telling server Player has moved
					socket.emit(EVENTS.PLAYER_HAS_MOVED, this.keyMap[e.code]);
				}
			}
		});

		document.addEventListener('keyup', (e) => {
			if (this.keyMap[e.code]) {
				socket.emit(EVENTS.PLAYER_HAS_MOVED, null);
			}
		});

		// setInterval(() => {
		// 	socket.emit(EVENTS.PLAYER_HAS_MOVED, this.keyMap.Space);
		// }, 10);
	}

	getControllerState() {
		const gamepad = navigator.getGamepads()[0];

		if (gamepad) {
			const buttons = {
				X: gamepad.buttons[0],
				L1: gamepad.buttons[4],
				R1: gamepad.buttons[5],
			};

			let animAccumulator = false;
			let animKey = null;

			for (const key in buttons) {
				animAccumulator |= buttons[key].pressed;
				if (buttons[key].pressed) {
					this.using = 'c';
					animKey = key;
				}
			}

			if (this.using === 'c') {
				if (animAccumulator) {
					this.socket.emit(EVENTS.PLAYER_HAS_MOVED, this.keyMap[animKey]);
				} else {
					this.socket.emit(EVENTS.PLAYER_HAS_MOVED, null);
				}
			}
		}
	}

	removeListener() {
		document.removeEventListener('keydown');
	}
}

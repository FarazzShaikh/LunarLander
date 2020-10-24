import { DEFAULTS, EVENTS } from '../../../shared/Consts';

// Class Representing the COntroller for the game
export default class Controller {
	constructor(socket, applyController, enableDS4) {
		// The Socket of the player
		this.socket = socket;
		// A Map, mapping the keyboard keys -> movement commands
		this.keyMap = DEFAULTS.KEYMAP;
		// Enable Dualshock 4 controlls TODO
		this.enableDS4 = enableDS4 || false;

		this.applyController = applyController;
		this.using = null;

		// Listen for keyboard key-down events
		document.addEventListener('keydown', (e) => {
			this.using = 'k';
			// If keycode maps to an input...
			if (this.keyMap[e.code]) {
				if (this.using === 'k') {
					applyController(this.keyMap[e.code]);

					// ...Send an event telling server Player has moved
					socket.emit(EVENTS.PLAYER_HAS_MOVED, this.keyMap[e.code]);
				}
			}
		});

		document.addEventListener('keyup', (e) => {
			if (this.keyMap[e.code]) {
				applyController(null);
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
					this.socket.emit(EVENTS.PLAYER_HAS_MOVED, this.keyMap[key]);
				}
			}

			if (this.using === 'c') {
				if (animAccumulator) {
					this.applyController(this.keyMap[animKey]);
				} else {
					this.applyController(null);
				}
			}
		}
	}

	removeListener() {
		document.removeEventListener('keydown');
	}
}

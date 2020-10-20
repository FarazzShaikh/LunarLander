import { DEFAULTS, EVENTS } from '../../../shared/Consts';

// Class Representing the COntroller for the game
export default class Controller {
	constructor(socket, enableDS4) {
		// The Socket of the player
		this.socket = socket;
		// A Map, mapping the keyboard keys -> movement commands
		this.keyMap = DEFAULTS.KEYMAP;
		// Enable Dualshock 4 controlls TODO
		this.enableDS4 = enableDS4 || false;

		// Listen for keyboard key-down events
		// document.addEventListener('keydown', (e) => {
		// 	// If keycode maps to an input...
		// 	if (this.keyMap[e.code]) {
		// 		// ...Send an event telling server Player has moved
		// 		socket.emit(EVENTS.PLAYER_HAS_MOVED, this.keyMap[e.code]);
		// 	}
		// });

		setInterval(() => {
			socket.emit(EVENTS.PLAYER_HAS_MOVED, this.keyMap.Space);
		}, 10);
	}

	removeListener() {
		document.removeEventListener('keydown');
	}
}

// Used for Socket.io events where Server wnats to broadcast to all clinets
// expecting no acknowledgement.
export const EVENTS = {
	SERVER_TICK: 'SERVER-TICK',
	SERVER_UPDATE_PLAYERS: 'SERVER-UPDATE-PLAYERS',
	SERVER_UPDATE_PLAYER: 'SERVER-UPDATE-PLAYER',
	SERVER_SEND_CRASHED_SHIPS: 'SERVER-SEND-CRASHED-SHIPS',
	SERVER_ERROR: 'SERVER-ERROR',

	PLAYER_HAS_MOVED: 'PLAYER-HAS-MOVED',
	PLAYER_HAS_SHOT: 'PLAYER-HAS-SHOT',
	PLAYER_HAS_DAMAGED: 'PLAYER-HAS-DAMAGED',
	PLAYER_SEND_RESOURCES: 'PLAYER-SEND-RESOURCES',
};

// Used for Socket.io events where ether Client or Server wants to request data
// usually resolved by sending an acknowledgement.
export const REQUEST = {
	REQUEST_TERRAIN: {
		req: 'REQUEST-TERRAIN',
		ack: 'REQUEST-TERRAIN-ACK',
	},
	REQUEST_NEW_PLAYER: {
		req: 'REQUEST-NEW-PLAYER',
		ack: 'REQUEST-NEW-PLAYER-ACK',
	},
	REQUEST_DELETE_PLAYER: {
		req: 'REQUEST-DELETE-PLAYER',
		ack: 'REQUEST-DELETE-PLAYER-ACK',
	},
	REQUEST_SERVER_PLAYER_HIT_GROUND: {
		req: 'REQUEST_SERVER_PLAYER_HIT_GROUND',
		ack: 'REQUEST_SERVER_PLAYER_HIT_GROUND-ACK',
	},
};

export const INTERRUPT = {
	INTERRUPTS: {},
	set: function (key, value) {
		this.INTERRUPTS[key] = value;
	},
	get: function (key) {
		return this.INTERRUPTS[key];
	},
};

// Used to store Default values for various physics and other calculations
export const DEFAULTS = {
	CORE: {
		FRAMERATE: 30,
	},
	GENERATION: {
		SCALE: 0.01,
		LACUNARITY: 2,
		PERSISTANCE: 0.5,
		OCTAVES: 2,

		N_CRASHED_SHIPS: 20,
		INTERVAL_CRASHED_SHIPS: 173,

		N_RECHARGE_STATION: 50,
		MIN_INTERVAL_RECHARGE_STATION: 300,
	},
	KEYMAP: {
		ArrowLeft: 'N_ROTATE',
		ArrowRight: 'P_ROTATE',
		ArrowUp: 'FIRE',

		Space: 'BOOST',

		KeyA: 'N_ROTATE',
		KeyD: 'P_ROTATE',

		KeyE: 'TOGGLE-TAGS',
		KeyW: 'COLLECT-RESOURCES',
		KeyF: 'FIRE',
		KeyZ: 'RADIO-REWIND',
		KeyC: 'RADIO-NEXT',
		KeyP: 'SELF-DESTRUCT',
		Escape: 'PAUSE',

		L1: 'N_ROTATE',
		R1: 'P_ROTATE',
		X: 'BOOST',

		TRIANGLE: 'TOGGLE-TAGS',
		CIRCLE: 'COLLECT-RESOURCES',
		SQUARE: 'FIRE',

		LEFT: 'RADIO-REWIND',
		RIGHT: 'RADIO-NEXT',
		OPT: 'PAUSE',
		PS: 'SELF-DESTRUCT',
	},
	SCATTER: {
		N: 10,
	},
	MOVEMENT_STRENGTH: {
		BOOST: 3,
		P_ROTATE: 0.2,
		N_ROTATE: -0.2,
	},
	DRAG: {
		rho: 1.204,
		cd: 0.2,
		a: (6 * 15 ** 2) / 10000,
	},
	GRAVITY: {
		g: -0.098,
	},
	WIND: {
		speed: 0.08,
	},
	FUEL: {
		f: 0.1,
		ft: 0.05,
	},
	COLLISION: {
		dmg: 50,
	},
};

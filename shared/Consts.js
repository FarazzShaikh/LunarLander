// Used for Socket.io events where Server wnats to broadcast to all clinets
// expecting no acknowledgement.
export const EVENTS = {
	SERVER_TICK: 'SERVER-TICK',
	SERVER_UPDATE_PLAYERS: 'SERVER-UPDATE-PLAYERS',
	SERVER_UPDATE_PLAYER: 'SERVER-UPDATE-PLAYER',
	SERVER_SEND_CRASHED_SHIPS: 'SERVER-SEND-CRASHED-SHIPS',

	PLAYER_HAS_MOVED: 'PLAYER-HAS-MOVED',
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

// Used to store Default values for various physics and other calculations
export const DEFAULTS = {
	CORE: {
		FRAMERATE: 30,
	},
	GENERATION: {
		SCALE: 0.01,
		LACUNARITY: 2,
		PERSISTANCE: 0.5,
		OCTAVES: 5,

		N_CRASHED_SHIPS: 20,
		INTERVAL_CRASHED_SHIPS: 173,

		N_RECHARGE_STATION: 50,
		INTERVAL_RECHARGE_STATION: 300,
	},
	KEYMAP: {
		ArrowLeft: 'N_ROTATE',
		ArrowRight: 'P_ROTATE',
		Space: 'BOOST',
		KeyE: 'TOGGLE-TAGS',

		X: 'BOOST',
		L1: 'N_ROTATE',
		R1: 'P_ROTATE',
	},
	SCATTER: {
		N: 10,
	},
	MOVEMENT_STRENGTH: {
		BOOST: 2.5,
		P_ROTATE: 0.5,
		N_ROTATE: -0.5,
	},
	DRAG: {
		rho: 1.204,
		cd: 1.05,
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
};

// Used for Socket.io events where Server wnats to broadcast to all clinets 
// expecting no acknowledgement.
export const EVENTS = {
    SERVER_TICK: 'SERVER-TICK',
    SERVER_UPDATE_PLAYERS: 'SERVER-UPDATE-PLAYERS',

}

// Used for Socket.io events where ether Client or Server wants to request data
// usually resolved by sending an acknowledgement.
export const REQUEST = {
    REQUEST_TERRAIN: {
        req: 'REQUEST-TERRAIN',
        ack: 'REQUEST-TERRAIN-ACK'
    },
    REQUEST_NEW_PLAYER: {
        req: 'REQUEST-NEW-PLAYER',
        ack: 'REQUEST-NEW-PLAYER-ACK'
    },
    REQUEST_DELETE_PLAYER: {
        req: 'REQUEST-DELETE-PLAYER',
        ack: 'REQUEST-DELETE-PLAYER-ACK'
    }
}
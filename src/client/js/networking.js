import io from 'socket.io-client'; // Interface for spinning up a connection to a namespace on the server through a socket
import { processGameUpdate } from './State/Store';

/**
 * If the protocol is https, then the websocket connection should also be secure (wss://)
 */
const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';

/**
 * Instantiating a Socket object with the URI from the current session
 * @args `reconnection: false` prevents reconnections
 */
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

const isConnected = new Promise(resolve => {

    // Listening for a "connect" event from ther server
    socket.on('connect', () => {

        // Confirmation in the browser console that the client has succesfully connected to the server
        window.console.log('----- Connection succesful -----');
        resolve();
    });
});

/**
 * Must pass in a `gameOver()` function that executes all the tasks
 * necessary for when the game has ended
 */
export const connect = gameOver => (

    // will execute if client has succesfully connected to the server
    isConnected.then(() => {
        
        // Listening for an "update" event from the server
        socket.on("update", processGameUpdate); //FIXME: Replace `processGameUpdate`

        // Listening for a "game_over" event from the server
        socket.on("game_over", gameOver);
        
        // Listening for a "disconnect" event from the server
        socket.on('disconnect', () => {

            // Confirmation in the browser console that the client has disconnected
            window.console.log('----- Disconnected from server -----');

            // TODO: Terminate the game and give the player feedback that they have disconnected
        });
    })
);

// Sends a "join_game" event to the server along with the player's `username`
export const play = username => {
    socket.emit("join_game", username);
};
  
/**
 * Sends an "input" event to the server along with the player's `state` 
 */
export const updateState = state => {
    socket.emit("input", state);
};
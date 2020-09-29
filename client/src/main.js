import io from 'socket.io-client';
import { EVENTS, REQUEST } from '../../shared/Consts';
import Engine from './Engine/Engine';
import Renderer, { Layer } from './Engine/Renderer';
import Terrain from './Objects/Terrain';

export default function main() {
    let renderer, engine

    // Spcket io instance
    const socket = io()
    
    // On connect
    socket.on('connect', () => {
        console.log('connected')

        // Initialize Renderer
        renderer = initRenderer()
        // Initialize Engine
        engine = new Engine(renderer)

        // Request terrain seed
        socket.emit(REQUEST.REQUEST_TERRAIN.req)
    })

    socket.on(REQUEST.REQUEST_TERRAIN.ack, (seed) => {
        engine.registerTerrain(
            new Terrain(seed)
        )
    })

    // Game Loop
    socket.on(EVENTS.SERVER_TICK, (dt) => {
        console.log('server-tick')
        engine.update(dt)
    })
}


function initRenderer() {
    const renderer = new Renderer({
        layers: [
            // Layer for the terrrain
            new Layer({name: 'Background', backgroundColor: 'black'}),
            //layer for Players
            new Layer({name: 'Sprite'}),

            new Layer({name: 'HUD'}),
        ]
    })
    //Get layers as divs
    const nodes = renderer.getDoccumentNodes()
    //add Layers to the page
    nodes.forEach(n => document.body.append(n))
    return renderer
}

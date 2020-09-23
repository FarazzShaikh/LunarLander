import Player from './App/Player'
import Engine from './Engine/Engine'
import Renderer, { Layer } from './Engine/Renderer'

import { Boost } from './Engine/Physics/Boost'
import { Gravity } from './Engine/Physics/Gravity'

import { Vec2D } from './utils/Vectors'
import Terrain from './App/Terrain'
import { Collision } from './Engine/Physics/Collision'

let renderer, engine

function setup() {
    renderer = new Renderer({
        layers: [
            new Layer({name: 'Background', backgroundColor: 'black'}),
            new Layer({name: 'Sprite'}),
        ]
    })
    const nodes = renderer.getDoccumentNodes()
    nodes.forEach(n => document.body.append(n))
    

    engine = new Engine({renderer: renderer})
    engine.registerTerrain(
        new Terrain()
    )
    engine.registerPlayer(
        new Player({
            name: 'Test1',
            position: new Vec2D(100, 100),
            modifiers: {
                gravity: new Gravity(),
                boost: new Boost(),
                collision: new Collision({terrain: engine.terrain})
            }
        })
    )
}

function render() {
    requestAnimationFrame(render)

    engine.update()
}

setup()
render()
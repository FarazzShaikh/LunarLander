import Player from './App/Player'
import Engine from './Engine/Engine'
import Renderer from './Engine/Renderer'
import { 
    Boost, 
    Gravity 
} from './Engine/Physics'
import { Vec2D } from './utils/Vectors'

let renderer, engine

function setup(params) {
    renderer = new Renderer()
    renderer.clear()
    document.body.append(renderer.canvas)

    engine = new Engine({renderer: renderer})
    engine.registerPlayer(
        new Player({
            name: 'Test1',
            position: new Vec2D(100, 100),
            modifiers: {
                gravity: new Gravity(),
                boost: new Boost()
            }
        })
    )
}

function render() {
    requestAnimationFrame(render)

    renderer.clear()
    engine.update()
}

setup()
render()
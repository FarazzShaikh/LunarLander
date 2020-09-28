import html from './HUD.html';
import './HUD.css'

export default class HUD {
    render(container) {
        container.innerHTML = html
    }
}
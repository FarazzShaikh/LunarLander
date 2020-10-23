import Sprite from './Sprite';

import Char_Fly from '../../Assets/Char/Fly.png';

// Class representing client side Player.
export default class Player extends Sprite {
	constructor({ id, position, rotation, scale }) {
		super({
			name: `${id}`,
			//sprite: Char_Fly,
			shadowColor: 'rgba(255, 255, 255, 0.2)',
			position: position,
			rotation: rotation,
			//scale: 0.5,
		});
	}

	removeDomNode() {
		document.querySelector(`.${this.name}`).remove();
	}
}

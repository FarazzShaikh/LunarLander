import { Node } from '../../Engine/Renderer';

export default class Planet extends Node {
	constructor({ name }) {
		const DOMnode = document.createElement('div');
		DOMnode.style.width = '50px';
		DOMnode.style.height = '50px';
		DOMnode.style.borderRadius = '100px';
		DOMnode.style.border = '1px solid #40404040';

		DOMnode.style.backgroundColor = 'black';
		DOMnode.style.boxShadow = 'inset 5px 0px 10px 0px rgba(255,255,255,0.3)';
		DOMnode.style.opacity = '1';

		DOMnode.style.position = 'absolute';
		DOMnode.style.top = '0';
		DOMnode.style.left = '0';

		super(name, DOMnode);

		this.scaleMultiplier = 5;
	}
}

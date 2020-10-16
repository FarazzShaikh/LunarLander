import PassiveObject from './_PassiveObject';

export default class Planet extends PassiveObject {
	constructor() {
		const DOMnode = document.createElement('div');
		DOMnode.style.width = '50px';
		DOMnode.style.height = '50px';
		DOMnode.style.borderRadius = '100px';
		DOMnode.style.border = '1px solid #404040';
		DOMnode.style.zIndex = '10';

		DOMnode.style.backgroundColor = 'black';
		DOMnode.style.boxShadow = 'inset 5px 0px 10px 0px rgba(255,255,255,1)';
		DOMnode.style.opacity = '0.3';

		DOMnode.style.position = 'absolute';
		DOMnode.style.top = '0';
		DOMnode.style.left = '0';

		super(DOMnode);

		this.scaleMultiplier = 1.5;
	}
}

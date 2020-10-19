import html from '../Objects/Components/HUD.html';
import '../Objects/Components/HUD.css';

export default class HUD {
	constructor() {
		this.context = undefined;
	}

	setContext(context) {
		this.context = context;
		this.context.innerHTML = html;
	}

	update({ vel, alt, timer, fuel }) {
		if (this.context) {
			const nVelX = document.querySelector('.HUD-container .HUD-main #Velocity-X');
			const nVelY = document.querySelector('.HUD-container .HUD-main #Velocity-Y');
			const nAlt = document.querySelector('.HUD-container .HUD-main #Altitude');
			const ntimer = document.querySelector('.HUD-container .HUD-Timer');
			const nfuel = document.querySelector('.HUD-container #Fuel');

			nVelX.innerHTML = this._formatString(Math.abs(vel.x) * 100) || 0;
			nVelY.innerHTML = this._formatString(Math.abs(vel.y) * 100) || 0;
			nAlt.innerHTML = this._formatString(600 - alt) || 0;
			ntimer.innerHTML = this._formatString(this._msToTime(timer)) || 0;

			const f = fuel || 0;
			nfuel.innerHTML = this._formatString(f);
		}
	}

	_formatString(val) {
		const a = [false, false, false, false, false, false, false, false, false];
		for (let i = 0; i < Math.round(val / 12.5); i++) {
			a[i] = true;
		}

		return `${a[0] ? '■' : '□'}${a[1] ? '■' : '□'}${a[2] ? '■' : '□'}${
			a[3] ? '■' : '□'
		}${a[4] ? '■' : '□'}${a[5] ? '■' : '□'}${a[6] ? '■' : '□'}${
			a[7] ? '■' : '□'
		}`;
	}

	_msToTime(s) {
		var ms = s % 1000;
		s = (s - ms) / 1000;
		var secs = s % 60;
		s = (s - secs) / 60;
		var mins = s % 60;
		secs = ('0' + secs).slice(-2);
		return +mins + ':' + secs + 's';
	}
}

export default class Store {
    constructor() {
        this.store = {}
    }

    setState(key, value) {
        this.store[key] = value
    }

    updateHUD() {
        const VelX = document.querySelector('.HUD-container .HUD-main #Velocity-X')
        const VelY = document.querySelector('.HUD-container .HUD-main #Velocity-Y')
        const Alt = document.querySelector('.HUD-container .HUD-main #Altitude')
        const timer = document.querySelector('.HUD-container .HUD-Timer')
        const fuel = document.querySelector('.HUD-container #Fuel')

        VelX.innerHTML = formatString((Math.abs(this.store.VelX) * 100)) || 0
        VelY.innerHTML = formatString((Math.abs(this.store.VelY) * 100)) || 0
        Alt.innerHTML =  formatString((this.store.seaLevel - this.store.Alt)) || 0
        timer.innerHTML =  msToTime(this.store.timer)|| 0

        const f = this.store.fuel || 0
        fuel.innerHTML = formatString(f)
    }

}

function formatString(val) {
    const a = [false, false, false, false, false, false, false, false, false]
    for (let i = 0; i < Math.round(val / 12.5); i++) {
        a[i] = true
    }

    return `${a[0] ? '■' : '□'}${a[1] ? '■' : '□'}${a[2] ? '■' : '□'}${a[3] ? '■' : '□'}${a[4] ? '■' : '□'}${a[5] ? '■' : '□'}${a[6] ? '■' : '□'}${a[7] ? '■' : '□'}`
}


function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    secs = ('0' + secs).slice(-2)
    return + mins + ':' + secs + 's';
  }
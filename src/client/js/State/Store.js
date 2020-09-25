export default class Store {
    constructor() {
        this.store = {}
    }

    setState(key, value) {
        this.store[key] = value
        this.updateHUD()
    }

    updateHUD() {
        const VelX = document.querySelector('.HUD-container .HUD-main #Velocity-X')
        const VelY = document.querySelector('.HUD-container .HUD-main #Velocity-Y')
        const Alt = document.querySelector('.HUD-container .HUD-main #Altitude')
        const timer = document.querySelector('.HUD-container .HUD-Timer')

        VelX.innerHTML = (Math.abs(this.store.VelX) * 100).toFixed(2) || 0
        VelY.innerHTML = (Math.abs(this.store.VelY) * 100).toFixed(2) || 0
        Alt.innerHTML =  (this.store.seaLevel - this.store.Alt).toFixed(2) || 0
        timer.innerHTML =  msToTime(this.store.timer)|| 0
    }
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
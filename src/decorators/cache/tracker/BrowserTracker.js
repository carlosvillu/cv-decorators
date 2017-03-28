import Tracker from './Tracker'

export default class BrowserTracker extends Tracker {
  _send ({path, headers} = {}) {
    const request = new window.XMLHttpRequest()

    request.open('GET', `${this._protocol}://${this._host}${path}`)
    request.setRequestHeader('x-payload', headers['x-payload'])
    request.send()

    this._resetStats()
  }
}

import Tracker from './Tracker'

export default class BrowserTracker extends Tracker {
  constructor ({host, algorithm, protocol = 'http', period = 1000 * 20 /* 20 seconds */, env = Tracker.ENV_BROWSER} = {}) {
    super({host, algorithm, protocol, period, env})

    this._host = host
    this._algorithm = algorithm
    this._protocol = protocol
    this._period = period
    this._env = env

    this._resetStatsAndTimer()
  }

  _send ({path, headers} = {}) {
    const request = new window.XMLHttpRequest()
    request.open('GET', `${this._protocol}://${this._host}${path}`)
    request.setRequestHeader('x-payload', headers['x-payload'])
    request.send()

    this._resetStatsAndTimer()
  }

  _shouldSend () {
    return (Math.floor(Math.random() * 100) + 1) === 1
  }
}


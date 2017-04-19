import Tracker from './Tracker'

export default class BrowserTracker extends Tracker {
  constructor ({
    algorithm,
    fnName,
    host,
    protocol,
    segmentation,
    env = Tracker.ENV_BROWSER
  } = {}) {
    super({algorithm, fnName, host, protocol, segmentation, env})
  }

  _send ({path, headers, hostname} = {}) {
    const request = new window.XMLHttpRequest()

    request.open('GET', `${this._protocol}://${hostname}${path}`)
    request.setRequestHeader('x-payload', headers['x-payload'])
    request.send()
  }
}

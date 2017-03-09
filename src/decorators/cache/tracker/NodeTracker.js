import Tracker from './Tracker'
import http from 'http'
import https from 'https'

export default class NodeTracker extends Tracker {
  constructor ({host, algorithm, protocol = 'http', period = 1000 * 20 /* 20 seconds */, env = Tracker.ENV_SERVER} = {}) {
    super({host, algorithm, protocol, period, env})

    this._host = host
    this._algorithm = algorithm
    this._protocol = protocol
    this._period = period
    this._env = env

    this._resetStatsAndTimer()
  }

  _send ({path, headers, port = 80, method = 'GET'} = {}) {
    const client = this._protocol === 'http' ? http : https
    client.get({
      hostname: this._host,
      port,
      path,
      headers
    })

    this._resetStatsAndTimer()
  }

  _shouldSend () {
    return Date.now() - this._timer > this._period
  }
}

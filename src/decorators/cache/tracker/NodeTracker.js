import Tracker from './Tracker'
import http from 'http'
import https from 'https'

export default class NodeTracker extends Tracker {
  constructor ({host, algorithm, protocol = 'http', period = 1000 * 20 /* 20 seconds */, env = 'server'} = {}) {
    super({host, algorithm, protocol, period, env})

    this._host = host
    this._algorithm = algorithm
    this._protocol = protocol
    this._period = period
    this._env = env

    this._resetStatsAndTimer()
  }

  _send ({hostname, path, port = 80, method = 'GET', headers} = {}) {
    const client = this._protocol === 'http' ? http : https
    client.request({
      hostname,
      port,
      path,
      method,
      headers
    })

    this._resetStatsAndTimer()
  }
}

import Tracker from './Tracker'
import http from 'http'
import https from 'https'

export default class NodeTracker extends Tracker {
  _send ({path, headers, port = 80, method = 'GET'} = {}) {
    const request = this._protocol === 'http' ? http : https

    request.get({
      hostname: this._host,
      port,
      path,
      headers
    })

    this._resetStats()
  }
}

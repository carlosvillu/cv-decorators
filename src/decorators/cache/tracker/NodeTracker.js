import Tracker from './Tracker'
import http from 'http'
import https from 'https'

export default class NodeTracker extends Tracker {
  _send ({path, headers, port = 80, method = 'GET'} = {}) {
    const client = this._protocol === 'http' ? http : https
    const request = client.get({
      hostname: this._host.replace(/https?:\/\//g, ''),
      port,
      path,
      headers
    })

    request.end()

    this._resetStats()
  }
}

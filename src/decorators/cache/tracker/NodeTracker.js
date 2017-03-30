import Tracker from './Tracker'
import http from 'http'
import https from 'https'

export default class NodeTracker extends Tracker {
  constructor ({
    algorithm,
    fnName,
    host,
    protocol,
    segmentation,
    env = Tracker.ENV_SERVER
  } = {}) {
    super({algorithm, fnName, host, protocol, segmentation, env})
  }

  _send ({path, headers, hostname} = {}) {
    const client = this._protocol === 'http' ? http : https
    const request = client.get({
      hostname,
      path,
      headers
    })

    request.end()
  }
}

import Tracker from './Tracker'
import http from 'http'
import https from 'https'

export default class NodeTracker extends Tracker {
  requestTo({url} = {}) {
    const client = this._protocol === 'http' ? http : https
    client.get(url)
  }
}

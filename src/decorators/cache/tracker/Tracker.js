export default class Tracker {
  constructor ({host, protocol = 'http'} = {}) {
    this._protocol = protocol
    this._host = host
  }

  send ({action, env, algorithm} = {}) {
    if (!this._host) { return }

    this.requestTo({
      url: `${this._protocol}://${this._host}/__tracking/cache/event/${env}::${action}::${algorithm}`
    })
  }

  requestTo ({url} = {}) {
    throw new Error('[Tracker#requestTo] must be implemented')
  }
}

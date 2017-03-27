export default class Tracker {
  static get ACTION_HIT () { return 'hits' }
  static get ACTION_MISSING () { return 'misses' }
  static get ENV_SERVER () { return 'server' }
  static get ENV_BROWSER () { return 'browser' }

  constructor ({
    host,
    algorithm,
    protocol = 'http',
    segmentation = 20,
    env = Tracker.ENV_SERVER
  } = {}) {
    this._host = host
    this._algorithm = algorithm
    this._protocol = protocol
    this._segmentation = segmentation
    this._env = env

    this._resetStats()
  }

  track ({action} = {}) {
    if (!this._host || !this._period) { return }

    this._stats = {
      ...this._stats,
      [action]: ++this._stats[action]
    }

    if (
      this._shouldSend() &&
      this._env === Tracker.ENV_SERVER
    ) {
      this._send({
        path: '/__tracking/cache/event/stats',
        headers: {'x-payload': JSON.stringify({
          env: this._env,
          algorithm: this._algorithm,
          ...this._stats
        })}
      })
    }
  }

  _resetStats () {
    this._stats = { hits: 0, misses: 0 }
  }

  _send ({hostname, path} = {}) {
    throw new Error('[Tracker#_send] must be implemented')
  }

  _shouldSend () {
    return Math.floor(Math.random() * 100) + 1 <= this._segmentation
  }
}

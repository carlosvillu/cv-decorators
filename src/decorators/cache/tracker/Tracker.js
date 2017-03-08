export default class Tracker {
  static get ACTION_HIT () { return 'hits' }
  static get ACTION_MISSING () { return 'misses' }

  track ({action} = {}) {
    if (!this._host || !this._period) { return }

    this._stats = {
      ...this._stats,
      [action]: ++this._stats[action]
    }

    if (
      this._shouldSend() &&
      this._env === 'server'
    ) {
      this._send(
        {
          hostname: `${this._protocol}://${this._host}`,
          path: '/__tracking/cache/event/stats',
          headers: {'x-payload': JSON.stringify({
            env: this._env,
            algorithm: this._algorithm,
            ...this._stats
          })}
        }
      )
    }
  }

  _resetStatsAndTimer () {
    this._timer = Date.now()
    this._stats = { hits: 0, misses: 0 }
  }

  _send ({hostname, path} = {}) {
    throw new Error('[Tracker#_send] must be implemented')
  }

  _shouldSend () {
    throw new Error('[Tracker#_shouldSend] must be implemented')
  }

}

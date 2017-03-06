import Cache from './Cache'
import Guild from 'guild'

export default class LFU extends Cache {
  constructor () {
    super()
    this._lfu = Guild.cacheWithSize(100)
  }

  get (key) { return this._lfu.get(key) }
  set (key, value) { return this._lfu.put(key, value) }
  del (key) { this._lfu.remove(key) }
}

import Cache from './Cache'
import LRUCache from 'lru-cache'

export default class LRU extends Cache {
  constructor () {
    super()
    this._lru = new LRUCache(100)
  }

  get (key) { return this._lru.get(key) }
  set (key, value) { return this._lru.set(key, value) }
  del (key) { this.set(key, undefined) }
}


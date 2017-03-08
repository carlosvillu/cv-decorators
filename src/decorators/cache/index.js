import isNode from '../../helpers/isNode'
import md5 from '../../helpers/md5'
import stringOrIntToMs from '../../helpers/stringOrIntToMs'

import LRU from './algorithms/LRU'
import LFU from './algorithms/LFU'

import Tracker from './tracker'

const DEFAULT_TTL = 500

const isPromise = (obj) => typeof obj !== 'undefined' &&
  typeof obj.then === 'function'

const _cache = ({ttl, target, name, instance, original, server, algorithm, host} = {}) => {
  const cache = algorithm === 'lru' ? new LRU()
                : algorithm === 'lfu' ? new LFU()
                : new Error(`[cv-decorators::cache] unknow algorithm: ${algorithm}`)
  const tracker = new Tracker({host, algorithm})

  return (...args) => {
    const key = `${target.constructor.name}::${name}::${md5.hash(JSON.stringify(args))}`
    const now = Date.now()
    if (cache.get(key) === undefined) {
      tracker.track({action: Tracker.ACTION_MISSING})
      cache.set(key, {createdAt: now, returns: original.apply(instance, args)})
    } else {
      tracker.track({action: Tracker.ACTION_HIT})
    }

    if (isPromise(cache.get(key).returns)) {
      cache.get(key).returns.catch(() => cache.del(key))
    }

    if ((now - cache.get(key).createdAt) > ttl) {
      cache.del(key)
    }

    return cache.get(key) !== undefined ? cache.get(key).returns
                                        : original.apply(instance, args)
  }
}

export default ({ttl = DEFAULT_TTL, server = false, algorithm = 'lru', trackTo: host} = {}) => {
  const timeToLife = stringOrIntToMs({ttl}) || DEFAULT_TTL
  return (target, name, descriptor) => {
    const { value: fn, configurable, enumerable } = descriptor

    if (isNode && !server) { return descriptor }

    // https://github.com/jayphelps/core-decorators.js/blob/master/src/autobind.js
    return Object.assign({}, {
      configurable,
      enumerable,
      get () {
        if (this === target) { return fn }
        const _fnCached = _cache({
          ttl: timeToLife, target, name, instance: this, original: fn, server, algorithm, host
        })

        Object.defineProperty(this, name, {
          configurable: true,
          writable: true,
          enumerable: false,
          value: _fnCached
        })
        return _fnCached
      },
      set (newValue) {
        Object.defineProperty(this, name, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: newValue
        })

        return newValue
      }
    })
  }
}

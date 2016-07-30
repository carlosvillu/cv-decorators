import isNode from '../helpers/isNode'
import md5 from '../helpers/md5'
import stringOrIntToMs from '../helpers/stringOrIntToMs'

const DEFAULT_TTL = 500

const __CACHE__ = {}
const _cache = ({ttl, target, name, instance, original} = {}) => {
  return (...args) => {
    const key = `${target.constructor.name}::${name}::${md5.hash(JSON.stringify(args))}`
    const now = +new Date()
    if (__CACHE__[key] === undefined) {
      __CACHE__[key] = {createdAt: now, returns: original.apply(instance, args)}
    }

    // http://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise/38339199#38339199
    if (Promise.resolve(__CACHE__[key].returns) === __CACHE__[key].returns) {
      __CACHE__[key].returns.catch(() => delete __CACHE__[key])
    }

    if ((now - __CACHE__[key].createdAt) > ttl) {
      delete __CACHE__[key]
    }

    // Dump cache to console if setting to truthy '__dumpCache__' key in localStorage
    window.localStorage.__dumpCache__ && !!JSON.parse(window.localStorage.__dumpCache__) &&
    (console.clear() || console.log(__CACHE__))

    return __CACHE__[key] !== undefined ? __CACHE__[key].returns
                                        : original.apply(instance, args)
  }
}

export default ({ttl = DEFAULT_TTL} = {}) => {
  const timeToLife = stringOrIntToMs({ttl}) || DEFAULT_TTL
  return (target, name, descriptor) => {
    const { value: fn, configurable, enumerable } = descriptor

    if (isNode) { return descriptor }

    // https://github.com/jayphelps/core-decorators.js/blob/master/src/autobind.js
    return Object.assign({}, {
      configurable,
      enumerable,
      get () {
        if (this === target) { return fn }
        const _fnCached = _cache({ttl: timeToLife, target, name, instance: this, original: fn})

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

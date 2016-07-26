import isNode from '../helpers/isNode'
import md5 from '../helpers/md5'

const __CACHE__ = {}
const _cache = ({ttl, Target, name, original} = {}) => {
  return (...args) => {
    const key = `${Target.constructor.name}::${name}::${md5.hash(JSON.stringify(args))}`
    const now = +new Date()
    if (__CACHE__[key] === undefined) {
      __CACHE__[key] = {createdAt: now, returns: original.apply(original, args)}
    }

    if ((now - __CACHE__[key].createdAt) > ttl) {
      delete __CACHE__[key]
    }

    // Dump cache to console if setting to truthy '__dumpCache__' key in localStorage
    window.localStorage.__dumpCache__ && !!JSON.parse(window.localStorage.__dumpCache__) &&
    (console.clear() || console.log(__CACHE__))

    return __CACHE__[key] !== undefined ? __CACHE__[key].returns
                                        : original.apply(original, args)
  }
}

export default ({ttl = 500} = {}) => {
  return (Target, name, descriptor) => {
    return isNode ? descriptor
                  : Object.assign({}, descriptor, {value: _cache({ttl, Target, name, original: descriptor.value})})
  }
}

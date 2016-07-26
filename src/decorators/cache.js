import isNode from '../helpers/isNode'

const __CACHE__ = {}
const _cache = ({ttl, original} = {}) => {
  return (...args) => {
    const key = JSON.stringify(args)
    const now = +new Date()
    if (__CACHE__[key] === undefined) {
      __CACHE__[key] = {createdAt: now, returns: original.apply(original, args)}
    }

    if ((now - __CACHE__[key].createdAt) > ttl) {
      delete __CACHE__[key]
    }
    return __CACHE__[key] !== undefined ? __CACHE__[key].returns
                                        : original.apply(original, args)
  }
}

export default ({ttl = 500} = {}) => {
  return (Target, name, descriptor) => {
    return isNode ? descriptor
                  : Object.assign({}, descriptor, {value: _cache({ttl, original: descriptor.value})})
  }
}

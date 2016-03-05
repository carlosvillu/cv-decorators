import Rx from 'rx-lite'

const createObserver = (proto, method, originalMethod) => {
  return (observer) => {
    proto[method] = function (...args) {
      try {
        const result = originalMethod.apply(this, args)

        if (result && result.then && typeof result.then === 'function') { // is a Promise?
          result
            .then((value) => observer.onNext({params: args, result: value}))
            .catch((error) => observer.onError({params: args, error}))
        } else if (result) {
          observer.onNext({params: args, result})
        }
        return result
      } catch (error) {
        observer.onError({params: args, error})
        throw error
      }
    }
  }
}

const reducer = (Target, proto, method) => {
  const originalMethod = Target.prototype[method]
  proto.$ = proto.$ || {}
  proto.$[method] = Rx.Observable.create(createObserver(proto, method, originalMethod)).publish()
  proto.$[method].connect()
  return proto
}

export default (...methods) => {
  return (Target) => {
    Target.prototype = Object.assign(
      Target.prototype,
      methods
        .filter((method) => !!Target.prototype[method])
        .reduce(reducer.bind(null, Target), {})
    )
    return Target
  }
}


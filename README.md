[![Build Status](https://travis-ci.org/carlosvillu/cv-decorators.svg)](https://travis-ci.org/carlosvillu/cv-decorators)

# cv-decorators
List of ES6 decorators

## Streamify

Creates a stream of calls to any method of a class. *Dependency of RxJS*

```javascript
import {streamify} from 'cv-decorators';

@streamify('greeting', 'greetingAsync')
class Person {
    greeting(name){
        return `Hi ${name}`;
    }

    greetingAsync(name){
        return new Promise( resolve => setTimeout(resolve, 100, `Hi ${name}`) );
    }
}

const person = new Person();

person.$.greeting.subscribe(({params, result}) => {
    console.log(`method was called with ${params} and response was "${result}"`); // => method was called with ['Carlos'] and response was "Hi Carlos"
});

person.$.greetingAsync.subscribe(({params, result}) => {
    console.log(`method was called with ${params} and response was "${result}"`); // => method was called with ['Carlos'] and response was "Hi Carlos"
});

person.greeting('Carlos');
person.greetingAsync('Carlos');
```
## Cache

Creates a cache of calls to any method of a class.

```javascript
import {cache} from 'cv-decorators';

class Dummy {
  @cache()
  syncRndNumber (num) { return Math.random() }
}
const dummy = new Dummy()

const firstCall = dummy.syncRndNumber()
const secondCall = dummy.syncRndNumber()

// => firstCall === secondCall
```
Dump cache to console if setting to truthy '__dumpCache__' key in localStorage:

```javascript
localStorage.__dumpCache__ = true
```

By default the TTL for the keys in the cache is 500ms, but it can be changed with

```javascript
import {cache} from 'cv-decorators';

class Dummy {
  @cache({ttl: 2000})
  syncRndNumber (num) { return Math.random() }
}
```

For this method the cache is 2 seconds

It is possible to set TTL using a string with the format `ttl: 'XXX [second|seconds|minute|minutes|hour|hours]'`, 
thus, avoiding writing very large integers
[Example](https://github.com/carlosvillu/cv-decorators/blob/feature/string-for-time/test/cacheSpec.js#L163)

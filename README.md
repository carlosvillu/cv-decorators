[![Build Status](https://travis-ci.org/carlosvillu/cv-decorators.svg)](https://travis-ci.org/carlosvillu/cv-decorators)

# cv-decorators
List of ES6 decorators

## Streamify

Creates a stream of calls to any method of a class. *Dependency of RxJS*

```javascript
import {streamify} from 'cv-decorators';

@streamify('greetting', 'greettingAsync')
class Person {
    greetting(name){
        return `Hi ${name}`;
    }

    greettingAsync(name){
        return new Promise( resolve => setTimeout(resolve, 100, `Hi ${name}`) );
    }
}

const person = new Person();

person.$.greeting.subscribe(({params, result}) => {
    console.log(`Was called with ${params} and response "${result}"`); // => Was called with ['carlos'] and response "Hi carlos"
});

person.$.greettingAsync.subscribe(({params, result}) => {
    console.log(`Was called with ${params} and response "${result}"`); // => Was called with ['carlos'] and response "Hi carlos"
});

person.greeting('carlos');
person.greettingAsync('carlos');
```
## Cache

Create a cache of calls to any method of a class.

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

By default the TTL for the keys in the cache is 500ms. But you can change it with:


```javascript
import {cache} from 'cv-decorators';

class Dummy {
  @cache({ttl: 2000})
  syncRndNumber (num) { return Math.random() }
}
```

For this method the cache is 2 seconds

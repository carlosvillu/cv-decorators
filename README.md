[![Build Status](https://travis-ci.org/carlosvillu/cv-decorators.svg)](https://travis-ci.org/carlosvillu/cv-decorators)

# cv-decorators
List of ES6 decorators

## Streamify

Permite crear un stream de llamadas a cualquier método de una clase. *Dependencia de RxJS*

```javascript
import {streamify} from 'cv-decorators';

@streamify('greetting', 'greettingAsync')
class Person {
    greetting(name){
        return `Hi ${name}`;
    }

    greettingAsync(name){
        return new Promise( resolve => setTimeout(resolve(`Hi ${name}`), 100) );
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


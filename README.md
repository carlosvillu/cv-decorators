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


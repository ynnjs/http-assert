# ynn-http-assert

Like [http-assert](https://github.com/jshttp/http-assert), but has more features for using in some web frameworks, such as Koa.

## Installation

```sh
$ npm i --save ynn-http-assert
```

## Usage

```js
const koa = require( 'koa' );
const assert = require( 'ynn-http-assert' );

const app = new Koa();

app.use( async ( ctx, next ) => {
    const id = assert( ctx.query.id, 400, 'id is required' )
        .is( 'int', 'invalid id' )
        .between( [ 100, 1000 ] )
        .value();

    const pn = assert( ctx.query.pn )
        .default( 1 )
        .is( 'int' )
        .gt( 0 )
        .value();

    const email = assert( ctx.query.email, 400, 'email is required' )
        .is( 'email' )
        .custom( v => v.startWith( 'abc' ) )
        .value();

    const username = await assert( ctx.query.username )
        .custom( v => {
            return Promise.reject();
        }, 400, 'username is invalid' )
        .value();

    return next();
} );
```

## API

**assert(value, [status], [message], [properties])**

### Assertion

**default(value)**

To set a default value if the value doesn't pass any of the assertions, and then all the assertions rest will be ignored.

```js
const x = assert( ctx.query.x ) // if the ctx.query.x is not truthy, the value will be set to 100
    .default( 100 )
    .is( 'int' ) // if the value is not an integer, the value will be set to 100
    .value();
```

**value([v])**

To set/get the value of Assertion instance.

```js
const x = assert( ctx.query.x )
    .custom( function( v ) { 
        this.value( 'new-value' );  // to set the value to 'new-value'
    } ).
    value(); // to get the value
```

**equal(data, [status], [message], [properties])**

**notEqual(data, [status], [message], [properties])**

**strictEqual(data, [status], [message], [properties])**

**notStrictEqual(data, [status], [message], [properties])**

**deepEqual(data, [status], [message], [properties])**

**notDeepEqual(data, [status], [message], [properties])**

**is(type, [status], [message], [properties])**

**gt(n, [status], [message], [properties])**

**gte(n, [status], [message], [properties])**

**lt(n, [status], [message], [properties])**

**lte(n, [status], [message], [properties])**

**between(interval, [status], [message], [properties])**

**length(interval, [status], [message], [properties])**

**regex(regex, [status], [message], [properties])**

**json(fn, [status], [message], [properties])**

**custom(fn, [status], [message], [properties])**

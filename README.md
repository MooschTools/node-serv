# Serv

A super simple, and super fast HTTP server for NodeJS projects.

If you want to spin up a NodeJS http server, and you don't have fancy requirements, this is the module for you.

You don't need the weight of [Express](https://expressjs.com/), [Koa](https://koajs.com/), [Fastify](https://fastify.dev/) etc. They are great in their arenas, but they have a lot behind them that you maybe don't need.

You _could_ (and perhaps should?) write your server with `node:http` directly. But it's a fair few lines of code, and I don't know about you, but I _always_ need to check the [NodeJS docs](https://nodejs.org/docs/latest-v20.x/api/http.html) to make sure I have it right.

## Usage

This can be found in [testbed](./testbed/index.js).

```javascript
import { Serv } from './index.js';

const PORT = process.env.port || 4001;
const server = new Serv();

server.use( auth );
server.use( reqLogger );

server.get( '/', root ); 

server.listen( PORT, address => {
    console.log( `Running on http://localhost:${address.port}` );
});

function root( _req, res )
{
    res.send( 200, { data: 'ok' } );
}

function auth( _req, _res, next )
{
    console.log( 'Auth request' );
    // Do some fancy auth stuff here
    next();
}

function reqLogger( _req, _res, next )
{
    console.log( 'Hey, we got a request! I hope we can handle it...' );
    next();
}
```

## Todo

- [ ] Route-based middleware.
- [ ] Route based error handling.
- [ ] Investiage if agents are a good idea

## FAQ

**Is it production ready?**
Yes. It works, and it doesn't kill your CPU or Memory. You can use it in production. In fact, I have. But, it's your call.

**Why not just use module XYZ?**
Because I like building things, and I like to understand how to build things. The same could be asked when using external modules. Why not just use `node:http`?

**Why not TypeScript?**
Because it's JavaScript. There's JSDoc annotations for your IDE to help you, but TypeScript (IMO) doesn't add as much value as I get from properly typed languages, and I feel like it adds a lot of extra noise to the code. Not to mention the fact that I feel when writing TypeScript, I'm _definitely not_ writing JavaScript, which is a shame.

**Why is it a `"type": "module"`?**
Just because Node has been draggin it's feet with ESModules, it doesn't mean _we_ have to! Let's embrace the future, together.

## Author

[@moosch](https://github.com/moosch)


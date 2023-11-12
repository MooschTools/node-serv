import { Serv } from '../index.js';

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


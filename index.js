import http from 'node:http';

/**
 * @typedef {Function} Next
 * @return {void}
 */

/**
 * @typedef {Function} Middleware
 * @param {object} request
 * @param {object} response
 * @param {Next} next
 */

/**
 * @typedef {Function} Handler
 * @param {object} request
 * @param {object} response
 */

/**
 * @typedef {Function} Response.send
 * @param {number} statusCode
 * @param {string|object} data - Object or string response
 */

/**
 * @typedef {object} Response - extends http.Response
 * @param {function} Response.send
 */

class Serv
{
    server;
    middlewares = [];
    routes = {};
    methods = {
        GET: 'GET',
        POST: 'POST',
    };
    onError;

    constructor()
    {
        this.server = http.createServer();

        this.server.on( 'request', (req, res) => this.requestHandler( req, res ) );

        this.server.on( 'error', err => this.handleError( err ));
    }

    /**
     * 
     * 
     */
    async requestHandler( request, response )
    {
        let error;
        middlewareLoop: for ( let i = 0, l = this.middlewares.length; i < l;  i++ )
        {
            const next = err => {
                if ( err != null )
                    error = err;
                return;
            };
            if ( error != null )
                break middlewareLoop;
            // @note(moosch): Should `next` be a generator?
            await this.middlewares[i]( request, response, next );
        }

        if ( error != null )
        {
            // @todo(moosch): Needs a better way to handle specific errors.
            response.writeHead( 500, { 'Content-Type': 'application/json' });
            response.end( JSON.stringify({ error: err.toString() + '\n' }) );
            return;
        }

        if ( this.routes[ request.url ] == null || !this.routes[ request.url ].hasOwnProperty( request.method ) )
            return this.notFound( request, response );

        this.routes[ request.url ][ request.method ]( this.request( request ), this.response( response ));
    }

    request( req )
    {
        return req;
    }

    response( res )
    {
        return {
            raw: res,
            send: ( code, data, headers = { 'Content-Type': 'application/json' } ) => {
                res.writeHead( code, headers );
                res.end( JSON.stringify( data ) );
            }
        };
    } 

    /**
     * Add middleware functions to requests.
     * Note: These are ran BEFORE the route request handler.
     * 
     * @param {Middleware} middleware
     */
    use( middleware )
    {
        this.middlewares.push( middleware );
    }

    method( type, route, handler )
    {
        if ( route == null && handler == null )
            throw new Error( 'Missing arguments in app.get( route, handler );' );
        if ( handler == null && typeof route == 'function' )
        {
            handler = route;
            route = '/';
        }


        if ( this.routes[ route ] != null && this.routes[ route ][ type ] != null )
            throw new Error( `Duplicate method (${type}) for route ("${route}")` );

        this.routes[ route ] = {
            [type]: handler
        };
    }

    /**
     * Define GET handler.
     *
     * @param {string} route - A route to accept GET requests on.
     * @param {Handler} handler - function to handle requests.
     * @returns {void}
    */
    get( route, handler )
    {
        this.method( this.methods.GET, route, handler );
    }

    /**
     * Define POST handler.
     *
     * @param {string} route - A route to accept POST requests on.
     * @param {Handler} handler - function to handle requests.
     * @returns {void}
    */
    post( route, handler)
    {
        this.method( this.methods.POST, route, handler );
    }

    /**
     * Define uncaught error handler.
     *
     * @param {Handler} handler - function to handle unhandled exceptions.
     * @returns {void}
    */
    error( handler )
    {
        if ( typeof handler !== 'function' )
            throw new Error( 'Must provide an error handler function to .error()' );

        this.onError = handler;
    }

    /**
     * Start server listening for requests.
     *
     * @param {number} port - The port to accept requests on.
     * @param {function} callback - called after the server starts.
     * @returns {void}
    */
    listen( port, callback )
    {
        if ( port == null && callback == null )
            port = 8080;
        if ( typeof port === 'function' )
        {
            callback = port;
            port = 8080;
        }

        this.server.listen( Number( port ), () => {
            const { address, family, port } = this.server.address();
            console.log( `Listening: ${address}:${port} on ${family}` );
            if ( callback != null ) callback( this.server.address() );
        });
    }

    /**
     * Close the server.
     * 
     * @param {function} callback - called after the server shuts down.
     * @returns {void}
    */
    close( callback )
    {
        this.server.close( callback )
    }

    handleError( err )
    {
        if ( this.onError != null )
            return this.onError( err );

        console.error( err );
        throw new Error( `Unhandled server error: ${err.message || err.toString()}` ); 
    }

    notFound( request, response )
    {
        response.writeHead( 404 );
        response.end( 'Not Found\n' );
    }
}

export { Serv };


const assert = require( '../src' );

function katch( fn ) {
    try { 
        return fn();
    } catch( e ) {
        return e;
    }
}

describe( 'basic', () => {
    it( 'assert', () => {
        expect( assert( 'a' ) ).toBeTruthy();
        expect( assert( 'a', 400 ) ).toBeTruthy();
        expect( () => assert( false, 400 ) ).toThrow();
        const error = katch( () => assert( false, 400, 'e' ) );
        expect( error ).toHaveProperty( 'status', 400 );
        expect( error ).toHaveProperty( 'message', 'e' );
    } );

    it( 'error', () => {
        const ins = assert( 400, {} );
        expect( ins.message ).toEqual( undefined );
    } );
} );

describe( 'Methods', () => {
   
    it( 'default', () => {
        expect( assert( null ).default( 'x' ).value() ).toEqual( 'x' );
        expect( assert( null ).default( 'x' ).custom( () => false ).value() ).toEqual( 'x' );
        expect( assert( 'a' ).default( 'x' ).custom( () => false ).value() ).toEqual( 'x' );
        expect( assert( 'a' ).default().is( 'int' ).value() ).toEqual( undefined );
    } );

    it( 'length', () => {
        expect( assert( 'abc' ).length( [ 0, 3 ] ) ).toBeTruthy();
        expect( () => assert( 'abc', 400 ).length( [ 0, 1 ] ) ).toThrow();
    } );

    it( 'regex', () => {
        expect( assert( '122' ).regex( /^\d+$/ ) ).toBeTruthy();
        expect( () => assert( '12a', 400 ).regex( /^\d+$/ ) ).toThrow();
    } );

    it( 'deepEqual', () => {
        expect( assert( { a : 1 } ).deepEqual( { a : 1 } ) ).toBeTruthy();
        expect( () => assert( { a : 1 }, 400 ).deepEqual( { a : 1, b : 2 } ) ).toThrow();
    } );

    it( 'json', () => {
        expect( assert( '{"a":1}' ).json() ).toBeTruthy();
        expect( () => {
            assert( '{"a":1}' ).json( function( json ) {
                this.value( json );
            } ).custom( v =>  v.hasOwnProperty( 'a' ) );
        } ).toBeTruthy();
        expect( () => assert( '{a:1}', 400 ).json() ).toThrow();
        expect( () => {
            assert( '{"a":1}', 400 ).json( function( json ) {
                this.value( json );
            } ).custom( v =>  v.hasOwnProperty( 'b' ) );
        } ).toThrow();
    } );

    it( 'custom sync', () => {
        expect( assert( 'a' ).custom( () => true ) ).toBeTruthy();
        const error = katch( () => assert( 'a' ).custom( () => false, 401, 'e' ) );
        expect( error ).toHaveProperty( 'status', 401 );
        expect( error ).toHaveProperty( 'message', 'e' );
    } );

    it( 'custom async pass', () => {

        return expect( assert( 'a' ).custom( () => Promise.resolve( true ) ).value() ).resolves.toEqual( 'a' );
         
    } );

    it( 'custom async error', () => {
        return expect( assert( 'a' ).custom( () => Promise.reject( true ) ).value() ).rejects.toThrow();
         
    } );

    it( 'between', () => {
        expect( assert( '2', 400 ).between( [ 0, 4 ] ) ).toBeTruthy();
        expect( assert( 'B', 400 ).between( [ 'A', 'B' ] ) ).toBeTruthy();
        expect( () => assert( '10', 400 ).between( [ 0, 4 ] ) ).toThrow();
        expect( () => assert( 'C', 400 ).between( [ 'A', 'B' ] ) ).toThrow();
    } );

    it( 'in', () => {
        expect( assert( 'x', 400 ).in( [ 'x', 'y' ] ) ).toBeTruthy();
        expect( assert( '1', 400 ).in( [ 1, 'x', 'y' ] ) ).toBeTruthy();
        expect( () => assert( 'x', 400 ).in( [] ) ).toThrow();
    } );

    it( 'is email', () => {
        expect( assert( 'a@b.com', 400 ).is( 'email' ) ).toBeTruthy();
        expect( () => assert( 'b.com', 400 ).is( 'email' ) ).toThrow();
    } );

    it( 'is int', () => {
        expect( assert( '100', 400 ).is( 'int' ) ).toBeTruthy();
        expect( () => assert( '1.1', 400 ).is( 'int' ) ).toThrow();
    } );

    it( 'is integer', () => {
        expect( assert( '100', 400 ).is( 'integer' ) ).toBeTruthy();
        expect( () => assert( '1.1', 400 ).is( 'integer' ) ).toThrow();
    } );

    it( 'is number', () => {
        expect( assert( '100.001', 400 ).is( 'number' ) ).toBeTruthy();
        expect( () => assert( '1.x', 400 ).is( 'number' ) ).toThrow();
    } );

    it( 'is ip', () => {
        expect( assert( '127.0.0.1', 400 ).is( 'ip' ) ).toBeTruthy();
        expect( assert( '::', 400 ).is( 'ip' ) ).toBeTruthy();
        expect( () => assert( '::::', 400 ).is( 'ip' ) ).toThrow();
    } );

    it( 'is ipv4', () => {
        expect( assert( '127.0.0.1', 400 ).is( 'ipv4' ) ).toBeTruthy();
        expect( () => assert( '::', 400 ).is( 'ipv4' ) ).toThrow();
    } );

    it( 'is ipv6', () => {
        expect( assert( '::', 400 ).is( 'ipv6' ) ).toBeTruthy();
        expect( () => assert( '127.0.0.1', 400 ).is( 'ipv6' ) ).toThrow();
    } );

    it( 'url', () => {
        expect( assert( 'http://www.baidu.com', 400 ).is( 'url' ) ).toBeTruthy();
        expect( () => assert( '127.0.0.1', 400 ).is( 'url' ) ).toThrow();
    } );

    it( 'get undefined value', () => {
        expect( assert( undefined ).value() ).toBeUndefined();
    } );
} );

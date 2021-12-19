console.log( "Adding sql-wasm.js")
const s = document.createElement( 'script' );
s.setAttribute( 'src', '/sql-wasm.js' );
document.body.appendChild( s );

window.loadSQL = async () => {
    console.log( "Trying to load SQL" )

    return await initSqlJs({
        locateFile: file => `/${file}`
      })
}

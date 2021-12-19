window.loadSQL = async () => {
    console.log( "Trying to load SQL" )

    return await initSqlJs({
        locateFile: file => `/${file}`
      })
}
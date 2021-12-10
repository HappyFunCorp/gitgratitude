'use strict'

const lockfile = require('@yarnpkg/lockfile');

module.exports = async (event, context) => {
    const result = {
        'dependencies': []
    }

    const deps = lockfile.parse( event.body.toString() ).object

    Object.keys( deps ).forEach( (elem, index) => {
        result['dependencies'].push( [ elem, deps[elem].version ] )
    } )
    
    return context
        .status(200)
        .succeed(result)
}

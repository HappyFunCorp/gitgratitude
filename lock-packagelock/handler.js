'use strict'

module.exports = async (event, context) => {
    const result = {
        'dependencies': []
    }

    let lockfile = JSON.parse(event.body);

    Object.keys(lockfile.dependencies).forEach( (elem,index) => {
        result['dependencies'].push( [ elem, lockfile.dependencies[elem].version ] )
    });

    return context
        .status(200)
        .succeed(result)
}

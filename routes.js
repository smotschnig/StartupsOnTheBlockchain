const routes = require('next-routes')();

routes
    .add('/projects/new', '/projects/new')
    .add('/projects/:address', '/projects/show')
    .add('/profile', '/profile/user')

module.exports = routes;
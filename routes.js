const routes = require('next-routes')();

routes
    .add('/projects/new', '/projects/new')
    .add('/projects/:address', '/projects/show')
    .add('/profile/:address', '/profile/user')
    .add('/profile/users/:address', '/profile/getprofile')
    .add('/information', '/information')

module.exports = routes;
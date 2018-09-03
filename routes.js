const routes = require('next-routes')();

routes
    .add('/projects/new', '/projects/new')
    .add('/projects/:address', '/projects/show')
    .add('/projects/:address/request', '/requests/request')
    .add('/projects/:address/requesterlist', '/requests/requesterlist')
    .add('/profile/:address', '/profile/user')
    .add('/profile/users/:address', '/profile/getprofile')
    .add('/information', '/information')

module.exports = routes;
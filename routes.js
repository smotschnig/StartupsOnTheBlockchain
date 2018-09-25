const routes = require('next-routes')();

routes
    .add('/projekt/neu', '/projects/new')
    .add('/projekt/:address', '/projects/show')
    .add('/projekt/:address/bewerbung', '/projects/requests/request')
    .add('/projekt/:address/bewerberpool', '/projects/requests/requesterlist')
    .add('/projekte/offen/:address', '/projects/status/open')
    .add('/projekte/offen/:address/beenden', '/projects/status/finalize')
    .add('/bewerberpool/:address', '/profile/getprofile')
    .add('/profil/:address', '/profile/user')
    .add('/profil/benutzer/:address', '/profile/getprofile')
    .add('/informationen', '/information')

module.exports = routes;
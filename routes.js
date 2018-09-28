const routes = require('next-routes')();

routes
    .add('/projekt/neu', '/projects/new')
    .add('/projekt/:address', '/projects/show')
    .add('/projekt/:eigenes/:address', '/projects/show')
    .add('/projekt/:address/bewerbung', '/projects/requests/request')
    .add('/projekt/:address/bewerberpool', '/projects/requests/requesterlist')
    .add('/projekte/offen/:address', '/projects/status/open')
    .add('/projekte/offen/:address/beenden', '/projects/status/finalize')
    .add('/bewerberpool/:address', '/profile/showuserprofile')
    .add('/profil/:address', '/profile/userprofile')
    .add('/profil/benutzer/:address', '/profile/showuserprofile')
    .add('/projekt/:projectaddress/:address', '/profile/showuserprofile')
    .add('/projekt/:projectaddress/:bewerber/:address', '/profile/showuserprofile')
    .add('/informationen', '/information')

module.exports = routes;

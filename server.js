// const express = require('express');
// const next = require('next');
// const { parse } = require('url');

// const dev = process.env.NODE_ENV !== 'production';
// const PORT = process.env.PORT || 3000;

// const app = next({ dir: '.', dev });
// const handle = app.getRequestHandler();

// const routes = require('./routes');

// app.prepare().then(() => {
//     const server = express();
//     server.get('*', (req, res) => {
//         const parsedUrl = parse(req.url, true);
//         const { pathname, query = {} } = parsedUrl;
//         const route = routes[pathname];
//         if (route) {
//             return app.render(req, res, route.page, query);
//         }
//         return handle(req, res);
//     });

//     server.listen(PORT, (err) => {
//         if (err) throw err;
//         console.log(`> Ready on http://localhost:${PORT}`);
//     });
// });

// const { createServer } = require('http');
// const next = require('next');

// const app = next({
//     dev: process.env.NODE_ENV !== 'production'
// });

// const routes = require('./routes');
// const handler = routes.getRequestHandler(app);

// app.prepare().then(() => {
//     createServer(handler).listen(3000, (err) => {
//         if (err) throw err;
//         console.log('Ready on localhost:3000');
//     });
// });


const { createServer } = require('http');
const next = require('next');

const app = next({
    dev: process.env.NODE_ENV !== 'production',
    conf: {
        webpack: config => {
            config.devtool = false;

            for (const r of config.module.rules) {
                if (r.loader === 'babel-loader') {
                    r.options.sourceMaps = false;
                }
            }

            return config;
        }
    }
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, err => {
        if (err) throw err;
        console.log('Ready on localhost:3000');
    });
});
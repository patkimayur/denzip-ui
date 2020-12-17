import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { join } from 'path';
import { renderModuleFactory } from '@angular/platform-server';
import { readFileSync } from 'fs';
import { Response } from 'express';
import { Request } from 'express';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();


// Express server
export const app = express();

// in local use below
// const DIST_FOLDER = join(process.cwd(), 'dist/browser');
 const DIST_FOLDER = join(process.cwd(), 'crs-rental-ui/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');
const template = readFileSync(join(DIST_FOLDER, 'index.html')).toString();

const cors = require('cors');

const originsWhitelist = [
  'https://localhost:4200',      // front-end url for development
  'https://www.denzip.com',
  'https://13.127.93.182',
  'https://172.31.27.162', // prod 2
  'https://172.31.21.163', // prod 3
  'https://172.31.26.127'
];

// as the cert is local we need this, security flaw I know but it is what it is
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const corsOptions = {
  origin: function (origin, callback) {
    const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
};

app.use(cors(corsOptions));


const https = require('https');
const http = require('http');
const fs = require('fs');

// in local use below
// const options = {
//   key: fs.readFileSync('./ssl/angular-server.key'),
//   cert: fs.readFileSync('./ssl/angular-server.crt')
// };

const port = process.env.PORT || 4200;


// in local use below
// https.createServer(options, app).listen(port, () => {
//   console.log(`Listening on: https://localhost:${port}`);
// });

// prod 2 setting
// http.createServer(app).listen(port, '172.31.27.162', () => {
//   console.log(`Listening on: https://localhost:${port}`);
// });

// prod 3 setting
http.createServer(app).listen(port, '172.31.21.163', () => {
    console.log(`Listening on: https://localhost:${port}`);
});

// prod 1 setting
// http.createServer(app).listen(port, '172.31.26.127', () => {
//   console.log(`Listening on: https://localhost:${port}`);
// });



// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));


app.set('view engine', 'html');
app.set('views', DIST_FOLDER);


// in local use below
// app.get('/images/**', function (req, res) {
//   const modifiedURL = 'https://localhost:8082/crs';
//   return res.redirect(modifiedURL + req.url);
// });

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));


/* Root route before static files, or it will serve a static index.html, without pre-rendering */
app.get('/', angularRouter);

/* Direct all routes to index.html, where Angular will take care of routing */
app.get('*', angularRouter);


function angularRouter(req, res) {
  res.render('index', {
    req,
    res
  });
}


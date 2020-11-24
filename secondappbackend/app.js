'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
const request = require('request');
const session = require('express-session');
const SqlStore = require('express-mysql-session')(session);
const passport = require('passport');

const KeystoneStrategy = require('./passport-keystone');

const rootPath = path.join(__dirname, '../ClientApp/dist/ClientApp');

const sqlOptions = {
    host: 'localhost',
    port: 3306,
    user: 'alan',
    password: '1234',
    database: 'tempdb'
}

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon('favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new SqlStore(sqlOptions);

app.use(session({
    key: 'argo_cookie',
    secret: 'do not need to know',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new KeystoneStrategy({
    authUrl: 'http://183.111.177.141/identity/v3/auth/tokens'
}, /*(req, identity, done) => {
        console.log('req: ');
        console.log(req);
        console.log('identity: ');
        console.log(identity);
        console.log('done function: ?');
        console.dir(done);
    if (!req.user) {

        // Handle V3 API differences
        var newCatalog = {};
        if (identity.serviceCatalog) {
            newCatalog = identity.serviceCatalog;
        } else {
            newCatalog = identity.raw.access.serviceCatalog;
        }

        var user = {
            id: identity.user.id,
            token: identity.token.id,
            username: identity.user.name,
            serviceCatalog: newCatalog,
            domainName:'default'
        };

        // Set session expiration to token expiration
        req.session.cookie.expires = Date.parse(identity.token.expires) - Date.now();

        done(null, user);
    } else {
        // user already exists
        var user = req.user; // pull the user out of the session
        return identity(null, user);
    }
}*/ (req, done) => {
    console.log(Object.keys(req));
    console.log(Object.keys(req.token));
    req.user.tokenId = req.token.id;
    console.log(req.token);
    done(null, req.user)
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.get(['/', '/summary/?', '/admin/?', '/workflows/?', '/workflow-templates/?',
    '/cluster-workflow-templates/?', '/login', '/login/*'],
    function (req, res) {
        res.sendFile(path.join(rootPath, 'index.html'));
    });
// End of front-end routing
///////////////////////////
app.use(express.static(rootPath, { index: false }));

app.use('/account', require('./routes/account'));
app.use('/project', require('./routes/project'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(err.status || 500);
        res.send(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.send('sorry');
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

var _ = require('underscore'),
    path = require('path'),
    express = require('express'),
    http = require('http'),
    uuid = require('node-uuid'),
    app = express(),
    server = http.Server(app),
    io = require('socket.io')(server),
    sessions = {};

app.
    get('/normalize.css', bower('normalize.css', 'normalize.css')).
    get('/angular.js', bower('angular', 'angular.js')).
    get('/session/:id', function (req, res) {

        var session;

        if (req.params.id in sessions) {
            session = sessions[req.params.id];
            res.send('yup');
        } else {
            res.status(404).send('Sorry, the session you were looking for does not seem to exist.');
        }
    }).
    get('/session', function (req, res) {

        var buffer = new Buffer(32),
            sessionId;

        uuid.v4(null, buffer, 0);
        uuid.v4(null, buffer, 16);
        sessionId = uuid.v4.unparse(buffer);

        console.log('new session', sessionId);

        sessions[sessionId] = {};
        res.redirect('/session/' + sessionId);
    }).
    use(express.static(path.join(__dirname, 'static'))).
    listen(3000, function () {
        console.log('listening');
    });

function bower() {
    var pathToComponent = path.join.apply(path, [__dirname, 'bower_components'].concat(_.values(arguments)));
    return function (req, res) {
        res.sendfile(pathToComponent);
    };
}


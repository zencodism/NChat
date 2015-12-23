var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uid = require('uid');

var db = require('./database'); // only Message model is exported
var config = require('./config');
var log = require('./logging');

var crontab = require('node-crontab'); // for scheduled database cleanup

db.sync().then(function(){
    crontab.scheduleJob("0 0 */" +
                        config.days_to_destroy + " * *", function(){
        log.warn("Scheduled database cleanup.");
        db.truncate();
    });
});

app.use(express.static('static'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
/*    db.findAll().then(function(messages){
        messages.forEach(function(message){
            io.emit('incoming', message);
        });
    });
*/            
    var user = uid(18);
    log.info("User connected, generated username: " + user);
    var message = {
        'time': new Date(),
        'user': "Server",
        'text': "New connection, marked as " + user
    };
    io.emit('incoming', message);
    socket.on('incoming', function(msg){
        log.info("Passing down message: " + msg);
        var message = {
            'time': new Date(),
            'user': user,
            'text': msg
        };
 /*       db.create({
            user: message.user,
            time: message.time,
            text: message.text
        });
  */      io.emit('incoming', message);
    });
});


http.listen(config.port, function(){
  log.info('Server up and running, listening at port ' + config.port);
});

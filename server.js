var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uid = require('uid');

var db = require('./database'); // only Message model is exported

var crontab = require('node-crontab'); // for scheduled database cleanup

db.sync().then(function(){
    crontab.scheduleJob("0 0 */10 * *", function(){
        db.truncate();
    });
});

app.use(express.static('static'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
    db.findAll().then(function(messages){
        messages.forEach(function(message){
            io.emit('incoming', message);
        });
    });
        
    
    var user = uid(18);
    socket.on('incoming', function(msg){
        var message = {
            'time': new Date(),
            'user': user,
            'text': msg
        };
        db.create({
            user: message.user,
            time: message.time,
            text: message.text
        });
        io.emit('incoming', message);
    });
});


http.listen(8000, function(){
  console.log('Server up and running, listening at port 8000');
});

var socket = io();
        
$('form').submit(function(){
    socket.emit('incoming', $('#m').val());
    $('#m').val('');
    return false;
});


socket.on('incoming', function(msg){
    var time = msg.time,
        user = msg.user,
        text = msg.text;
    $('#messages').append($('<li>').text(time + " " + user + " " + text));
});
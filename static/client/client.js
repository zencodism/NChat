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
        
    var pattern = "<span class='time'>" + time + "</span>" +
        "<span class='user'>" + user + "</span>" +
        "<span class='text'>" + text + "</span>";
    $('#messages').append($('<li>').html(pattern));
});
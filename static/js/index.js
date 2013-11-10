var state = {
};

function search() {
  var q = $('#search-text').val();
  if(!q) {
    return;
  }

  $.get('/conference/search?q=' + q, function(d) {
    console.log(d);
  });
};

function rooms(rooms) {
  $('#active-list').replaceWith('<ul id="active-list"></ul');
  for(var i=0; i<rooms.length; ++i) {
    var room = rooms[i];
    $('#active-list').append('<li><a href="' + room.url + '">' + room.title  + '</a></li>');
  }
};

$(function() {
  state.socket = io.connect();
  state.socket.on('connect', function() {
    state.socket.on('rooms', rooms);
  });
  $('#search').click(search);
});

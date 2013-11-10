var state = {};

function search() {
  var q = $('#search-text').val();
  if (!q) {
    return;
  }

  $('#search-results').replaceWith('<ul id="search-results"></ul');
  $.get('/conference/search?q=' + q, function(rooms) {
    for (var i = 0; i < rooms.length; ++i) {
      var room = rooms[i];
      $('#search-results').append('<li><a href="' + room.url + '">' + room.title + '</a></li>');
    }
  });
};

function rooms(rooms) {
  $('#active-list').replaceWith('<ul id="active-list"></ul');
  for (var i = 0; i < rooms.length; ++i) {
    var room = rooms[i];
    $('#active-list').append('<li><a href="' + room.url + '">' + room.title + '</a></li>');
  }
};

$(function() {
  state.socket = io.connect();
  state.socket.on('connect', function() {
    state.socket.on('rooms', rooms);
  });
  $('#search').click(search);
  $('#search-text').keypress(function(e) {
    if (e.keyCode == 13)
      $('#search-text').click();
  });
});

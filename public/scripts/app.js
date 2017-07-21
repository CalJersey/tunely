/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


/* hard-coded data! */
var sampleAlbums = [];
sampleAlbums.push({
             artistName: 'Ladyhawke',
             name: 'Ladyhawke',
             releaseDate: '2008, November 18',
             genres: [ 'new wave', 'indie rock', 'synth pop' ]
           });
sampleAlbums.push({
             artistName: 'The Knife',
             name: 'Silent Shout',
             releaseDate: '2006, February 17',
             genres: [ 'synth pop', 'electronica', 'experimental' ]
           });
sampleAlbums.push({
             artistName: 'Juno Reactor',
             name: 'Shango',
             releaseDate: '2000, October 9',
             genres: [ 'electronic', 'goa trance', 'tribal house' ]
           });
sampleAlbums.push({
             artistName: 'Philip Wesley',
             name: 'Dark Night of the Soul',
             releaseDate: '2008, September 12',
             genres: [ 'piano' ]
           });
/* end of hard-coded data */




$(document).ready(function() {
  console.log('app.js loaded!');
    $.ajax({
    method: 'GET',
    url: '/api/albums',
    success: handleSuccess,
    error: handleError
  });
  $('#album-form form').on('submit', function(e){
    e.preventDefault();
    let formData = $(this).serialize();
    console.log(formData);
    $.post('/api/albums', formData, function(albums) {
      console.log('album after POST', albums);
      renderAlbum(albums);  //render the server's response
      $(this).trigger("reset");
    });
  });
  $('#albums').on('click', '.add-song', function(e) {
    var id= $(this).closest('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
    $('#songModal').attr('data-album-id',id);
    $('#songModal').modal()
  });

  $('#albums').on('click', '.del-album', function(e) {
    console.log('delete');
    var id= $(this).closest('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
    $.ajax({
      method: 'DELETE',
      url: `/api/albums/${id}`,
      success: deleteAlbumSuccess,
      error: handleError
    });
  });

  $('#saveSong').on('click', function (){
    handleNewSongSubmit();
  });

});

function handleSuccess(albums){
    albums.forEach(function(i){
      renderAlbum(i);
    });
};

function handleError(err){
  console.log('There has been an error: ', err);
}


// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album', album);


  var albumHtml = (`
    <div class="row album" id="${album._id}" data-album-id="${album._id}">
      <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
          <div class="panel-body">
          <!-- begin album internal row -->
            <div class='row'>
              <div class="col-md-3 col-xs-12 thumbnail album-art">
                <img src="images/800x800.png" alt="album image">
              </div>
              <div class="col-md-9 col-xs-12">
                <ul class="list-group">
                  <li class="list-group-item">
                    <h4 class='inline-header'>Album Name:</h4>
                    <span class='album-name'>${album.name}</span>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header'>Artist Name:</h4>
                    <span class='artist-name'>${album.artistName}</span>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header'>Released date:</h4>
                    <span class='album-releaseDate'>${album.releaseDate}</span>
                  </li>
                  <li class="list-group-item">
                    <h4 class="inline-header">Songs:</h4>
                    <span id="${album._id}-songs"></span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- end of album internal row -->
            <div class='panel-footer'>
              <button class='btn btn-primary add-song'>Add Song</button>
              <button class='btn btn-primary del-album'>Delete Album</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- end one album -->
  `);
  $('#albums').append(albumHtml);
  renderSongs(album);
};

function renderSongs(album){
  var songHtml = "";
  album.songs.sort(function(a, b) {
    return a - b;
  });
  album.songs.forEach(function(song, i){
    return songHtml = songHtml + `${i+1}: ${song.name} `;
  })
  let spanId = `#${album._id}-songs`;
  $(spanId).html(songHtml);
}

function handleNewSongSubmit(){
  var albumId = $('#songModal').data('albumId');
  var requestUrl = `http://localhost:3000/api/albums/${albumId}/songs`;
  // var songName = $('#songName').val().serialize();
  // var trackNumber = $('#trackNumber').val().serialize();
  var data = $("#modalForm").serialize();
  console.log(data);
  $.ajax({
    method: 'POST',
    url: requestUrl,
    data: data,
    success: renderSongs,
    error: handleError
  });
}

function deleteAlbumSuccess(albumId){
  id = `#${albumId.albumId}`;
  $(id).empty();
}

// this function takes a single album and renders it to the page
// sampleAlbums.forEach()

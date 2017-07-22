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

  $('#albums').on('click', '.edit-album', function(e) {
    console.log('edit');
    var id= $(this).closest('.album').data('album-id');
    var selectorId = `#${id}`,
    selectorIdAlbumInput = `${selectorId} .albumInput`,
    selectorIdAlbumData = `${selectorId} .albumData`,
    selectorIdSaveAlbum = `${selectorId} .save-album`,
    selectorIdEditAlbum = `${selectorId} .edit-album`;

    $(selectorIdAlbumInput).css("display","inline");
    $(selectorIdAlbumData).css("display","none");
    $(selectorIdSaveAlbum).css("display","inline");
    $(selectorIdEditAlbum).css("display","none");


  });

$('#albums').on('click', '.save-album', function(e) {
  var id= $(this).closest('.album').data('album-id');
  let formIdSelector = `#${id}-update`;
  let data = $(formIdSelector).serialize();

  $.ajax({
    method: 'PUT',
    url: `/api/albums/${id}`,
    data: data,
    success: updateAlbumSuccess,
    error: handleError
  });
});
  // $('#albums').on('click', '.save-album', function(e) {
  //   e.preventDefault();
  //   $.ajax({
  //     method: 'UPDATE',
  //     url: `/api/albums/${id}`,
  //     success: updateAlbumSuccess,
  //     error: handleError
  //   });
  // });

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
    <form id="${album._id}-update" action="#" onsubmit="return false" method="PUT" class="album-update-form" name="${album._id}-update">
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
                    <span id="${album._id}-name" class='albumData'>${album.name}</span>
                    <span id="${album._id}-name-input-span" class='albumInput'>
                      <input id="${album._id}-name-input" type="text" name="name" value="${album.name}" size="${album.name.length}" required>
                    </span>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header'>Artist Name:</h4>
                    <span id="${album._id}-artistName" class='albumData'>${album.artistName}</span>
                    <span id="${album._id}-artistName-input-span" class='albumInput'>
                      <input id="${album._id}-artistName-input" type="text" name="artistName" size="${album.artistName.length}" value="${album.artistName}" required>
                    </span>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header'>Released date:</h4>
                    <span id="${album._id}-releaseDate" class='albumData'>${album.releaseDate}</span>
                    <span id="${album._id}-releaseDate-input-span" class='albumInput'>
                      <input id="${album._id}-releaseDate-input" type="text" name="releaseDate"  size="${album.releaseDate.length}" value="${album.releaseDate}" required>
                    </span>
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
              <button class='btn btn-primary edit-album'>Edit Album</button>
              <button class='btn btn-primary save-album'>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      </form>
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

function updateAlbumSuccess(album){

  let selectorId = `#${album._id}`,
  selectorIdAlbumInput = `${selectorId} .albumInput`,
  selectorIdAlbumData = `${selectorId} .albumData`,
  selectorIdSaveAlbum = `${selectorId} .save-album`,
  selectorIdEditAlbum = `${selectorId} .edit-album`,

  selectorAlbumName = `${selectorId}-name`,
  selectorArtistName = `${selectorId}-artistName`,
  selectorReleaseDate = `${selectorId}-releaseDate`,

  selectorAlbumNameInput = `${selectorId}-name-input`,
  selectorArtistNameInput = `${selectorId}-artistName-input`,
  selectorReleaseDateInput = `${selectorId}-releaseDate-input`;

  albumName = $(selectorAlbumNameInput).val();
  $(selectorAlbumName).html(albumName);

  albumArtistName = $(selectorArtistNameInput).val();
  $(selectorArtistName).html(albumArtistName);

  albumReleaseDate = $(selectorReleaseDateInput).val();
  $(selectorReleaseDate).html(albumReleaseDate);

  $(selectorIdAlbumInput).css("display","none");
  $(selectorIdAlbumData).css("display","inline");
  $(selectorIdSaveAlbum).css("display","none");
  $(selectorIdEditAlbum).css("display","inline");

}
// this function takes a single album and renders it to the page
// sampleAlbums.forEach()

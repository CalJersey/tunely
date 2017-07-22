var db = require('../models');

// controllers/albumsController.js

// GET /api/albums
function index(req, res) {
  db.Album.find({}, function(err, allAlbums){
    res.json(allAlbums);
  })
}

// POST /api/albums
function create(req, res) {
  // create an album based on request body and send it back as JSON

  // split at comma and remove and trailing space
  var genres = req.body.genres.split(',').map(function(item) { return item.trim(); } );
  req.body.genres = genres;
  // create an album based on request body and send it back as JSON
  db.Album.create(req.body, function(err, album) {
    if (err) { console.log('error', err); }
    console.log(album);
    res.json(album);
  });
}

// GET /api/albums/:albumId
function show(req, res) {
  // find one album by id and send it back as JSON
}

// DELETE /api/albums/:albumId
function destroy(req, res) {
  db.Album.findByIdAndRemove(req.params.albumId, function(err,album){
    if (err) {res.status(500).json({error:err.message});
    }
    res.json({albumId:req.params.albumId});
  })
  // find one album by id, delete it, and send it back as JSON
}

// PUT or PATCH /api/albums/:albumId
function update(req, res) {
  db.Album.findById(req.params.albumId, function(err,album){
    console.log('req.body:', JSON.stringify(req.body));
    if (err) {res.status(500).json({error:err.message});
    }
    album.name = req.body.name;
    album.artistName = req.body.artistName;
    album.releaseDate = req.body.releaseDate;
    album.save(function(err,savedAlbum){
      if (err) {res.status(500).json({error:err.message});
      }
      res.json(album);
    });
  });
}

// controllers/albumsController.js
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};

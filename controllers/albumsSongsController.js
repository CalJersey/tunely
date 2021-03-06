var db = require('../models');

function index(req, res) {
}

function create(req, res) {
  db.Song.create(req.body, function(err, song){
    if (err) {res.status(500).json({error:err.message});
    }
    db.Album.findById(req.params.albumId, function(err, album){
      if (err) {res.status(500).json({error:err.message});
      }
      album.songs.splice(song.trackNumber-1, 0, song);
      album.save(function(err, album){
        if (err) {res.status(500).json({error:err.message});
        }
        res.json(album);
      });
    });
  });
};

// GET /api/albums/:albumId
function show(req, res) {
  // find one album by id and send it back as JSON
}

// DELETE /api/albums/:albumId
function destroy(req, res) {
  // find one album by id, delete it, and send it back as JSON
}

// PUT or PATCH /api/albums/:albumId
function update(req, res) {
  // find one album by id, update it based on request body,
  // and send it back as JSON
}



module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};

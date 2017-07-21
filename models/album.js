// require mongoose and seutp Schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Song = require("./song.js");

  var AlbumSchema = new Schema({
       artistName: String,
       name: String,
       releaseDate: String,
       genres: [String],
       songs:[Song.schema]
  });
// create Schema

var Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;

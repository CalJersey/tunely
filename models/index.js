// require mongoose and connect it to the localhost:db
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tunely');

module.exports.Album = require("./album.js");
module.exports.Song = require("./song.js");

// requiring controllers within index

module.exports = {
  api: require('./apiController'),
  albums: require('./albumsController'),
  songs: require('./albumsSongsController')
}

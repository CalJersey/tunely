// requires express & body-parser to be used in our application
let express = require('express'),
  bodyParser = require('body-parser');

  // connect to models
  let db = require('./models');

// generate a new express app and call it 'app'
  let app = express();

// requiring controllers to connect to controller directory
  let controllers = require('./controllers');

  // server static files from public folder
  app.use(express.static('public'));

  // body-parser config to accept our data-types
  app.use(bodyParser.urlencoded({ extended:true }));

// routes

app.get('/', function (req, res) {
  res.sendFile('views/index.html', {root:__dirname});
    console.log(__dirname);
});

app.get('/api', controllers.api.index);
app.get('/api/albums', controllers.albums.index);
app.post('/api/albums', controllers.albums.create);


app.listen(process.env.PORT || 3000, function (){
  console.log("Express Server is up and running on http://localhost:3000/");
});

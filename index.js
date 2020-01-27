const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

const settings = require('./config');

const authRoutes = require('./routes/auth'),
  postRoutes = require('./routes/post');

let app = express();
app.listen(3000, () => {
  console.log('listening on port 3000');
});
function configure() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  configureRouters();
}

function configureRouters() {
  app.use('/auth', authRoutes);
  app.use('/posts', postRoutes);
}

function connectToDB() {
  const uri = settings.database;
  const options = {
    autoIndex: false,
    bufferCommands: false,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  mongoose
    .connect(uri, options)
    .then(() => configure())
    .catch(err => {
      console.error('Server starting error:', err.stack);
      process.exit(1);
    });
}
connectToDB();

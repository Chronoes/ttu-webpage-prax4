/* eslint no-console: 0 */
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('remote'));

app.all('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/remote/index.html'));
});

const server = app.listen(1337, function() {
  const port = server.address().port;
  console.log('Listening on ' + port);
});

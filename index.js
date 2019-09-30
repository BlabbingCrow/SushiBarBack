// содежимое index.js
// const http = require('http');
// const port = process.env.PORT || 3001;
// const requestHandler = (request, response) => {
//     console.log(request.url);
//     response.end('Hello Node.js Server!');
// }
// const server = http.createServer(requestHandler);
// server.listen(port, (err) => {
//     if (err) {
//         return console.log('something bad happened', err);
//     }
//     console.log(`server is listening on ${port}`);
// })


const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let db = require('./db');
db.connect();
  

const port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));

require('./node_routes')(app, db);

app.listen(port, () => {
  console.log('We are live on ' + port);
});
const express = require('express'),
app = express();

const cors = require("cors");
const { parse } = require('path');

var url = require('url');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 3

app.use(cors({ origin: '*' }))

app.get('/about', (request, response) => {
	console.log('Calling "/about" on the Node.js server.')
	response.type('text/plain')
	response.send('This is a website that utilizes server-side node.js to implement Syllibye.')
})

app.get('/api/ping', (request, response) => {
	console.log('Calling "/api/ping"')
	response.type('text/plain')
	response.send('ping response')
})

// Custom 404 page.
app.use((request, response) => {
    response.type('text/plain')
    response.status(404)
    response.send('404 - Not Found')
})
  
// Custom 500 page.
app.use((err, request, response, next) => {
    console.error(err.message)
    response.type('text/plain')
    response.status(500)
    response.send('500 - Server Error')
})

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://KrabbyPatties:WhoLiv3sInAPin3appl3%3F@syllabyedb.pdubk1g.mongodb.net/?retryWrites=true&w=majority&appName=SyllaByeDB";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.listen(port, () => console.log(
    `Express started at \"http://localhost:${port}\"\n` +
    `press Ctrl-C to terminate.`)
)
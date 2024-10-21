const express = require('express'),
app = express();

// const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
const fs = require('fs');
const cors = require('cors');
const { parse } = require('path');

var url = require('url');

const port = process.env.PORT || 3000
const majorVersion = 1
const minorVersion = 3

app.use(cors({origin: '*' }));

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

// app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', (req, res) => {
  const filePath = path.join(__dirname,'public','courses.json');


  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const jsonData = JSON.parse(data);

    res.json(jsonData);
  });
});

// Route to handle POST requests for course materials
app.post('/submit-course-materials', (req, res) => {
  const { textbooks, supplements } = req.body;

  if (!textbooks || !supplements) {
    return res.status(400).json({ error: 'Missing textbooks or supplements information' });
  }

  // Store data in Firebase Realtime Database
  set(ref(db, 'materials/' + textbooks), {
    textbooks: textbooks,
    supplements: supplements
  })
    .then(() => {
      res.json({ message: 'Data entry successful!' });
    })
    .catch((error) => {
      console.error('Error storing data in Firebase:', error);
      res.status(500).json({ error: 'Failed to store data in Firebase' });
    });
});


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

/*
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
*/
app.listen(port, () => console.log(
    `Express started at \"http://localhost:${port}\"\n` +
    `press Ctrl-C to terminate.`)
)

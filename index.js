import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const url = require('url');

const port = process.env.PORT || 3000;
const majorVersion = 1;
const minorVersion = 3;

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json()); // Allow parsing JSON body

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQthMiRyG7rs8x-bX-uaOgpOCwGxwDogk",
  authDomain: "syllabye-7f9b8.firebaseapp.com",
  databaseURL: "https://syllabye-7f9b8-default-rtdb.firebaseio.com",
  projectId: "syllabye-7f9b8",
  storageBucket: "syllabye-7f9b8.appspot.com",
  messagingSenderId: "914730272947",
  appId: "1:914730272947:web:cb70b9b64ab37d5d0fc8c6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Serve a test route
app.get('/about', (request, response) => {
  console.log('Calling "/about" on the Node.js server.');
  response.type('text/plain');
  response.send('This is a website that utilizes server-side node.js to implement Syllibye.');
});

// Serve another test route
app.get('/api/ping', (request, response) => {
  console.log('Calling "/api/ping"');
  response.type('text/plain');
  response.send('ping response');
});

// Serve a static data file
app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'courses.json');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

// Enable preflight requests for the /submit-course-materials endpoint
app.options('/submit-course-materials', cors()); // Enable CORS for preflight

// Route to handle POST requests for course materials
app.post('/submit-course-materials', (req, res) => {
  const { textbooks, supplements } = req.body;

  // if (!textbooks || !supplements) {
  //   return res.status(400).json({ error: 'Missing textbooks or supplements information' });
  // }

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
  response.type('text/plain');
  response.status(404);
  response.send('404 - Not Found');
});

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message);
  response.type('text/plain');
  response.status(500);
  response.send('500 - Server Error');
});

// Start the server
app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`
));


// const express = require('express'),
// app = express();

// const bodyParser = require('body-parser');
// const { initializeApp } = require('firebase/app');
// const { getDatabase, ref, set } = require('firebase/database');

// const fs = require('fs')
// const cors = require('cors');
// const { parse } = require('path');

// var url = require('url');

// const port = process.env.PORT || 3000
// const majorVersion = 1
// const minorVersion = 3

// app.use(cors({origin: '*' }));

// // Your web app's Firebase configuration

// const firebaseConfig = {

//   apiKey: "AIzaSyCQthMiRyG7rs8x-bX-uaOgpOCwGxwDogk",

//   authDomain: "syllabye-7f9b8.firebaseapp.com",

//   databaseURL: "https://syllabye-7f9b8-default-rtdb.firebaseio.com",

//   projectId: "syllabye-7f9b8",

//   storageBucket: "syllabye-7f9b8.appspot.com",

//   messagingSenderId: "914730272947",

//   appId: "1:914730272947:web:cb70b9b64ab37d5d0fc8c6"

// };

// const firebaseApp = initializeApp(firebaseConfig);
// const db = getDatabase(firebaseApp);

// app.get('/about', (request, response) => {
// 	console.log('Calling "/about" on the Node.js server.')
// 	response.type('text/plain')
// 	response.send('This is a website that utilizes server-side node.js to implement Syllibye.')
// })

// app.get('/api/ping', (request, response) => {
// 	console.log('Calling "/api/ping"')
// 	response.type('text/plain')
// 	response.send('ping response')
// })



// // app.use(express.static(path.join(__dirname, 'public')));

// app.get('/data', (req, res) => {
//   const filePath = path.join(__dirname,'public','courses.json');


//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       console.error('Error reading JSON file:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     const jsonData = JSON.parse(data);

//     res.json(jsonData);
//   });
// });

// /*
// app.use(express.json({ limit: '50mb' }));

// app.post('/save/json', (req, res) => {
//     const data = req.body; 
//     const filePath = './JSON/file.json';

//     // Convert JSON object to string
//     const dataString = JSON.stringify(data, null, 4);

//     // Write the string to a file
//     fs.writeFile(filePath, dataString, 'utf8', (err) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ message: 'Failed to save data' });
//         } else {
//             res.json({ message: 'Data saved successfully' });
//         }
//     });
// });
// */

// // Custom 404 page.
// app.use((request, response) => {
//     response.type('text/plain')
//     response.status(404)
//     response.send('404 - Not Found')
// })
  
// // Custom 500 page.
// app.use((err, request, response, next) => {
//     console.error(err.message)
//     response.type('text/plain')
//     response.status(500)
//     response.send('500 - Server Error')
// })

// /*
// const { MongoClient } = require('mongodb');

// const uri = "mongodb+srv://KrabbyPatties:WhoLiv3sInAPin3appl3%3F@syllabyedb.pdubk1g.mongodb.net/?retryWrites=true&w=majority&appName=SyllaByeDB";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function connectToDatabase() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// }

// connectToDatabase();
// */
// app.listen(port, () => console.log(
//     `Express started at \"http://localhost:${port}\"\n` +
//     `press Ctrl-C to terminate.`)
// )

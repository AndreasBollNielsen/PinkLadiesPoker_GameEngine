const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

//List to carry the carddeck.
let cardDeck = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());




//Testing if there is connection
app.get('/api/test', (req, res) => {
    res.status(200).send("Der er hul igennem")
});


// Create cardDeck Factory

// Mix cards with (random number. Not the normal random!)
// Add cards to stack.
//another test

// testing
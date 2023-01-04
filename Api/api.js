const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const encryption = require("./LogicHandlers/Encryption");

const crypto = require("crypto"); //only for testing purposes

//List to carry the carddeck.
let cardDeck = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//create AES keys when api is starting, before anything else, to ensure that AES key and IV exists.
encryption.CreateAES();


// only for testing puposes.
const {publicKey, privateKey} = crypto.generateKeyPairSync("rsa",{modulusLength: 2048});

//endpoints
app.get('/api/GetAES', async (req,res) => {

    const key = req.body.publicKey;
    console.log(publicKey);
  const encryptedData =  encryption.EncryptRSA(publicKey);
  // encryption.EncryptRSA(publicKey);
  //res.json(encryptedData);
  res.status(200).send(encryptedData);

});

//Testing if there is connection
app.get('/api/test', (req, res) => {
    res.status(200).send("Der er hul igennem")
});


// Create cardDeck Factory

// Mix cards with (random number. Not the normal random!)
// Add cards to stack.
//another test

// testing1
app.listen(port, () => {
    console.log(`port is listening ${port}`);
  });
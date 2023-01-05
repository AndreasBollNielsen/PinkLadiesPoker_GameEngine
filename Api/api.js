const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const encryption = require("./LogicHandlers/Encryption");
const lobby = require('./LogicHandlers/Lobby');
const pokerTable = require('./LogicHandlers/PokerTable');
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

//Get AES keys
app.get('/api/GetAES',(req,res) => {

    const key = req.body.publicKey;
    console.log(publicKey);
  const encryptedData =  encryption.EncryptRSA(publicKey);
 
  res.status(200).send(encryptedData);

});

//create new user
app.post('/api/CreateUser', (req,res) => {

  const encryptedUser = req.body.userName;

  const decryptedUser = encryption.DecryptAES(encryptedUser);
  lobby.CreateUser(decryptedUser);

  res.status(200).send("user created!");

});


//user interactions
app.post('/api/Useraction', (req,res) =>{

  const encryptedUserAction = req.body.userAction;

  const decryptedUserAction = encryption.DecryptAES(encryptedUserAction);
  pokerTable.UpdateUserState(decryptedUserAction.action,decryptedUserAction.value);

  res.status(200).send("user interacting");

});

// play game again
app.post('/api/PlayAgain',(req,res) => {

  const encryptedUserID = req.body.userID;

  const decryptedUserID = encryption.DecryptAES(encryptedUserID);
  pokerTable.AddToPokerTable(decryptedUserID);

  res.status(200).send("replay!");

});

//leave poker table
app.post('/api/LeaveTable',(req,res) => {

  const encryptedUserID = req.body.userID;

  const decryptedUserID = encryption.DecryptAES(encryptedUserID);
  pokerTable.LeavePokerTable(decryptedUserID);

  res.status(200).send("replay!");

});

//Testing if there is connection
app.get('/api/test', (req, res) => {
    res.status(200).send("Der er hul igennem")
});

//test til 
app.get('/api/testCardDeck',(req,res) =>{

  const cardDeckManager = require('./Managers/CardDeckManager');
  const mixedCardDeck = cardDeckManager.NewCardDeck();

  res.status(200).send(mixedCardDeck);
})


app.get('/api/ruleManagerTest', (req,res) => {

  const ruleManager = require('./Managers/RuleManager.js');
 let result = ruleManager.analyzeHand("10♥ j♥ q♥ k♥ a♥");
 res.status(200).send(result);
});

// Create cardDeck Factory

// Mix cards with (random number. Not the normal random!)
// Add cards to stack.
//another test

// testing1
app.listen(port, () => {
    console.log(`port is listening ${port}`);
  });
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const encryption = require("./LogicHandlers/Encryption");
const lobby = require('./LogicHandlers/Lobby');
//const pokerTable = require('./LogicHandlers/PokerTable');
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

//test rulemanager
app.get('/api/ruleManagerTest', (req,res) => {

  const ruleManager = require('./Managers/RuleManager.js');
  let hand= ["2H", "2D", "2C", "kC", "qD", "10D", "3C"];
 let result = ruleManager.analyzeHand(hand);
 res.status(200).send(result);
});

//test cleaning lady
app.post('/api/cleaningLady',(req,res) => {

  const housekeeping = require('./LogicHandlers/CleaningLady');
const PokerTable =  require('./LogicHandlers/PokerTable');
const User = require('./Models/User');
  let pokerTable = new PokerTable();

  //create test users
  for (let index = 0; index < 5; index++) {
    
    let user = new User();
    user.UserID = index;
    user.UserName = "user_" + index+1;
    user.Saldo = 1000;
    if(index === 4)
    {
      user.Saldo = 0;
    }
    
    //add test users to poker table
    pokerTable.users.push(user);
    
  }

  //add poker table to lobby
  lobby.pokerTables.push(pokerTable);
  console.log(lobby.pokerTables);

//find user with user id of 4
  let user = lobby.pokerTables[0].users.find(({UserID}) => UserID === 4);
  
  //move user with userID 4 to waitinguser
 //housekeeping.MoveUserToWaitingUsers(user.id);

});

// Create cardDeck Factory

// Mix cards with (random number. Not the normal random!)
// Add cards to stack.
//another test

// testing1
app.listen(port, () => {
    console.log(`port is listening ${port}`);
  });
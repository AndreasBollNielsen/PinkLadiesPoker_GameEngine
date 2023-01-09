const CleaningLady = require('./CleaningLady');
let PokerTable = class{

    
     users =[];
     bets =[];
     collectiveCards =[];
     cardDeck =[];
    dealer;
     constructor(){

     };
    
     UpdateUserState = (action,value) =>{
        
        
    }
    
    LeavePokerTable = (userID) =>{
        
        
    }
    
    AddToPokerTable = (user) =>{
        
        
    }

    VerifyOrKickPlayer = () =>{
        
        for (let index = 0; index < users.length; index++) {
           
            //kick player
            if(users[index].Saldo ===0)
            {

            }
            
        }
    }
    
};

module.exports = PokerTable;
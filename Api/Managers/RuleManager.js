ruleManager = {};
const FACES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "j",
  "q",
  "k",
  "a",
];
const SUITS = ["H", "D", "C", "S"];

ruleManager.CompareHands = (pokerTable) => {
  //temporary array of cards from
  let playerHands = [];
  //  console.log("pokertable: ", pokerTable);

  //Adding playerhands to temp array
  for (let i = 0; i < pokerTable.users.length; i++) {
    let userTempcards = [];
    userTempcards = pokerTable.users[i].PocketCards;

    //console.log("pokerTable collectivecards: ", pokerTable.collectiveCards);

    userTempcards.push(...pokerTable.collectiveCards);
    //console.log("userTempcards: ", userTempcards);
    let userData = {
      tempHands: userTempcards,
      cardResult: { handName: "", handValue: 0, shift: 0 },
    };
    playerHands.push(userData);

    console.log("user data: ", userData);
  }

  for (let i = 0; i < playerHands.length; i++) {
    // console.log("temp hands: ", playerHands[i].tempHands);
    let result = ruleManager.analyzeHand(playerHands[i].tempHands);
    playerHands[i].cardResult = result;

    // console.log("cardresult: ", playerHands[i].cardResult);
  }

  //step one, go through all players and return an array containing the users with the highest hand value 0-10
  let highestHands = [];

  highestHands.push(playerHands[0]);

  for (let i = 0; i < playerHands.length; i++) {
    for (let j = 0; j < highestHands.length; j++) {
      if (
        i == 0 &&
        playerHands[i].cardResult.handValue ==
          highestHands[j].cardResult.handValue
      ) {
        // console.log("replacing first straight");
        highestHands = [];
        highestHands.push(playerHands[i]);

        //console.log(highestHands.length);
      } else if (
        i != 0 &&
        playerHands[i].cardResult.handValue ==
          highestHands[j].cardResult.handValue
      ) {
        if (playerHands[i].tempHands != highestHands[j].tempHands) {
          //  console.log("adding straight");
          highestHands.push(playerHands[i]);
        }
        j++;
        //console.log(highestHands.length);
      } else if (
        playerHands[i].cardResult.handValue >
        highestHands[j].cardResult.handValue
      ) {
        //  console.log("this is larger: ", playerHands[i].cardResult.handValue);
        //  console.log("replacing");
        highestHands = [];
        highestHands.push(playerHands[i]);

        // console.log(highestHands.length);
      }
    }
  }

  // console.log("highest hands", highestHands);
  // console.log(" temphands: ", highestHands.length);
  console.log(playerHands);
};
//step two, iterate new array and check if more than one user has same value card.

// step 3 use shift to sort which user has the best cards.

//step 4 return the users with the highest card value and highest shift.

ruleManager.analyzeHand = (hand) => {
  // console.log("hand: ", hand);
  let faces = hand.map((card) => FACES.indexOf(card.slice(0, -1)));
  let suits = hand.map((card) => SUITS.indexOf(card.slice(-1)));

  //calcaulating flush by comparing if all index is same value
  // let flush = suits.every((suit) => suit === suits[0]);

  //-------------------------------------------------
  //check if first card is an ace
  //-------------------------------------------------
  function AceSplitter() {
    let ace = hand[0];
    let splittedAce = ace.split("");
    let indexNumber = SUITS.findIndex((element) => element == splittedAce[1]);
    console.log("splitted index: ", indexNumber);
    console.log("splitted value: ", splittedAce[1]);
    return indexNumber;
  }

  //-------------------------------------------------
  //-------------------------------------------------

  //------------------------------------------------
  //Flush Calculator
  //------------------------------------------------
  let suitType;
  let suitCounts;
  let flush = flushCalculator();
  function flushCalculator() {
    let uniqueSuits = [...new Set(suits)];
    suitCounts = uniqueSuits.map((suitValue) => [
      suitValue,
      suits.filter((suit) => suit === suitValue).length,
    ]);
    for (let i = 0; i < suitCounts.length; i++) {
      if (suitCounts[i][1] >= 5) {
        console.log("we got a flush!");
        suitType = suitCounts[i][0];

        //console.log("suiteType: ", suitType);

        //console.log("SuitCountInFlushCalculator: ",suitCounts[i][0]);
        console.log("suitcounts: ", suitCounts);
        return true;
      }
    }

    return false;
  }
  //------------------------------------------------
  //------------------------------------------------

  //Counting grouped cards of same faces. Creates a shallow copy of FACES array and grouping by value, from index 0
  let groups = FACES.map((face, i) => faces.filter((j) => i === j).length).sort(
    (x, y) => y - x
  );

  //calculating straight by first calculating the remainder of the value + 1 divided by 13.
  let shifted = faces.map((x) => (x + 1) % 13);
let shiftedFlusher = faces.map((x) => (x + 1) % 13);
console.log("shifted flusher ",shiftedFlusher);
  //-------------------------------------------------
  //Straight calculator
  //-------------------------------------------------
  shifted.sort(function (a, b) {
    return a - b;
  });
  //console.log("ascending order: ", shifted);

  let counter = 0;
  for (let i = 0; i < shifted.length; i++) {
    let currentValue = shifted[i];
    let nextValue = shifted[i + 1];
    //console.log("current value ", currentValue);
    if (i + 1 == shifted.length) {
      nextValue = shifted[i] + 1;
    }

    // let previousValue = shifted[i-1];
    if (nextValue == currentValue + 1) {
      counter++;

      //console.log("Counting! ", currentValue);
    }
  }

  let highestStraight = false;
  if (shifted[6] == 12 && shifted[0] == 0 && counter >= 4) {
    highestStraight = true;
    //then straight
    console.log("highest Straight!");
    //console.log("counter: ", counter);
  }

  // let straight = groups[0] === 1 && distance < 5;
  let straight =
    (groups[0] > 0 && counter >= 5) || (groups[0] > 0 && highestStraight);
  let aceSuiteTypeLetter;
  //check if Ace has same type as flush
  let sameAceTypeAsFlush = false;
  let aceSuiteType;
  if (highestStraight) {
    aceSuiteType = AceSplitter();
    console.log("Acesuit type: ", aceSuiteType);
    console.log("suit type: ", suitType);
    console.log("original suits: ", SUITS);
    aceSuiteTypeLetter = SUITS[aceSuiteType];
    console.log(
      "-------------------------------This is the type of the ace",
      aceSuiteTypeLetter
    );
    if (SUITS[suitType] == aceSuiteTypeLetter) {
      sameAceTypeAsFlush = true;
      console.log("ace type is same as flush: ", sameAceTypeAsFlush);
    }
  }

  //-------------------------------------------------
  //-------------------------------------------------

  //-------------------------------------------------
  //Anti Straight Flush calculator
  //-------------------------------------------------

  if (counter >= 4) {
    if (flush) {
      let flushSuit;
      for (let i = 0; i < suitCounts.length; i++) {
        if (suitCounts[i][1] >= 5) {
          flushSuit = suitCounts[i][0];
        }
      }

      let suitLetter = SUITS[flushSuit];
      console.log("suitLetter: ", suitLetter);
      let shallowCards = [];
      for (let i = 0; i < hand.length; i++) {
        let card = hand[i].split("");

        let cardObject = {
          shifted: shiftedFlusher[i],
          cardSuit: card[card.length - 1],
        };
        shallowCards.push(cardObject);

        // if(card[card.length-1] == aceSuiteTypeLetter)
        // for (let j = 0; j < cardObject.length; j++) {

        //   if(shallowCards[i] == )
        // }
      }
      tempArray = [];
      for (let index = 0; index < shallowCards.length; index++) {
       // console.log("cardSuit:", shallowCards[index].cardSuit + " / suitletter: " + suitLetter);
        if (shallowCards[index].cardSuit == suitLetter) {
          tempArray.push(shallowCards[index].shifted);
        }
      }

      console.log("temp array length: ", tempArray.length);
      console.log("TempArray: before sorting: ", tempArray);

      tempArray.sort(function (a, b) {
        return a - b;
      });

      console.log("TempArray: ascending order: ", tempArray);

      let counter1 = 0;
      for (let i = 0; i < tempArray.length; i++) {
        let currentValue = tempArray[i];
        let nextValue = tempArray[i + 1];
        //console.log("current value ", currentValue);
        if (i + 1 == tempArray.length) {
          nextValue = tempArray[i] + 1;
        }

        // let previousValue = shifted[i-1];
        if (nextValue == currentValue + 1) {
          counter1++;

          //console.log("Counting! ", currentValue);
        }
      }
      //console.log("shallowCards: ", shallowCards);
      console.log("shallowCardsCounter: ", counter1);
    }
  }

  //-------------------------------------------------
  //-------------------------------------------------

  // finally, if index 0 has value 1 and  the distance is less than 5 straight is true.
  //console.log("distance: ", distance);

  console.log(
    "is it straight: ",
    straight +
      ", flush: " +
      flush +
      ", is ace same: " +
      sameAceTypeAsFlush +
      ", higest straight: " +
      highestStraight
  );
  // console.log("groups: ", groups);

  console.log("shifted[0]: ", shifted[0]);
  console.log("shifted[1]: ", shifted[1]);
  console.log("shifted[2]: ", shifted[2]);
  console.log("shifted[3]: ", shifted[3]);
  console.log("shifted[4]: ", shifted[4]);
  console.log("shifted[5]: ", shifted[5]);
  console.log("shifted[6]: ", shifted[6]);
  console.log(
    "-----------------------------------------------------------------------------------"
  );

  //analysing hand, returns string with hand title
  let result =
    straight && flush && highestStraight && sameAceTypeAsFlush
      ? { handName: "Royal-straight-flush", handValue: 10, shift: shifted }
      : straight && flush && !sameAceTypeAsFlush
      ? { handName: "straight-flush", handValue: 9, shift: shifted }
      : groups[0] === 4
      ? { handName: "four-of-a-kind", handValue: 8, shift: shifted }
      : groups[0] === 3 && groups[1] === 2
      ? { handName: "full-house", handValue: 7, shift: shifted }
      : flush && !sameAceTypeAsFlush && straight
      ? { handName: "flush", handValue: 6, shift: shifted }
      : straight || highestStraight
      ? { handName: "straight", handValue: 5, shift: shifted }
      : groups[0] === 3
      ? { handName: "three-of-a-kind", handValue: 4, shift: shifted }
      : groups[0] === 2 && groups[1] === 2
      ? { handName: "two-pair", handValue: 3, shift: shifted }
      : groups[0] === 2
      ? { handName: "one-pair", handValue: 2, shift: shifted }
      : { handName: "high-card", handValue: 1, shift: shifted };

  // console.log(result);
  return result;

  //attempting to calculate royal straight flush
  // if (straight && flush && (shifted[4] === 0)) {
  //   result = "Royal-straight-flush";
  // } else if (straight && flush) {
  //   result = "straight-flush";
  // } else if (groups[0] === 4) {
  //   result = "four-of-a-kind";
  // } else if (groups[0] === 3 && groups[1] === 2) {
  //   result = "full-house";
  // } else if (flush) {
  //   result = "flush";
  // } else if (straight) {
  //   result = "straight";
  // } else if (groups[0] === 3) {
  //   result = "three-of-a-kind";
  // } else if (groups[0] === 2 && groups[1] === 2) {
  //   result = "two-pair";
  // } else if (groups[0] === 2) {
  //   result = "one-pair";
  // } else {
  //   result = "high-card";
  // }
  // return result;
};

// let testHands = [
// 	let hand= ["2♥", "2♦", "2♣", "k♣", "q♦"]
// 	"2♥ 5♥ 7♦ 8♣ 9♠",
// 	"a♥ 2♦ 3♣ 4♣ 5♦",
// 	"2♥ 3♥ 2♦ 3♣ 3♦",
// 	"2♥ 7♥ 2♦ 3♣ 3♦",
// 	"2♥ 7♥ 7♦ 7♣ 7♠",
// 	"10♥ j♥ q♥ k♥ a♥",
// 	"4♥ 4♠ k♠ 5♦ 10♠",
// 	"q♣ 10♣ 7♣ 6♣ 4♣",
// 	"joker 4♣ k♣ 5♦ 10♠",
// 	"joker 2♦ 2♠ k♠ q♦",
// 	"joker 3♥ 2♦ 3♠ 3♦",
// 	"joker 7♥ 7♦ 7♠ 7♣",
// 	"joker 2♦ joker 4♠ 5♠",
// 	"joker 2♠ joker a♠ 10♠",
// 	"joker q♦ joker a♦ 10♦"
// ];

// for(hand of testHands) console.log(hand + ": " + analyzeHand(hand));

module.exports = ruleManager;

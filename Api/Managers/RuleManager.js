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
const SUITS = ["♥", "♦", "♣", "♠"];

ruleManager.CompareHands = (pokerTable) => {
  pokerTable.collectiveCards;

  //temporary array of cards from
  let tempHands = [];

  //Adding playerhands to temp array
  for (let i = 0; i < pokerTable.users.length; i++) {
    let userTempcards = pokerTable.users.PocketCards;
    userTempcards.concat(pokerTable.collectiveCards);
    tempHands.push(userTempcards);
  }

  //-----------------------------------------------------------------------
  //Her fortsætter vi med at analyserer hænder værdier og sammenligne dem.
  //-----------------------------------------------------------------------
};

ruleManager.analyzeHand = (hand) => {
  let result;

  let faces = hand.map((card) => FACES.indexOf(card.slice(0, -1)));
  let suits = hand.map((card) => SUITS.indexOf(card.slice(-1)));

  //calcaulating flush by comparing if all index is same value
  let flush = suits.every((suit) => suit === suits[0]);

  //Counting grouped cards of same faces. Creates a shallow copy of FACES array and grouping by value, from index 0
  let groups = FACES.map((face, i) => faces.filter((j) => i === j).length).sort(
    (x, y) => y - x
  );

  //calculating straight by first calculating the remainder of the value + 1 divided by 13.
  let shifted = faces.map((x) => (x + 1) % 13);

  // second, the distance between the smallest card value and largest card value is calculated.
  let distance = Math.min(
    Math.max(...faces) - Math.min(...faces),
    Math.max(...shifted) - Math.min(...shifted)
  );

  // finally, if index 0 has value 1 and  the distance is less than 5 straight is true.
  let straight = groups[0] === 1 && distance < 5;
  console.log("shifted: ", shifted[4]);

  //attempting to calculate royal straight flush
  if (straight & flush & (shifted[4] === 0)) {
    result = "Royal-straight-flush";
  } else if (straight && flush) {
    result = "straight-flush";
  } else if (groups[0] === 4) {
    result = "four-of-a-kind";
  } else if (groups[0] === 3 && groups[1] === 2) {
    result = "full-house";
  } else if (flush) {
    result = "flush";
  } else if (straight) {
    result = "straight";
  } else if (groups[0] === 3) {
    result = "three-of-a-kind";
  } else if (groups[0] === 2 && groups[1] === 2) {
    result = "two-pair";
  } else if (groups[0] === 2) {
    result = "one-pair";
  } else {
    result = "high-card";
  }
  return result;
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

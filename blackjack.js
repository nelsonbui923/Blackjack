const hitButton = document.querySelector('#blackjack-hit-button');
const dealButton = document.querySelector('#blackjack-deal-button');
const standButton = document.querySelector('#blackjack-stand-button');
const winnerAnimation = document.querySelector('.container');

let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},

    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],

    'cardsMap': {'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'Q':10, 'J':10, 'A': [1, 11]},

    'wins': 0,
    'losses': 0,
    'draws': 0,

    'isStand': false,
    'turnsOver': false,
    'startRound': false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('./sounds/swish.m4a');
const winSound = new Audio('./sounds/cash.mp3');
const lossSound = new Audio('./sounds/aww.mp3');

let winner;


function showCard(card, activePlayer) {
    if(activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `./images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function startingHand() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function blackjackHit() {
    if (blackjackGame['isStand'] === false && blackjackGame['startRound'] === true) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

async function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true && blackjackGame['startRound'] === true) {
        blackjackGame['isStand'] = false;
        
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        
        for(i=0; i <yourImages.length; i++) {
            yourImages[i].remove();
        }
        
        for(i=0; i <dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        
        document.querySelector('#blackjack-result').textContent = "Let's play!";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = false;
        blackjackGame['startRound'] = false;

        winnerAnimation.classList.remove('winner');
    };

    await wait(1000); 
    if (blackjackGame['turnsOver'] === false && blackjackGame['isStand'] === false && blackjackGame['startRound'] === false) {
        await wait(100);
        startingHand();
        await wait(500);
        startingHand();

        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);

        blackjackGame['startRound'] = true;
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer) {
    if(card === 'A') {
        if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }

    } else {
    activePlayer['score']+= blackjackGame['cardsMap'][card];
    }
}

async function showScore(activePlayer) {
    if(activePlayer === YOU && activePlayer['score'] > 21) {
        lossSound.play();
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUSTED!!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
        let message, messageColor;
        message = 'You Lost...';
        messageColor = 'red';
        blackjackGame['losses']++;

        blackjackGame['turnsOver'] = true;
        
        
        await wait(2000);
        blackjackDeal();

    } else if(activePlayer === DEALER && activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUSTED!!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
        winSound.play();
        let message, messageColor;
        message = 'You Won!';
        messageColor = 'green';
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        blackjackGame['wins']++;
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {    
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await wait(1000);
    }; 

        blackjackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);
}

function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            winner = YOU;
            blackjackGame['wins']++;
        } else if (YOU['score'] < DEALER['score']) {
            winner = DEALER;
            blackjackGame['losses']++;
        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        winner = DEALER;
        blackjackGame['wins']++;
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }
    return winner;
}

function showResult(winner) {
    if (blackjackGame['turnsOver'] === true) {
        let message, messageColor;
        if (winner === YOU) {
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
            document.querySelector('#wins').textContent = blackjackGame['wins'];

            winnerAnimation.classList.add('winner');
        } else if (winner === DEALER) {
            message = 'You Lost...';
            messageColor = 'red';
            lossSound.play();
            document.querySelector('#losses').textContent = blackjackGame['losses'];
        } else {
            message = 'You Drew.';
            messageColor = 'black';
            document.querySelector('#draws').textContent = blackjackGame['draws'];
        }
        
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}
    
hitButton.addEventListener('click', blackjackHit);
dealButton.addEventListener('click', blackjackDeal);
standButton.addEventListener('click', dealerLogic);
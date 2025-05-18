const cardCountInput = document.getElementById('cardCountInput');
const startBtn = document.getElementById('startBtn');
const boardContainer = document.getElementById('boardContainer');
const gameInfo = document.getElementById('gameInfo');

let cardCount = 12;
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let tries = 0;

// ШАБЛОНЫ КАРТОЧЕК
const svgTemplates = [
  `<circle cx="25" cy="25" r="20" stroke="#ff6f61" fill="#ffad9e"/>`,
  `<rect x="8" y="8" width="34" height="34" stroke="#60269e" fill="#a986d4" rx="6"/>`,
  `<polygon points="25,5 45,45 5,45" stroke="#1d9b8a" fill="#68d1b3"/>`,
  `<line x1="10" y1="40" x2="40" y2="10" stroke="#ffc107"/>`,
  `<ellipse cx="25" cy="25" rx="20" ry="12" stroke="#ff4081" fill="#f48fb1"/>`,
  `<path d="M10 10 h30 v30 h-30 z" stroke="#009688" fill="#4db6ac" />`,
  `<circle cx="25" cy="12" r="8" stroke="#fbc02d" fill="#fff176"/>`,
  `<polygon points="12,8 38,8 25,42" stroke="#3949ab" fill="#7986cb"/>`,
  `<line x1="5" y1="25" x2="45" y2="25" stroke="#607d8b" />`,
  `<path d="M12 12 C 20 25, 28 25, 36 12" stroke="#e91e63" fill="none" />`
];

// СОЗДАНИЕ МАССИВА
function generateCards(count) {
  const pairCount = count / 2;
  let items = [];
  for(let i = 0; i < pairCount; i++) {
  let svgIndex = i % svgTemplates.length;
  items.push({id: i, svg: svgTemplates[svgIndex]});
    items.push({id: i, svg: svgTemplates[svgIndex]});
  }
  return shuffle(items);
}

// ПЕРЕМЕШИВАНИЕ
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while(currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function createCardElement(cardData) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = cardData.id;
  const front = document.createElement('div');
  front.className = 'front';
  front.innerHTML = cardData.svg;
  const back = document.createElement('div');
  back.className = 'back';
  back.textContent = cardData.id + 1;
  card.appendChild(front);
  card.appendChild(back);
  card.addEventListener('click', onCardClick);
  return card;
  }

  function onCardClick(e) {
  if(lockBoard) return;
  const clicked = e.currentTarget;
  if(clicked.classList.contains('flipped') || clicked.classList.contains('matched')) return;
  flipCard(clicked);
  if(!firstCard) {
    firstCard = clicked;
    return;
  }
  secondCard = clicked;
  lockBoard = true;
  tries++;

  if(firstCard.dataset.id === secondCard.dataset.id) {
    // СОВПАДЕНИЕ
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchesFound++;
    resetTurn();
    if(matchesFound === cardCount / 2) {
      gameInfo.textContent = `Поздравляем! Вы нашли все пары за ${tries} попыток.`;
    } else {
      gameInfo.textContent = `Пара найдена! Попыток: ${tries}`;
    }
  } else {
    // НЕ СОВПАЛО БЛЯЯЯЯЯ
    gameInfo.textContent = `Пары нет :( Попыток: ${tries}`;
    setTimeout(() => {
      unflipCard(firstCard);
      unflipCard(secondCard);
      resetTurn();
    }, 1000);
  }
}

function flipCard(card) {
  card.classList.add('flipped');
}
function unflipCard(card) {
  card.classList.remove('flipped');
}
// СБРОС
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// СТАРТ
function startGame() {
  let count = parseInt(cardCountInput.value, 10);
  if(isNaN(count) || count < 4) count = 4;
  if(count > 36) count = 36;
  if(count % 2 !== 0) count--; // чётность
  cardCount = count;
  matchesFound = 0;
  tries = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameInfo.textContent = 'Игра началась! Выберите карточку.';
  boardContainer.innerHTML = '';
  const cols = Math.min(6, Math.floor(Math.sqrt(cardCount)));
  boardContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  cards = generateCards(cardCount);
  cards.forEach(cardData => {
    const cardEl = createCardElement(cardData);
    boardContainer.appendChild(cardEl);
  });
}
startBtn.addEventListener('click', startGame);
startGame();
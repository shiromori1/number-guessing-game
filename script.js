// コンピューターが1〜100の中から答えを1つ決めます。
let answer = createAnswer();
let attempts = 0;
let gameFinished = false;

const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const rangeDisplay = document.getElementById('range');

function createAnswer() {
  return Math.floor(Math.random() * 100) + 1;
}

function checkGuess() {
  if (gameFinished) return;

  const guess = Number(guessInput.value);

  if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
    showMessage('1〜100の整数を入力してください。', 'error');
    guessInput.focus();
    return;
  }

  attempts += 1;
  attemptsDisplay.textContent = attempts;

  if (guess === answer) {
    showMessage(`正解！ ${attempts}回で当てました！`, 'success');
    rangeDisplay.textContent = 'クリア！';
    gameFinished = true;
    guessInput.disabled = true;
    guessButton.disabled = true;
  } else if (guess < answer) {
    showMessage('もっと大きい数字です。', 'error');
    rangeDisplay.textContent = `${guess + 1}〜100`;
  } else {
    showMessage('もっと小さい数字です。', 'error');
    rangeDisplay.textContent = `1〜${guess - 1}`;
  }

  guessInput.select();
}

function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`;
}

function resetGame() {
  answer = createAnswer();
  attempts = 0;
  gameFinished = false;
  attemptsDisplay.textContent = '0';
  rangeDisplay.textContent = '1〜100';
  guessInput.value = '';
  guessInput.disabled = false;
  guessButton.disabled = false;
  showMessage('1〜100の数字を入力して、判定ボタンを押してください。');
  guessInput.focus();
}

guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', resetGame);
guessInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') checkGuess();
});

const MIN_NUMBER = 1;
const MAX_NUMBER = 100;
const MAX_ATTEMPTS = 10;

// 1〜100の答えと、ゲーム開始時の状態を作ります。
function createAnswer(random = Math.random) {
  return Math.floor(random() * MAX_NUMBER) + MIN_NUMBER;
}

function createGameState(random = Math.random) {
  return {
    answer: createAnswer(random),
    attempts: 0,
    remaining: MAX_ATTEMPTS,
    minHint: MIN_NUMBER,
    maxHint: MAX_NUMBER,
    history: [],
    finished: false,
  };
}

// 入力された値が、1〜100の整数かを確認します。
function parseGuess(rawValue) {
  const text = String(rawValue).trim();

  if (text === '') {
    return { valid: false, message: '数字を入力してください。' };
  }

  if (!/^\d+$/.test(text)) {
    return { valid: false, message: '1〜100の整数を入力してください。' };
  }

  const value = Number(text);
  if (!Number.isInteger(value) || value < MIN_NUMBER || value > MAX_NUMBER) {
    return { valid: false, message: '1〜100の整数を入力してください。' };
  }

  return { valid: true, value };
}

// 1回分の判定を行い、新しいゲーム状態と結果を返します。
function playTurn(currentState, rawValue) {
  if (currentState.finished) {
    return { state: currentState, outcome: 'finished' };
  }

  const parsed = parseGuess(rawValue);
  if (!parsed.valid) {
    return {
      state: currentState,
      outcome: 'invalid',
      message: parsed.message,
    };
  }

  const guess = parsed.value;
  const attempts = currentState.attempts + 1;
  const remaining = MAX_ATTEMPTS - attempts;
  const history = [...currentState.history, guess];

  if (guess === currentState.answer) {
    return {
      state: {
        ...currentState,
        attempts,
        remaining,
        history,
        finished: true,
      },
      outcome: 'correct',
      guess,
    };
  }

  const minHint = guess < currentState.answer
    ? Math.max(currentState.minHint, guess + 1)
    : currentState.minHint;
  const maxHint = guess > currentState.answer
    ? Math.min(currentState.maxHint, guess - 1)
    : currentState.maxHint;
  const finished = remaining === 0;

  return {
    state: {
      ...currentState,
      attempts,
      remaining,
      minHint,
      maxHint,
      history,
      finished,
    },
    outcome: finished ? 'game-over' : (guess < currentState.answer ? 'higher' : 'lower'),
    guess,
  };
}

// Node.jsの自動テストから、判定部分だけを読み込めるようにします。
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MIN_NUMBER,
    MAX_NUMBER,
    MAX_ATTEMPTS,
    createAnswer,
    createGameState,
    parseGuess,
    playTurn,
  };
}

// ブラウザで開いたときだけ、画面の処理を準備します。
if (typeof document !== 'undefined') {
  let gameState = createGameState();

  const gameCard = document.getElementById('gameCard');
  const guessForm = document.getElementById('guessForm');
  const guessInput = document.getElementById('guessInput');
  const guessButton = document.getElementById('guessButton');
  const resetButton = document.getElementById('resetButton');
  const message = document.getElementById('message');
  const attemptsDisplay = document.getElementById('attempts');
  const remainingDisplay = document.getElementById('remaining');
  const rangeDisplay = document.getElementById('range');
  const progressDisplay = document.getElementById('attemptProgress');
  const historyDisplay = document.getElementById('guessHistory');

  function showMessage(text, type = '') {
    message.textContent = text;
    message.className = `message ${type}`.trim();
  }

  function renderGame() {
    attemptsDisplay.textContent = gameState.attempts;
    remainingDisplay.textContent = gameState.remaining;
    progressDisplay.value = gameState.attempts;
    progressDisplay.textContent = `${gameState.attempts} / ${MAX_ATTEMPTS}`;
    historyDisplay.textContent = gameState.history.length > 0
      ? gameState.history.join(' → ')
      : 'まだありません';

    if (gameState.finished) {
      rangeDisplay.textContent = `正解：${gameState.answer}`;
    } else {
      rangeDisplay.textContent = `${gameState.minHint}〜${gameState.maxHint}`;
    }

    guessInput.disabled = gameState.finished;
    guessButton.disabled = gameState.finished;
  }

  function checkGuess(event) {
    event.preventDefault();

    const result = playTurn(gameState, guessInput.value);
    if (result.outcome === 'invalid') {
      showMessage(result.message, 'error');
      guessInput.focus();
      return;
    }

    gameState = result.state;
    gameCard.classList.remove('is-win', 'is-lost');

    if (result.outcome === 'correct') {
      showMessage(`🎉 おめでとう！ ${gameState.attempts}回目で正解です！`, 'success');
      gameCard.classList.add('is-win');
    } else if (result.outcome === 'game-over') {
      showMessage(`残念！ 10回で当たりませんでした。正解は ${gameState.answer} です。`, 'game-over');
      gameCard.classList.add('is-lost');
    } else if (result.outcome === 'higher') {
      showMessage(`もっと大きい数字です。残り${gameState.remaining}回！`, 'hint');
    } else if (result.outcome === 'lower') {
      showMessage(`もっと小さい数字です。残り${gameState.remaining}回！`, 'hint');
    }

    renderGame();

    if (!gameState.finished) {
      guessInput.select();
    }
  }

  function resetGame() {
    gameState = createGameState();
    gameCard.classList.remove('is-win', 'is-lost');
    guessInput.value = '';
    showMessage('数字を入力して、判定ボタンを押してください。');
    renderGame();
    guessInput.focus();
  }

  guessForm.addEventListener('submit', checkGuess);
  resetButton.addEventListener('click', resetGame);
  renderGame();
}


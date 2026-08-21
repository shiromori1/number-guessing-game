const assert = require('node:assert/strict');
const {
  MAX_ATTEMPTS,
  createAnswer,
  createGameState,
  parseGuess,
  playTurn,
} = require('../script.js');

function stateWithAnswer(answer) {
  return {
    ...createGameState(() => (answer - 1) / 100),
    answer,
  };
}

function runTest(name, test) {
  try {
    test();
    console.log(`OK: ${name}`);
  } catch (error) {
    console.error(`NG: ${name}`);
    throw error;
  }
}

runTest('答えは1〜100の範囲で作られる', () => {
  assert.equal(createAnswer(() => 0), 1);
  assert.equal(createAnswer(() => 0.999999), 100);
});

runTest('1と100は有効な入力になる', () => {
  assert.deepEqual(parseGuess('1'), { valid: true, value: 1 });
  assert.deepEqual(parseGuess('100'), { valid: true, value: 100 });
});

runTest('範囲外、数字以外、小数、空欄は無効になる', () => {
  assert.equal(parseGuess('0').valid, false);
  assert.equal(parseGuess('101').valid, false);
  assert.equal(parseGuess('abc').valid, false);
  assert.equal(parseGuess('3.5').valid, false);
  assert.equal(parseGuess('').valid, false);
});

runTest('無効な入力では回数が減らない', () => {
  const initial = stateWithAnswer(50);
  const result = playTurn(initial, 'abc');
  assert.equal(result.outcome, 'invalid');
  assert.equal(result.state.attempts, 0);
  assert.equal(result.state.remaining, MAX_ATTEMPTS);
});

runTest('答えより小さいと「もっと大きい」になる', () => {
  const result = playTurn(stateWithAnswer(50), '1');
  assert.equal(result.outcome, 'higher');
  assert.equal(result.state.minHint, 2);
  assert.equal(result.state.remaining, 9);
});

runTest('答えより大きいと「もっと小さい」になる', () => {
  const result = playTurn(stateWithAnswer(50), '100');
  assert.equal(result.outcome, 'lower');
  assert.equal(result.state.maxHint, 99);
  assert.equal(result.state.remaining, 9);
});

runTest('過去の予想を使って範囲をしぼる', () => {
  let state = stateWithAnswer(50);
  state = playTurn(state, '20').state;
  state = playTurn(state, '80').state;
  assert.equal(state.minHint, 21);
  assert.equal(state.maxHint, 79);
});

runTest('正解するとゲームが終了する', () => {
  const result = playTurn(stateWithAnswer(42), '42');
  assert.equal(result.outcome, 'correct');
  assert.equal(result.state.finished, true);
  assert.equal(result.state.attempts, 1);
});

runTest('9回失敗では続き、10回失敗で終了する', () => {
  let state = stateWithAnswer(100);
  for (let count = 1; count <= 9; count += 1) {
    const result = playTurn(state, '1');
    assert.equal(result.outcome, 'higher');
    state = result.state;
  }

  const lastResult = playTurn(state, '1');
  assert.equal(lastResult.outcome, 'game-over');
  assert.equal(lastResult.state.finished, true);
  assert.equal(lastResult.state.remaining, 0);
});

runTest('新しい状態にすると回数と履歴が元に戻る', () => {
  let state = stateWithAnswer(50);
  state = playTurn(state, '10').state;
  const resetState = createGameState(() => 0.49);
  assert.equal(resetState.attempts, 0);
  assert.equal(resetState.remaining, 10);
  assert.deepEqual(resetState.history, []);
  assert.equal(resetState.finished, false);
});

console.log('すべての自動テストに合格しました。');


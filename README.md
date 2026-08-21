# 10回チャレンジ！数当てゲーム

コンピューターが選んだ1〜100の数字を、10回以内に当てるブラウザゲームです。

## 公開ページ

[GitHub Pagesでゲームを遊ぶ](https://shiromori1.github.io/number-guessing-game/)

## 遊び方

1. 1〜100の整数を入力します。
2. 「判定する」を押します。Enterキーでも判定できます。
3. 「もっと大きい」「もっと小さい」というヒントを使って答えを探します。
4. 10回以内に当たれば成功です。
5. 10回で当たらなかった場合は、正解が表示されます。
6. 「もう一度遊ぶ」で新しいゲームを始められます。

## 自由研究で調べること

このゲームは、中学2年生の自由研究「AIへの指示のしかたによって、作られるゲームはどのように変わるのか」の予行演習として作っています。

- [今回の改善記録](RESEARCH_LOG.md)
- [変更前のGitHubコミット](https://github.com/shiromori1/number-guessing-game/commit/a442cf70d6a33558b4201e44dd1633bdd669f6c8)
- [変更前と最新版の比較](https://github.com/shiromori1/number-guessing-game/compare/a442cf70d6a33558b4201e44dd1633bdd669f6c8...main)

## ファイルの役割

- `index.html`: ゲーム画面の骨組み
- `style.css`: 色、配置、スマートフォン表示などの見た目
- `script.js`: 答えの作成、入力チェック、回数管理、判定などの動き
- `tests/game.test.js`: ゲームの判定を自動で確認するテスト
- `RESEARCH_LOG.md`: 変更前から完成までの記録

## 自動テスト

Node.jsが使える環境では、次のコマンドで判定テストを実行できます。

```text
node tests/game.test.js
```

追加のライブラリは使っていません。GitHub Pagesでは、リポジトリのルートにある `index.html` をそのまま公開できます。


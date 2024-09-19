# 自然言語処理の基本とその実装方針を理解することを想定した数式解析処理サンプル

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## このサンプルの概要

このサンプルは、数式解析処理の基本とその実装方針を理解することを想定して作成したサンプルです。
自然言語処理では、以下のプロセスで入力されたテキストデータの意味を解釈します。

1. 字句解析
2. 構文解析
3. 意味解析

## このサンプルの実行方法

### Node.js のインストール

まずはじめに、本サンプルの実行環境である Node.js を準備してください。
[公式サイト](https://nodejs.org/en)から LTS バージョンの Node.js をダウンロードしてインストールしてください。

### ファイルの展開

入手したサンプルの `zip` ファイルを解凍してください。

### npm パッケージのインストール

`zip` が展開されたフォルダ(ルートディレクトリに`package.json`というファイルがあるフォルダです)に移動して、以下のコマンドを実行してください。

```bash
npm install
```

少し時間がかかりますが、このサンプルを動作させるのに必要なライブラリがインストールされます。

> ネットワークに接続されていないと動作しません。

### ローカル開発サーバのデプロイ

ルートディレクトリに移動して、以下のコマンドを実行してください。

```bash
npm run start
```

これで `3000番ポート`でサーバが起動します。
Web ブラウザで、http://localhost:3000/ にアクセスしてみてください。

### 単体テストの実行

本サンプル内にあるコアライブラリ(`src/lib`)のより細やかな動作を確認するために、デバッグ実行したいことがある場合を想定して、Jest 形式の単体テストも準備しています。UI を動作させずに、ライブラリを単体でテストすることも可能です。

```bash
npm test
```

## Learn More about ui

-   [React documentation](https://reactjs.org/)
-   [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
-   [PrimeReact - The Most Complete UI Suite for React.js](https://primereact.org/)
-   [PrimeFlex - Perfect CSS Utility Companion](https://primeflex.org/)
-   [Font Awesome - Take the hassle out of icons in your website](https://fontawesome.com/)
-   [react-fontawesome - React component for Font Awesome](https://www.npmjs.com/package/@fortawesome/react-fontawesome#documentation)

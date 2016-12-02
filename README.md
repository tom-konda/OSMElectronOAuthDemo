# 概要

Electron を使用した時に OpenStreetMap API にアクセスするためのサンプルソースコードです。

# ビルドとサンプルプログラムの実行の仕方

Electron アプリなので、Node.js の実行環境があることを前提としています。

1. OpenStreetMap のユーザ設定にある“OAuth 設定”にアプリケーションを登録しコンシューマー キー及びコンシューマー シークレットを取得
2. config ディレクトリに sample.settings.json を基に、1. で取得したコンシューマー キー及びコンシューマー シークレットを設定して settings.json を設置する
3. `npm install` を実行する（ここまで初回時のみ設定）
4. `npm run build` を実行する
5. `npm run electron` を実行する
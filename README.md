<div align="center">
  <img width="72" src="https://user-images.githubusercontent.com/43836584/103738741-df9d8d80-5037-11eb-822d-795a380296e1.png">
  <h3 align="center">twcl</h3>
  <p align="center">twcl is simple Twitter client in cli.</p>
</div>

---

> 🐧 Web developer's PC has node.js installed, and since he is working with VSCode, Needed a node.js Twitter Client in cli...

## Install v1.x

```shell
$ npm install -g twcl
```

## Waiting for v2.0

ユーザーに代わってリクエストを発行するには、未だに OAuth1.0a が必要  
Twitter API v2 が将来、[対応するらしい](https://trello.com/b/myf7rKwV/twitter-developer-platform-roadmap)のでそれを待つ

といいつつも、twcl v2.0 の目的はリファクタリングなので全てを Twitter API v2 に置き換えないし置き換える必要も無さそう

### 課題

- ユーザー認証後のリダイレクト時にクライアントに認可情報を伝える方法が思いつかない
  - 現在はユーザーに Token をコピペして貰って、クライアントに伝えてる
    - PIN 入力でもいい
  - ユーザーの操作は Twitter 認証のボタン押下だけで済めば良いんだけど
    - Socket-io で出来そうだけど実装大変
- コマンドのベストが定まらない
  - `twcl tweet -t`?
  - 草案
    - 操作をまとめ、第二引数に割り当てる
      - user 操作、ツイート、ツイート(TL)表示に分ける
    - 現在は操作がまとまっておらず、コマンドがバラバラ
- consumer key を隠蔽する為のサーバーをどうするか
  - 現在は heroku だが sleep からの立ち上げが遅い
    - 少なくとも heroku から vercel に移行させたい
  - limit の関係でユーザーが consumer key を変更したい場合がある
    - 多くの CLI クライアントはサーバーを立てるのがめんどくさいのか consumer key をユーザーが用意する必要がある
      - これは嫌
    - consumer key がリクエストに含まれていたらそれを使うようにする
      - access key が変わるので管理が大変

## License

MIT ©[ivgtr](https://github.com/ivgtr)

[![Twitter Follow](https://img.shields.io/twitter/follow/ivgtr?style=social)](https://twitter.com/ivgtr) [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE) [![Donate](https://img.shields.io/badge/%EF%BC%84-support-green.svg?style=flat-square)](https://www.buymeacoffee.com/ivgtr)

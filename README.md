<div align="center">
  <img width="72" src="https://user-images.githubusercontent.com/43836584/103738741-df9d8d80-5037-11eb-822d-795a380296e1.png">
  <h3 align="center">twcl</h3>
  <p align="center">twcl is simple Twitter client in cli.</p>
</div>

---

> 🐧 Web developer's PC has node.js installed, and since he is working with VSCode, Needed a node.js Twitter Client in cli...

## Install v1
```shell
$ npm install -g twcl
```
 
## Waiting for v2
ユーザーに代わってリクエストを発行するには、未だにOAuth1.0a が必要  
Twitter API v2 が将来、[対応するらしい](https://trello.com/b/myf7rKwV/twitter-developer-platform-roadmap)のでそれを待つ  
### 課題
- ユーザー認証後のリダイレクト時にクライアントに認可情報を伝える方法が思いつかない
  - 現在はユーザーにToken をコピペして貰って、クライアントに伝えてる
  - PIN入力で認可情報をゲットできそうならそっちでもいいかも
  - 最後の手段はSocket-io
- コマンドのベストが定まらない
  - `twcl tweet -t`?
- consumer keyを内包する為のBFFのサーバーをどうするか
  - 現在はherokuだがsleepからの立ち上げが遅い
  - GASという選択肢
    - エラーハンドリングに不安が募る
  - 少なくともherokuからvercelに移行させたい

## License
MIT ©[ivgtr](https://github.com/ivgtr)


[![Twitter Follow](https://img.shields.io/twitter/follow/mawaru_hana?style=social)](https://twitter.com/mawaru_hana) [![Twitter Follow](https://img.shields.io/twitter/follow/ivgtr?style=social)](https://twitter.com/ivgtr) [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE) [![Donate](https://img.shields.io/badge/%EF%BC%84-support-green.svg?style=flat-square)](https://www.buymeacoffee.com/ivgtr)  
# twcl (twitter-cli)

#### これは何?  
cliでTwitterをする為のclientです

### 必要なもの
- node.js

### インストール  
[![NPM](https://nodei.co/npm/twcl.png?mini=true)](https://www.npmjs.com/package/twcl)  
```
$ npm i -g twcl
```

### 使い方
#### アカウント連携  
- `twcl li`をするとブラウザが開くので連携を許可してください
- また、一つもアカウントが登録されてない時は自動でloginに移ります
```sh
$ ブラウザに表示されたトークンを入力してください > [Token] 
$ 表示名を入力してください > [Name]
```
#### アカウント切替
- `twcl c`でユーザーのリストが表示されるので選択してください
- `twcl c [user]`で直接指定できます
#### アカウント削除
- `twcl lo`でアカウントをtwclから削除します
#### ツイート
- `twcl t`でツイートを送信できます
- `twcl t [message]`で直接送信できます
#### タイムラインを見る
- `twcl tl`で自分のTLを見れます
- `twcl tl [user]`で指定したユーザーのツイート一覧が見れます
- `-n <num>`はオプションで、取得する数を指定できます
#### リストを見る
- `twcl l`でリストのリストが表示されるので選択してください
- `twcl l [list]`でリストのidを指定できます
- `-n <num>`はオプションで、取得する数を指定できます
#### ツイートを検索
- `twcl s`でツイートを検索できます
- `twcl s [query]`で直接検索できます

### もっと楽にtwclにアクセスしたいですか？
aliasを登録することをお勧めします。  
`.bashrc`や`.zshrc`を開いて以下の一文を入れましょう
``` javascript
alias t='twcl'
```  
next step
``` javascript
t t [tweet] // 世界が早くなりました
```  

### 今後の予定

- TwitterAPI2.0の内容が充実し次第リファクタリング予定です

欲しい機能があればissueまで  

### License
MIT ©[ivgtr](https://github.com/ivgtr)  

[![Twitter Follow](https://img.shields.io/twitter/follow/mawaru_hana?style=social)](https://twitter.com/mawaru_hana) [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE) [![Netlify Status](https://api.netlify.com/api/v1/badges/528913b2-82a9-4d80-89a5-0005a7da157b/deploy-status)](https://github.com/ivgtr/twcl-web) [![CI](https://github.com/ivgtr/twcl-middleware/workflows/CI/badge.svg)](https://github.com/ivgtr/twcl-middleware)
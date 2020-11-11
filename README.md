# twcl (twitter-cli)
[![Twitter Follow](https://img.shields.io/twitter/follow/mawaru_hana?style=social)](https://twitter.com/mawaru_hana) [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE) [![Netlify Status](https://api.netlify.com/api/v1/badges/528913b2-82a9-4d80-89a5-0005a7da157b/deploy-status)](https://github.com/ivgtr/twcl-web) [![CI](https://github.com/ivgtr/twcl-middleware/workflows/CI/badge.svg)](https://github.com/ivgtr/twcl-middleware)

#### これは何?  
cliでTwitterをする為のclientです


## インストール  
[![NPM](https://nodei.co/npm/twcl.png?mini=true)](https://www.npmjs.com/package/twcl)  
```
$ npm i -g twcl
```
or
```
$ yarn add -g twcl
```

## 使い方
#### アカウント連携  
``` javascript
$ twcl li // or twcl login
```
ブラウザが開くので連携を許可してください。
また、一つもアカウントが登録されてない時は自動でloginに移ります。
```
$ ブラウザに表示されたトークンを入力してください > [Token] 
$ 表示名を入力してください > [Name]
```
#### アカウント切替
``` javascript
$ twcl c // or twcl change
$ 変更したいアカウントを選択してください >
$ // 選択したアカウントに変更されます
```
or
``` javascript
$ twcl c [user] // or twcl change [user]
$ // 入力されたuser名があればそれに、なければリストが表示されます
```
#### アカウント削除
``` javascript
$ twcl lo // or twcl logout
$ 削除したいアカウントを選択してください > // all or selected
```
#### ツイート
``` javascript
$ twcl t [message] // or twcl tweet [message]
```
or  
``` javascript
$ twcl t // or twcl tweet
$ ツイート: > [message]
```
#### タイムラインを見る
``` javascript
$ twcl tl -n <num> // or twcl timeline --number <num>
$ // 自分のタイムラインが表示されます
```
or
``` javascript
$ twcl tl [user] -n <num> // or twcl timeline [user] --number <num>
$ // @から始まるidで指定したユーザーの最新ツイートが表示されます
```
#### リストを見る
``` javascript
$ twcl l -n <num> // or twcl list --number <num>
$ 取得したいリストを選択してください >
$ // 選択したリストが表示されます(とりあえず最新の10件を取得に固定)
```
or
``` javascript
$ twcl l [list] -n <num> // or twcl list [user/list] --number <num>
$ // 入力したリストが表示されます([list]はlistを開いた時のurlのlists/xxxのxxx部分)
```
リストから選択する方はとても楽ですがAPI制限がキツイので直接入力する方が良いかもしれません...  
リストの一覧を取得するのは最初だけでdatabaseに保存するのも考えています
#### ツイートを検索
``` javascript
$ twcl s [query] -n <num> // or twcl search [query] --number <num>
$ // 入力したqueryが表示されます
```
or
``` javascript
$ twcl s [list] -n <num> // or twcl list [user/list] --number <num>
$ 検索ワード: > [query]
```



## もっと楽にtwclにアクセスしたいですか？
aliasを登録することをお勧めします。  
`.bashrc`や`.zshrc`を開いて以下の一文を入れましょう
``` javascript
alias t='twcl'
```  
next step
``` javascript
t t [tweet] // 世界が早くなりました
```  

## 今後の予定

- TwitterAPI2.0の内容が充実し次第login周りの改修とrefactoring予定です

欲しい機能があればissueまで  

## バグ
バグを発見したら報告してください、対応します
- [https://github.com/ivgtr/twcl/issues](https://github.com/ivgtr/twcl/issues)

## License
MIT ©[ivgtr](https://github.com/ivgtr)
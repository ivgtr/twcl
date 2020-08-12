# twcl (cliでTwitterをするやつ)
[![Twitter Follow](https://img.shields.io/twitter/follow/mawaru_hana?style=social)](https://twitter.com/mawaru_hana) [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE) [![Netlify Status](https://api.netlify.com/api/v1/badges/528913b2-82a9-4d80-89a5-0005a7da157b/deploy-status)](https://github.com/ivgtr/twcl-web) [![CI](https://github.com/ivgtr/twcl-middleware/workflows/CI/badge.svg)](https://github.com/ivgtr/twcl-middleware)

##### これは何?  
cli上でTwitterする為のツールです


## インストール

```
$ npm i -g twcl
```
```
$ yarn add -g twcl
```

## 使い方
##### Login  
``` javascript
$ twcl -l // or twcl --login
```
ブラウザが開くので連携を許可してください。
```
$ ブラウザに表示されたトークンを入力してください > [Token] 
$ 表示名を入力してください > [Name]
```
##### Tweet
``` javascript
$ twcl -t [message] // or twcl --tweet [message]
```
or  
``` javascript
$ twcl -t // or twcl --tweet
$ ツイート: > [message]
```
##### Logout
``` javascript
$ twcl -lo // or twcl --logout
$ 削除したいアカウントを選択してください > // all or selected
```

## 今後の予定
- TL取得機能の追加
- List取得機能の追加
- 複数アカウント対応(現在は最後にログインしたアカウントを利用可能)
- アカウント切替
- and more...

## バグ
バグを発見したら報告してください、対応します
- [https://github.com/ivgtr/twcl/issues](https://github.com/ivgtr/twcl/issues)

## License
MIT ©[ivgtr](https://github.com/ivgtr)
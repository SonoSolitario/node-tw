# Node TrueWallet
This module provides an easy to use API for using with [TrueWallet](https://wallet.truemoney.com).

### Quick Start

##### Installing

```
npm install node-tw --save
```

##### Creating new instance

```
const TrueWallet = require('node-tw')
const tw = new TrueWallet({
    email: 'email@example.com',
    password: 'example'
})
```

##### Logging in

```
tw.login()
```

##### Getting transactions history

```
tw.history()
    .then(console.log) // prints all transactions to the console
```

##### Getting transaction details

```
transaction.details()
    .then(console.log) // prints details to the console
```

##### Polling

```
tw.startPolling()
tw.on('transaction', doSomething) // Do something with the transaction
```

##### Examples
* [One time check](https://github.com/paphonbth/node-tw/blob/master/example/onetime.js)
* [Polling](https://github.com/paphonbth/node-tw/blob/master/example/polling.js)


This project is not affiliated in any way with True Corp.

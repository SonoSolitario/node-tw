# Node TrueWallet
This module provides an easy to use API for using with TrueWallet.

### Quick Start

##### Creating new instance

```
const tw = new TrueWallet({
    email: 'email@example.com',
    password: 'theBestPasswordInTheWorld'
})
```

##### Logging in

```
tw.login()
```

##### Getting transactions history

```
tw.history()
    .then((transactions) => {
        console.log(transactions) // prints all transactions to the console
    })
```

##### Getting transaction details

```
transaction.details()
    .then((details) => {
        console.log(details) // prints all details to the console
    })
```

##### [Example](https://github.com/paphonbth/node-tw/blob/master/example/app.js)

This project is not affiliated in any way with True Corp.

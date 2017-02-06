# Node TrueWallet
This module provides an easy to use API for using with TrueWallet.

### Quick Start

##### Creating new instance

```ecmascript 6
const tw = new TrueWallet({
    email: 'email@example.com',
    password: 'theBestPasswordInTheWorld'
})
```

##### Logging in

```ecmascript 6
tw.login()
```

##### Getting transactions history

```ecmascript 6
tw.history()
    .then((transactions) => {
        console.log(transactions) // prints all transactions to the console
    })
```

##### Getting transaction details

```ecmascript 6
transaction.details()
    .then((details) => {
        console.log(details) // prints all details to the console
    })
```

This project is not affiliated in any way with True Corp.
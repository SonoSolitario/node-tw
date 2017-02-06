const TrueWallet = require('../')

const tw = new TrueWallet({
    email: 'email@example.com',
    password: 'theBestPasswordInTheWorld'
})

const handleTransactions = (activities) => {
    activities.forEach((activity) => {
        activity.details()
            .then(console.log)
    })
}

tw.login()
    .then(tw.history)
    .then(handleTransactions)
    .catch((reason) => {
        console.log(reason)
    });
const TrueWallet = require('../')

const tw = new TrueWallet({
    email: process.env.TW_EMAIL || 'email@example.com',
    password: process.env.TW_PASSWORD || 'example'
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

const TrueWallet = require('../')

const tw = new TrueWallet({
    email: process.env.TW_EMAIL || 'email@example.com',
    password: process.env.TW_PASSWORD || 'example',
    cacheFile: __dirname + '/cache.json',
    pollInterval: 1000
})

// Authenticate
tw.login()
    .then(tw.startPolling)
    .catch(console.log)

// Listen for new transactions
tw.on('transaction', console.log)

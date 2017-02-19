const request = require('request')
const assert = require("assert")
const EventEmitter = require('events');
const fs = require('fs')

const host = 'https://wallet.truemoney.com'

module.exports = class TrueWallet extends EventEmitter {

    constructor(options) {
        super()

        this.logged = false
        this.jar = request.jar()
        this.options = {
            pollInterval: 60000
        }
        this.transactionHistory = null
        this.validateOptions(options)
        this.login = this.login.bind(this)
        this.history = this.history.bind(this)
        this.startPolling = this.startPolling.bind(this)
        this.appendHistory = this.appendHistory.bind(this)
        this.poll = this.poll.bind(this)
        this.filterExists = this.filterExists.bind(this)
        this.processPollResult = this.processPollResult.bind(this)
    }

    validateOptions(options) {
        assert(options != null, 'Options are required')
        assert(options.email != null, 'Email is required')
        assert(options.password != null, 'Password is required')
        this.options.email = options.email
        this.options.password = options.password
        if (options.pollInterval) {
            this.options.pollInterval = options.pollInterval
        }
        if (options.cacheFile) {
            assert(fs.existsSync(options.cacheFile), 'Cache file doesn\'t exist')
            this.options.cacheFile = options.cacheFile
            this.transactionHistory = JSON.parse(fs.readFileSync(this.options.cacheFile))
        }
    }

    login() {
        this.logged = false
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: host + '/user/login',
                form: {
                    email: this.options.email,
                    password: this.options.password
                },
                jar: this.jar
            }, (err, response, body) => {
                if (err) {
                    return reject(err)
                }
                if (body.includes('Whoops, looks like something went wrong.')) {
                    reject('Wrong credentials')
                } else {
                    this.logged = true
                    resolve()
                }
            })
        })
    }

    history() {
        return new Promise((resolve, reject) => {
            if (!this.logged) {
                return reject('Not logged in')
            }
            request({
                method: 'GET',
                url: host + '/api/transaction_history',
                jar: this.jar
            }, (err, response, body) => {
                if (err) {
                    return reject(err)
                }
                let data = JSON.parse(body)
                let activities = []
                data.data.activities.forEach((activity) => {
                    if (activity.text3En != 'creditor') {
                        return
                    }
                    let ac = {
                        reportID: activity.reportID,
                        date: activity.text2En,
                        phone: activity.text5En.split('-').join(''),
                        amount: parseFloat(activity.text4En)
                    }
                    ac.details = () => {
                        return this.details(ac)
                    }
                    activities.push(ac)
                })
                resolve(activities)
            })
        })
    }

    details(entry) {
        return new Promise((resolve, reject) => {
            if (!this.logged) {
                return reject('Not logged in')
            }
            if (entry.reportID == null) {
                return reject('Invalid arg')
            }
            request({
                method: 'GET',
                url: host + '/api/transaction_history_detail',
                qs: {reportID: entry.reportID},
                jar: this.jar
            }, (err, response, body) => {
                if (err) {
                    return reject(err)
                }
                let data = JSON.parse(body)
                let datetime = data.data.section4.column1.cell1.value.split(' ')
                resolve({
                    reportID: entry.reportID,
                    date: datetime[0],
                    time: datetime[1],
                    datetime: datetime.join(' '),
                    txid: data.data.section4.column2.cell1.value,
                    totalAmount: parseFloat(data.data.section3.column1.cell2.value),
                    amount: parseFloat(data.data.section3.column1.cell1.value),
                    fee: parseFloat(data.data.section3.column2.cell1.value),
                    message: data.data.personalMessage.value,
                    ref1: data.data.ref1,
                    owner: data.data.section2.column1.cell2.value,
                    phone: data.data.section2.column1.cell1.value.split('-').join(''),
                    operator: data.data.section2.column2.value,
                    serviceType: data.data.serviceType,
                    favourite: data.data.isFavorited != 'no'
                })
            })
        })
    }

    startPolling() {
        return new Promise((resolve, reject) => {
            if (!this.logged) {
                return reject('Not logged in')
            }
            if (this.transactionHistory == null) {
                this.history()
                    .then(TrueWallet.extractID)
                    .then(result => {
                        this.transactionHistory = result
                        this.poll()
                        resolve()
                    })
            } else {
                this.poll()
                resolve()
            }
        })
    }

    poll() {
        this.history()
            .then(this.filterExists)
            .then(this.processPollResult)
            .then(() => {
                setTimeout(this.poll, this.options.pollInterval)
            })
    }

    processPollResult(transactions) {
        this.appendHistory(TrueWallet.extractID(transactions))
        if (this.options.cacheFile) {
            fs.writeFile(this.options.cacheFile, JSON.stringify(this.transactionHistory))
        }
        transactions.forEach(transaction => {
            this.emit('transaction', transaction)
        })
    }

    appendHistory(data) {
        if (data instanceof Array) {
            this.transactionHistory = this.transactionHistory.concat(data)
        } else {
            this.transactionHistory.push(data)
        }
        return data
    }

    filterExists(transactions) {
        return transactions.filter(transaction => !this.transactionHistory.includes(transaction.reportID))
    }

    static extractID(transactions) {
        return transactions.map(transaction => transaction.reportID)
    }
}

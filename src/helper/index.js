const account = require('./account')
const revealAccount = require('./reveal')
const signOperation = require('./signTransaction')
const sendTransaction = require('./sendTransaction')

module.exports = {
    generateKeystore: account,
    revealAccount,
    signTransaction: signOperation,
    sendTransaction
}
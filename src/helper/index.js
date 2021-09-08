const account = require('./account')
const revealAccount = require('./reveal')
const activateAccount = require('./activate')
const delegate = require('./delegate')
const transferTez = require('./transferTez')
const deployContract = require('./deployContract')
const invokeContract = require('./invokeContract')
const signOperation = require('./utils/signTransaction')
const sendTransaction = require('./sendTransaction')

module.exports = {
    generateKeystore: account,
    revealAccount,
    activateAccount,
    signTransaction: signOperation,
    sendTransaction,
    delegate,
    transferTez,
    deployContract,
    invokeContract
}
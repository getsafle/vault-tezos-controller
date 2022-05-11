const { importAccount, manageSeedandGetAccountDetails } = require('./account')
const revealAccount = require('./reveal')
const activateAccount = require('./activate')
const delegate = require('./delegate')
const transferTez = require('./transferTez')
const deployContract = require('./deployContract')
const invokeContract = require('./invokeContract')
const signOperation = require('./utils/signTransaction')
const sendTransaction = require('./sendTransaction')
const getFees = require('./getDefaultFees')
const getNetwork = require('./utils/getNetwork')
const getBalance = require("./getBalance")
const getHDPath = require("./utils/getHdPath")

module.exports = {
    generateKeystore: manageSeedandGetAccountDetails,
    importAccount,
    revealAccount,
    activateAccount,
    signTransaction: signOperation,
    sendTransaction,
    delegate,
    transferTez,
    deployContract,
    invokeContract,
    getFees,
    getNetwork,
    getBalance,
    getHDPath
}
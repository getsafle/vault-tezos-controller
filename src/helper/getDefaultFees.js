const { TezosConstants } = require('conseiljs')

const {
    tezos_transaction: { ACTIVATE_ACCOUNT, REVEAL_ACCOUNT, DELEGATE, NATIVE_TRANSFER, DEPLOY_CONTRACT_TRANSACTION, CONTRACT_TRANSACTION },
} = require('../config')

async function getFees(txnType) {
    if (txnType === REVEAL_ACCOUNT) {
        return TezosConstants.DefaultKeyRevealFee
    }
    if (txnType === NATIVE_TRANSFER) {
        return TezosConstants.DefaultSimpleTransactionFee
    }
    if (txnType === DELEGATE) {
        return TezosConstants.DefaultDelegationFee
    }
    if (txnType === DEPLOY_CONTRACT_TRANSACTION) {
        return 100000
    }
    if (txnType === CONTRACT_TRANSACTION) {
        return 100000
    }
    return null
}

module.exports = getFees
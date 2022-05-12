const { TezosNodeReader } = require('conseiljs')

async function accountBalance(server, address) {
    const balance = await TezosNodeReader.getSpendableBalanceForAccount(server, address);
    return balance
}

module.exports = accountBalance

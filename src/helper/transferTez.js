const { TezosConstants, TezosNodeReader } = require('conseiljs')
const signTransaction = require('./utils/signTransaction')
const prepareOperation = require('./utils/prepareOperation')

async function transferTezOperation(server, signer, keyStore, to, amount, fee = TezosConstants.DefaultSimpleTransactionFee, offset = TezosConstants.HeadBranchOffset, optimizeFee = false) {
    const counter = await TezosNodeReader.getCounterForAccount(server, keyStore.publicKeyHash) + 1;

    const transaction = {
        destination: to,
        amount: amount.toString(),
        storage_limit: TezosConstants.DefaultTransactionStorageLimit + '',
        gas_limit: TezosConstants.DefaultTransactionGasLimit + '',
        counter: counter.toString(),
        fee: fee.toString(),
        source: keyStore.publicKeyHash,
        kind: 'transaction'
    };

    const operations = await prepareOperation(server, keyStore, counter, transaction, optimizeFee);

    return signTransaction(server, operations, signer, offset);
}

module.exports = transferTezOperation
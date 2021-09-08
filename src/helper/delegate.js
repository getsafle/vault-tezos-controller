const { TezosConstants, TezosNodeReader } = require('conseiljs')
const signTransaction = require('./utils/signTransaction')
const prepareOperation = require('./utils/prepareOperation')

async function delegateOperation(server, signer, keyStore, delegate, fee = TezosConstants.DefaultDelegationFee, offset = TezosConstants.HeadBranchOffset, optimizeFee = false) {
    const counter = await TezosNodeReader.getCounterForAccount(server, keyStore.publicKeyHash) + 1;

    const delegation = {
        kind: 'delegation',
        source: keyStore.publicKeyHash,
        fee: fee.toString(),
        counter: counter.toString(),
        storage_limit: TezosConstants.DefaultDelegationStorageLimit.toString(),
        gas_limit: TezosConstants.DefaultDelegationGasLimit.toString(),
        delegate: delegate
    };

    const operations = await prepareOperation(server, keyStore, counter, delegation, optimizeFee);

    return signTransaction(server, operations, signer, offset);
}

module.exports = delegateOperation
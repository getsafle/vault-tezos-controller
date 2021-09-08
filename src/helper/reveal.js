const {TezosConstants, TezosNodeReader} = require('conseiljs')
const signTransaction = require('./utils/signTransaction')

async function revealOperation(server, signer, keyStore, fee = TezosConstants.DefaultKeyRevealFee, offset = TezosConstants.HeadBranchOffset) {
    const counter = await TezosNodeReader.getCounterForAccount(server, keyStore.publicKeyHash) + 1;

    const revealOp = {
        kind: 'reveal',
        source: keyStore.publicKeyHash,
        fee: fee + '',
        counter: counter.toString(),
        gas_limit: '10000',
        storage_limit: '0',
        public_key: keyStore.publicKey
    };
    const operations = [revealOp];

    return signTransaction(server, operations, signer, offset);
}

module.exports = revealOperation
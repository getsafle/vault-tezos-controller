const { TezosConstants, TezosNodeReader, TezosNodeWriter, TezosParameterFormat } = require('conseiljs')
const signTransaction = require('./utils/signTransaction')
const prepareOperation = require('./utils/prepareOperation')

async function deployContractOperation(server, signer, keyStore, amount, delegate, fee, storageLimit, gasLimit, code, storage, codeFormat = TezosParameterFormat.Micheline, offset = TezosConstants.HeadBranchOffset, optimizeFee = false) {
    const counter = await TezosNodeReader.getCounterForAccount(server, keyStore.publicKeyHash) + 1;
    const origination = TezosNodeWriter.constructContractOriginationOperation(keyStore, amount, delegate, fee, storageLimit, gasLimit, code, storage, codeFormat, counter);

    const operations = await prepareOperation(server, keyStore, counter, origination, optimizeFee);

    return signTransaction(server, operations, signer, offset);
}

module.exports = deployContractOperation


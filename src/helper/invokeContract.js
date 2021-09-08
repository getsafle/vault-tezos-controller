const { TezosConstants, TezosNodeReader, TezosNodeWriter, TezosParameterFormat } = require('conseiljs')
const signTransaction = require('./utils/signTransaction')
const prepareOperation = require('./utils/prepareOperation')

async function invokeContractOperation(server, signer, keyStore, contract, amount, fee, storageLimit, gasLimit, entrypoint, parameters, parameterFormat = TezosParameterFormat.Micheline, offset = TezosConstants.HeadBranchOffset, optimizeFee = false) {
    const counter = await TezosNodeReader.getCounterForAccount(server, keyStore.publicKeyHash) + 1;

    const transaction = TezosNodeWriter.constructContractInvocationOperation(keyStore.publicKeyHash, counter, contract, amount, fee, storageLimit, gasLimit, entrypoint, parameters, parameterFormat);

    const operations = await prepareOperation(server, keyStore, counter, transaction, optimizeFee);

    return signTransaction(server, operations, signer, offset);
}

module.exports = invokeContractOperation


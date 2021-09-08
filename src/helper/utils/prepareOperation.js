const {TezosNodeWriter} = require('conseiljs')

async function prepareOperation(server, keyStore, counter, operation, optimizeFee = false) {
    const operationGroup = await TezosNodeWriter.appendRevealOperation(server, keyStore.publicKey, keyStore.publicKeyHash, counter - 1, [operation]);

    if (optimizeFee) {
        const estimate = await TezosNodeWriter.estimateOperationGroup(server, 'main', operationGroup);
        operationGroup[0].fee = estimate.estimatedFee.toString();
        for (let i = 0; i < operationGroup.length; i++) {
            operationGroup[i].gas_limit = estimate.operationResources[i].gas.toString();
            operationGroup[i].storage_limit = estimate.operationResources[i].storageCost.toString();
        }
    }

    return operationGroup;
}

module.exports = prepareOperation
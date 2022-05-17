const signTransaction = require('./utils/signTransaction')

async function activateOperation(server, signer, keyStore, activationCode="64094c4ff0c9c1b0fbe14b84edd26cd013db5003") {
    const activation = { kind: 'activate_account', pkh: keyStore.publicKeyHash, secret: activationCode };

    return signTransaction(server, [activation], signer);
}

module.exports = activateOperation
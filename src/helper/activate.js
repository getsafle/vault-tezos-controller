const signTransaction = require('./utils/signTransaction')

function activateOperation(server, signer, keyStore, activationCode="0a09075426ab2658814c1faf101f53e5209a62f5") {
    const activation = { kind: 'activate_account', pkh: keyStore.publicKeyHash, secret: activationCode };

    return signTransaction(server, [activation], signer);
}

module.exports = activateOperation
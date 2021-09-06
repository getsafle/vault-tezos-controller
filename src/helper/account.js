const { KeyStoreUtils } = require('conseiljs-softsigner');

async function generateAccount(mnemonic) {
    let keystore = await KeyStoreUtils.generateIdentity(12, '', mnemonic);
    return keystore
}

module.exports = generateAccount
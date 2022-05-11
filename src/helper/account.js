const { Buffer } = require('buffer');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const { KeyStoreUtils } = require('conseiljs-softsigner');
const { TezosMessageUtils } = require('conseiljs')
const { tezos_key_hint: { EDSK } } = require('../config/index')


async function importAccount(_privateKey) {
    let keystore = await KeyStoreUtils.restoreIdentityFromSecretKey(_privateKey);
    return keystore
}

async function _getAccountDetailsFromSeed(seed, dPath) {
    const derivedSeed = derivePath(dPath, seed).key;
    let key = await KeyStoreUtils.generateKeys(derivedSeed)

    const privKey = TezosMessageUtils.readKeyWithHint(key.secretKey, EDSK);
    const account = await KeyStoreUtils.restoreIdentityFromSecretKey(privKey);

    return account;
}

async function manageSeedandGetAccountDetails(mnemonic, hdPath) {
    const normalizeMnemonic = mnemonic.trim().split(/\s+/g).join(" ")
    const seedHex = bip39.mnemonicToSeedHex(normalizeMnemonic)
    return await _getAccountDetailsFromSeed(
        Buffer.from(seedHex, 'hex'),
        hdPath,
    );
}

module.exports = { importAccount, manageSeedandGetAccountDetails }
const { SoftSigner } = require('conseiljs-softsigner');
const { registerFetch, registerLogger, TezosMessageUtils } = require('conseiljs')
const fetch = require('node-fetch');
const log = require('loglevel');

const { tezos: { HD_PATH }, tezos_transaction: { REVEAL_ACCOUNT }, tezos_ket_hint: { EDSK } } = require('./config')
const helper = require('./helper')

const logger = log.getLogger('conseiljs');
registerLogger(logger);
registerFetch(fetch);

class XTZHdKeyring {
  constructor(mnemonic) {
    this.mnemonic = mnemonic
    this.hdPath = HD_PATH
    this.wallet = null
    this.address = null
  }

  async generateWallet() {
    let keystore = await helper.generateKeystore(this.mnemonic)
    delete keystore.secretKey
    delete keystore.seed
    this.wallet = keystore
    this.address = keystore.publicKeyHash
    return { address: this.address };
  }

  async exportPrivateKey() {
    let keystore = await helper.generateKeystore(this.mnemonic)
    return { privateKey: keystore.secretKey };
  }

  /**
   * REVEAL_ACC : { data : {}, txnType: REVEAL_ACCOUNT }
   *     
   */
  /**
   *  
   * @param {object: REVEAL_ACC } transaction 
   * @param {string} connectionUrl
   * @returns 
   */
  async signTransaction(transaction, connectionUrl) {
    const keyStore = await helper.generateKeystore(this.mnemonic)

    const signer = await SoftSigner.createSigner(TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, EDSK))

    const { txnType } = transaction;
    if (txnType === REVEAL_ACCOUNT) {
      const revealTxn = await helper.revealAccount(connectionUrl, signer, keyStore)

      return { signedTransaction: revealTxn }
    }
  }

  async signMessage(message) {
    let keystore = await helper.generateKeystore(this.mnemonic)
    const signer = await SoftSigner.createSigner(TezosMessageUtils.writeKeyWithHint(keystore.secretKey, EDSK));
    const msg = await signer.signText(message)
    return { signedMessage: msg };
  }

  async getAccounts() {
    return { address: this.wallet }
  }

  async sendTransaction(rawTransaction, connectionUrl) {
    const transactionDetails = await helper.sendTransaction(connectionUrl, rawTransaction)
    return { transactionDetails: transactionDetails }
  }
}

module.exports = XTZHdKeyring

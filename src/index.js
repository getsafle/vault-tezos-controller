const conseiljssoftsigner = require('conseiljs-softsigner');

const { tezos: { HD_PATH } } = require('./config')

class XTZHdKeyring {
  constructor(mnemonic) {
    this.mnemonic = mnemonic
    this.hdPath = HD_PATH
    this.wallet = null
    this.address = null
  }

  async generateWallet() {
    const keystore = await conseiljssoftsigner.KeyStoreUtils.generateIdentity(12, '', this.mnemonic);
    this.wallet = keystore
    this.address = keystore.publicKeyHash
    return { address: this.address };
  }

  async exportPrivateKey() {
    const accountDetails = this.wallet
    return { privateKey: accountDetails.secretKey };
  }

  async signTransaction(transaction) {
    const accountDetails = this.wallet
    const signer = new conseiljssoftsigner.SoftSigner(accountDetails.secretKey);
    const opSignature = await signer.signOperation(Buffer.from(transaction, 'hex'))

    const base58signature = TezosMessageUtils.readSignatureWithHint(opSignature, signer.getSignerCurve());
    return { signedTransaction: opSignature, signature: base58signature };
  }

  async signMessage(message) {
    const accountDetails = this.wallet
    const signer = new conseiljssoftsigner.SoftSigner(accountDetails.secretKey);
    const msg = await signer.signText(message)
    return { signedMessage: msg };
  }

  async getAccounts() {
    const accountDetails = this.wallet;
    return { address: accountDetails.publicKeyHash }
  }
}

module.exports = XTZHdKeyring

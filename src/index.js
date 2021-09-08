const { SoftSigner } = require('conseiljs-softsigner');
const { registerFetch, registerLogger, TezosMessageUtils } = require('conseiljs')
const fetch = require('node-fetch');
const log = require('loglevel');

const { tezos: { HD_PATH }, tezos_transaction: { ACTIVATE_ACCOUNT, REVEAL_ACCOUNT, DELEGATE, NATIVE_TRANSFER, DEPLOY_CONTRACT_TRANSACTION, CONTRACT_TRANSACTION }, tezos_ket_hint: { EDSK } } = require('./config')
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
   * ACTIVATE_ACCOUNT: {data: {}, txnType: ACTIVATE_ACCOUNT}
   * REVEAL_ACC : { data : {}, txnType: REVEAL_ACCOUNT }
   * DELEGATE : { data : {delegate: string}, txnType: DELEGATE }
   * NATIVE_TRANSFER: {data: {to:string, amount:uint}, txnType: NATIVE_TRANSFER}
   * DEPLOY_CONTRACT_TRANSACTION: {data: {}, txnType: DEPLOY_CONTRACT_TRANSACTION}
   * CONTRACT_TRANSACTION: {data: {}, txnType: CONTRACT_TRANSACTION}
   * 
   */
  /**
   *  
   * @param {object: ACTIVATE_ACCOUNT | REVEAL_ACC | DELEGATE | NATIVE_TRANSFER | DEPLOY_CONTRACT_TRANSACTION | CONTRACT_TRANSACTION } transaction 
   * @param {string} connectionUrl
   * @returns 
   */
  async signTransaction(transaction, connectionUrl) {
    const keyStore = await helper.generateKeystore(this.mnemonic)

    const signer = await SoftSigner.createSigner(TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, EDSK))

    const { txnType } = transaction;
    if (txnType === ACTIVATE_ACCOUNT) {
      const activateTxn = await helper.activateAccount(connectionUrl, signer, keyStore)

      return { signedTransaction: activateTxn }
    }
    if (txnType === NATIVE_TRANSFER) {
      const { to, amount } = transaction.data
      const transferTezTxn = await helper.transferTez(connectionUrl, signer, keyStore, to, amount)

      return { signedTransaction: transferTezTxn }
    }
    if (txnType === REVEAL_ACCOUNT) {
      const revealTxn = await helper.revealAccount(connectionUrl, signer, keyStore)

      return { signedTransaction: revealTxn }
    }
    if (txnType === DELEGATE) {
      const { delegate } = transaction.data
      const delegateTxn = await helper.delegate(connectionUrl, signer, keyStore, delegate)

      return { signedTransaction: delegateTxn }
    }
    if (txnType === DEPLOY_CONTRACT_TRANSACTION) {
      const { amount, delegate, fee, storageLimit, gasLimit, code, storage, codeFormat, offset, optimizeFee } = transaction.data
      const deployContractTxn = await helper.deployContract(connectionUrl, signer, keyStore, amount, delegate, fee, storageLimit, gasLimit, code, storage, codeFormat, offset, optimizeFee)

      return { signedTransaction: deployContractTxn }
    }
    if (txnType === CONTRACT_TRANSACTION) {

      const { contract, amount, fee, storageLimit, gasLimit, entrypoint, parameters, parameterFormat, offset, optimizeFee } = transaction.data
      const invokeContractTxn = await helper.invokeContract(connectionUrl, signer, keyStore, contract, amount, fee, storageLimit, gasLimit, entrypoint, parameters, parameterFormat, offset, optimizeFee)

      return { signedTransaction: invokeContractTxn }
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

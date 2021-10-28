const { SoftSigner } = require('conseiljs-softsigner');
const { registerFetch, registerLogger, TezosMessageUtils } = require('conseiljs')
const fetch = require('node-fetch');
const log = require('loglevel');

const {
  tezos: { HD_PATH },
  tezos_transaction: { ACTIVATE_ACCOUNT, REVEAL_ACCOUNT, DELEGATE, NATIVE_TRANSFER, DEPLOY_CONTRACT_TRANSACTION, CONTRACT_TRANSACTION },
  tezos_key_hint: { EDSK },
  tezos_transaction_default_values: { DEFAULT_TRANSFER_TXN_FEE, DEFAULT_DELEGATE_TXN_FEE, DEFAULT_CONTRACT_TXN_CODE_FORMAT, DEFAULT_CONTRACT_TXN_PARAM_FORMAT, DEFAULT_TXN_OFFSET, DEFAULT_TXN_OPTIMIZATION }
} = require('./config')
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
    if (txnType === REVEAL_ACCOUNT) {
      const revealTxn = await helper.revealAccount(connectionUrl, signer, keyStore)

      return { signedTransaction: revealTxn }
    }
    if (txnType === NATIVE_TRANSFER) {
      const { to, amount, fee, offset, optimizeFee } = transaction.data
      const transferTezTxn = await helper.transferTez(connectionUrl, signer, keyStore, to, amount, fee !== undefined ? fee : DEFAULT_TRANSFER_TXN_FEE, offset !== undefined ? offset : DEFAULT_TXN_OFFSET, optimizeFee !== undefined ? optimizeFee : DEFAULT_TXN_OPTIMIZATION)

      return { signedTransaction: transferTezTxn }
    }
    if (txnType === DELEGATE) {
      const { delegate, fee, offset, optimizeFee } = transaction.data
      const delegateTxn = await helper.delegate(connectionUrl, signer, keyStore, delegate, fee !== undefined ? fee : DEFAULT_DELEGATE_TXN_FEE, offset !== undefined ? offset : DEFAULT_TXN_OFFSET, optimizeFee !== undefined ? optimizeFee : DEFAULT_TXN_OPTIMIZATION)

      return { signedTransaction: delegateTxn }
    }
    if (txnType === DEPLOY_CONTRACT_TRANSACTION) {
      const { amount, delegate, fee, storageLimit, gasLimit, code, storage, codeFormat, offset, optimizeFee } = transaction.data
      const deployContractTxn = await helper.deployContract(
        connectionUrl,
        signer,
        keyStore,
        amount,
        delegate,
        fee,
        storageLimit,
        gasLimit,
        code,
        storage,
        codeFormat !== undefined ? codeFormat : DEFAULT_CONTRACT_TXN_CODE_FORMAT,
        offset !== undefined ? offset : DEFAULT_TXN_OFFSET,
        optimizeFee !== undefined ? optimizeFee : DEFAULT_TXN_OPTIMIZATION)

      return { signedTransaction: deployContractTxn }
    }
    if (txnType === CONTRACT_TRANSACTION) {
      const { contractAddress, amount, fee, storageLimit, gasLimit, entrypoint, parameters, parameterFormat, offset, optimizeFee } = transaction.data
      const invokeContractTxn = await helper.invokeContract(
        connectionUrl,
        signer,
        keyStore,
        contractAddress,
        amount,
        fee,
        storageLimit,
        gasLimit,
        entrypoint,
        parameters,
        parameterFormat !== undefined ? parameterFormat : DEFAULT_CONTRACT_TXN_PARAM_FORMAT,
        offset !== undefined ? offset : DEFAULT_TXN_OFFSET,
        optimizeFee !== undefined ? optimizeFee : DEFAULT_TXN_OPTIMIZATION)

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
    return { address: this.address }
  }

  async getFee(txnType) {
    const transactionFees = await helper.getFees(txnType)
    return { transactionFees }
  }

  async sendTransaction(rawTransaction, connectionUrl) {
    const transactionDetails = await helper.sendTransaction(connectionUrl, rawTransaction)
    return { transactionDetails: transactionDetails }
  }
}

module.exports = XTZHdKeyring

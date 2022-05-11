const ObservableStore = require('obs-store')
const { SoftSigner } = require('conseiljs-softsigner');
const { registerFetch, registerLogger, TezosMessageUtils } = require('conseiljs')
const fetch = require('node-fetch');
const log = require('loglevel');

const {
  tezos: { HD_PATH },
  tezos_transaction: { ACTIVATE_ACCOUNT, REVEAL_ACCOUNT, DELEGATE, NATIVE_TRANSFER, DEPLOY_CONTRACT_TRANSACTION, CONTRACT_TRANSACTION },
  tezos_key_hint: { EDSK },
  tezos_transaction_default_values: { DEFAULT_TRANSFER_TXN_FEE, DEFAULT_DELEGATE_TXN_FEE, DEFAULT_CONTRACT_TXN_CODE_FORMAT, DEFAULT_CONTRACT_TXN_PARAM_FORMAT, DEFAULT_TXN_OFFSET, DEFAULT_TXN_OPTIMIZATION },
  tezos_connection: { TEZOS_MAINNET }
} = require('./config')
const helper = require('./helper')

const logger = log.getLogger('conseiljs');
registerLogger(logger);
registerFetch(fetch);


/**
 * HD_PATH TO CHECK
 * m/44'/501'/${idx}'/0'
 * m/44'/501'/0'/${idx}'
 */

class KeyringController {

  /**
 * 
 * @param {mnemonic, network} opts
 * network = TESTNET | MAINNET 
 */
  constructor(opts) {
    this.store = new ObservableStore({ mnemonic: opts.mnemonic, hdPath: HD_PATH, network: helper.getNetwork(opts.network), networkType: opts.network ? opts.network : TEZOS_MAINNET.NETWORK, wallet: null, address: [] })
    this.importedWallets = []
  }


  async addAccount() {
    const { mnemonic, address } = this.store.getState();

    let keyStore = await helper.generateKeystore(mnemonic, helper.getHDPath(address.length))
    delete keyStore.secretKey
    delete keyStore.seed

    const _address = keyStore.publicKeyHash
    this.persistAllAddress(_address)
    return { address: _address }
  }

  async getAccounts() {
    const { address } = this.store.getState();
    return address
  }

  async exportPrivateKey(_address) {
    const { mnemonic, address } = this.store.getState()

    const idx = address.indexOf(_address)
    if (idx < 0)
      throw "Invalid address, the address is not available in the wallet"

    let keyStore = await helper.generateKeystore(mnemonic, helper.getHDPath(idx))
    return { privateKey: keyStore.secretKey };
  }

  async importWallet(_privateKey) {
    try {
      const keyStore = await helper.importAccount(_privateKey)
      this.importedWallets.push(keyStore.publicKeyHash);
      return keyStore.publicKeyHash
    } catch (e) {
      return Promise.reject(e)
    }
  }


  /**
   * ACTIVATE_ACCOUNT: {data: {}, txnType: ACTIVATE_ACCOUNT, from: string(address)}
   * REVEAL_ACC : { data : {}, txnType: REVEAL_ACCOUNT, from: string(address) }
   * DELEGATE : { data : {delegate: string}, txnType: DELEGATE, from: string(address) }
   * NATIVE_TRANSFER: {data: {to:string, amount:uint}, txnType: NATIVE_TRANSFER, from: string(address)}
   * DEPLOY_CONTRACT_TRANSACTION: {data: {}, txnType: DEPLOY_CONTRACT_TRANSACTION, from: string(address)}
   * CONTRACT_TRANSACTION: {data: {}, txnType: CONTRACT_TRANSACTION, from: string(address)}
   * 
   */
  /**
   *  
   * @param {object: ACTIVATE_ACCOUNT | REVEAL_ACC | DELEGATE | NATIVE_TRANSFER | DEPLOY_CONTRACT_TRANSACTION | CONTRACT_TRANSACTION } transaction 
   * @param {string} connectionUrl
   * @returns 
   */
  async signTransaction(transaction) {
    const { mnemonic, address, network: connectionUrl, networkType } = this.store.getState()

    const { from } = transaction
    const idx = address.indexOf(from)
    if (idx < 0)
      throw "Invalid address, the address is not available in the wallet"

    try {
      const keyStore = await helper.generateKeystore(mnemonic, helper.getHDPath(idx))
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
    } catch (err) {
      throw err
    }
  }

  async signMessage(message, _address) {
    const { mnemonic, network, address } = this.store.getState()
    const idx = address.indexOf(_address);
    if (idx < 0)
      throw "Invalid address, the address is not available in the wallet"
    try {
      const keyStore = await helper.generateKeystore(mnemonic, helper.getHDPath(idx))
      const signer = await SoftSigner.createSigner(TezosMessageUtils.writeKeyWithHint(keyStore.secretKey, EDSK));
      const msg = await signer.signText(message)
      return { signedMessage: msg };
    } catch (err) {
      throw err
    }
  }

  async sendTransaction(rawTransaction) {
    const { network } = this.store.getState()
    const transactionDetails = await helper.sendTransaction(network, rawTransaction)
    return { transactionDetails: transactionDetails }
  }

  async getFee(txnType) {
    const transactionFees = await helper.getFees(txnType)
    return { transactionFees }
  }

  persistAllAddress(_address) {
    const { address } = this.store.getState()
    let newAdd = address
    newAdd.push(_address)
    this.store.updateState({ address: newAdd })
    return true
  }
  updatePersistentStore(obj) {
    this.store.updateState(obj)
    return true
  }

}

const getBalance = async (address, networkType) => {
  try {
    // const network = helper.getNetwork(networkType)
    // const balance = await helper.getBalance(address)
    // const connection = new solanaWeb3.Connection(network, "confirmed")
    // const accInfo = await connection.getAccountInfo(new solanaWeb3.PublicKey(address))
    return { balance: 0 }
  } catch (err) {
    throw err
  }
}


module.exports = { KeyringController, getBalance }

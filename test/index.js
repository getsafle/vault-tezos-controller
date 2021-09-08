var assert = require('assert');
const Tezos = require('../src/index')
const {
    HD_WALLET_12_MNEMONIC,
    TEZOS_NETWORK: {
        TEZOS_TESTNET_FLORENCENET,
        TEZOS_TESTNET_GRANADANET,
        CONSEIL_TESTNET_FLORENCENET,
        CONSEIL_TESTNET_GRANADANET,
        TEZOS_MAINNET,
        COONSEIL_MAINNET
    },
    TRANSACTION_TYPE: {
        ACTIVATE_ACCOUNT,
        REVEAL_ACCOUNT,
        DELEGATE,
        NATIVE_TRANSFER,
        DEPLOY_CONTRACT_TRANSACTION,
        CONTRACT_TRANSACTION
    },
    DELEGATE_TRANSACTION_PARAM: {
        DELEGATE_ADD,
    },
    NATIVE_TEZ_TRANSFER_TRANSACTION_PARAM: {
        TO_ADDRESS,
        TEZ_AMOUNT
    },
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3
} = require('./constants')

const ACTIVATE_TXN_PARAM = {
    transaction: {
        data: {}, txnType: ACTIVATE_ACCOUNT
    },
    connectionUrl: TEZOS_TESTNET_FLORENCENET
}

const REVEAL_TXN_PARAM = {
    transaction: {
        data: {}, txnType: REVEAL_ACCOUNT
    },
    connectionUrl: TEZOS_TESTNET_FLORENCENET
}

const DELEGATE_TXN_PARAM_NO_DELEGATE = {
    transaction: {
        data: {}, txnType: DELEGATE
    },
    connectionUrl: TEZOS_TESTNET_FLORENCENET
}

const DELEGATE_TXN_PARAM = {
    transaction: {
        data: {
            delegate: DELEGATE_ADD
        }, txnType: DELEGATE
    },
    connectionUrl: TEZOS_TESTNET_FLORENCENET
}

const TEZ_TRANSFER_TXN_PARAM = {
    transaction: {
        data: {
            to: TO_ADDRESS,
            amount: TEZ_AMOUNT
        }, txnType: NATIVE_TRANSFER
    },
    connectionUrl: TEZOS_TESTNET_FLORENCENET
}

const DEPLOY_CONTRACT_TXN_PARAM = {
    transaction: {
        data: {
            to: TO_ADDRESS,
            amount: TEZ_AMOUNT
        }, txnType: DEPLOY_CONTRACT_TRANSACTION
    },
    connectionUrl: TEZOS_TESTNET_FLORENCENET
}

const INVOKE_CONTRACT_TXN_PARAM = {
    transaction: {
        data: {}, txnType: CONTRACT_TRANSACTION
    },
    connectionUrl: TEZOS_TESTNET_FLORENCENET
}

describe('Initialize wallet ', () => {
    const tezWallet = new Tezos(HD_WALLET_12_MNEMONIC)

    it("Should have correct mnemonic", () => {
        assert.equal(tezWallet.mnemonic, HD_WALLET_12_MNEMONIC, "Incorrect hd wallet")
    })

    it("Should generateWallet ", async () => {
        assert(tezWallet.address === null)
        const wallet = await tezWallet.generateWallet()
        assert(tezWallet.address !== null)
    })

    it("Should fetch privateKey ", async () => {
        assert(tezWallet.address !== null)
        const privateKey = await tezWallet.exportPrivateKey()
        console.log("Private key ", privateKey)
        assert(tezWallet.address !== null)
    })

    it("Should fetch account details ", async () => {
        assert(tezWallet.address !== null)
        const account = await tezWallet.getAccounts()
        console.log("Account details: ", account)
        assert(tezWallet.address !== null)
    })

    it("Should sign message", async () => {
        const signedMessage1 = await tezWallet.signMessage(TESTING_MESSAGE_1)
        console.log("Signed message 1: ", signedMessage1)

        const signedMessage2 = await tezWallet.signMessage(TESTING_MESSAGE_2)
        console.log("Signed message 2: ", signedMessage2)

        const signedMessage3 = await tezWallet.signMessage(TESTING_MESSAGE_3)
        console.log("Signed message 3: ", signedMessage3)
    })

    it("Should sign and send activate txn", async () => {
        const activateTxn = await tezWallet.signTransaction(ACTIVATE_TXN_PARAM.transaction, ACTIVATE_TXN_PARAM.connectionUrl)
        console.log("activateTxn ", activateTxn)
        const transactionResult = await tezWallet.sendTransaction(activateTxn.signedTransaction.signedOperations, ACTIVATE_TXN_PARAM.connectionUrl)
        console.log("transactionResult ", transactionResult)
    })

    it("Should sign and send reveal txn", async () => {
        const revealTxn = await tezWallet.signTransaction(REVEAL_TXN_PARAM.transaction, REVEAL_TXN_PARAM.connectionUrl)
        console.log("revealTxn ", revealTxn)
        const transactionResult = await tezWallet.sendTransaction(revealTxn.signedTransaction.signedOperations, REVEAL_TXN_PARAM.connectionUrl)
        console.log("transactionResult ", transactionResult)
    })

    it("Should sign and send delegate txn with no delegate address", async () => {
        const delegate = await tezWallet.signTransaction(DELEGATE_TXN_PARAM_NO_DELEGATE.transaction, DELEGATE_TXN_PARAM_NO_DELEGATE.connectionUrl)
        console.log("delegate ", delegate)
        const transactionResult = await tezWallet.sendTransaction(delegate.signedTransaction.signedOperations, DELEGATE_TXN_PARAM_NO_DELEGATE.connectionUrl)
        console.log("transactionResult ", transactionResult)
    })

    it("Should sign and send delegate txn with delegate address", async () => {
        const delegate = await tezWallet.signTransaction(DELEGATE_TXN_PARAM.transaction, DELEGATE_TXN_PARAM.connectionUrl)
        console.log("delegate ", delegate)
        const transactionResult = await tezWallet.sendTransaction(delegate.signedTransaction.signedOperations, DELEGATE_TXN_PARAM.connectionUrl)
        console.log("transactionResult ", transactionResult)
    })

    it("Should sign and send TEZ", async () => {
        const transferTez = await tezWallet.signTransaction(TEZ_TRANSFER_TXN_PARAM.transaction, TEZ_TRANSFER_TXN_PARAM.connectionUrl)
        console.log("transferTez ", transferTez)
        const transactionResult = await tezWallet.sendTransaction(transferTez.signedTransaction.signedOperations, TEZ_TRANSFER_TXN_PARAM.connectionUrl)
        console.log("transactionResult ", transactionResult)
    })

    it("Should sign and send deploy contract transaction", async () => {
        const deployContractTxn = await tezWallet.signTransaction(DEPLOY_CONTRACT_TXN_PARAM.transaction, DEPLOY_CONTRACT_TXN_PARAM.connectionUrl)
        console.log("deployContractTxn ", deployContractTxn)
        const transactionResult = await tezWallet.sendTransaction(deployContractTxn.signedTransaction.signedOperations, DEPLOY_CONTRACT_TXN_PARAM.connectionUrl)
        console.log("transactionResult ", transactionResult)
    })

    it("Should sign and send invoke contract transaction", async () => {
        const invokeContractTxn = await tezWallet.signTransaction(INVOKE_CONTRACT_TXN_PARAM.transaction, INVOKE_CONTRACT_TXN_PARAM.connectionUrl)
        console.log("invokeContractTxn ", invokeContractTxn)
        const transactionResult = await tezWallet.sendTransaction(invokeContractTxn.signedTransaction.signedOperations, INVOKE_CONTRACT_TXN_PARAM.connectionUrl)
        console.log("transactionResult ", transactionResult)
    })

})
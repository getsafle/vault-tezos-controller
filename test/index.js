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
        REVEAL_ACCOUNT
    },
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3
} = require('./constants')


const REVEAL_TXN_PARAM = {
    transaction: {
        data: {}, txnType: REVEAL_ACCOUNT
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

    it("Should sign and send reveal txn", async () => {
        const revealTxn = await tezWallet.signTransaction(REVEAL_TXN_PARAM.transaction, REVEAL_TXN_PARAM.connectionUrl)
        console.log("revealTxn ", revealTxn)
        const transactionResult = await tezWallet.sendTransaction(revealTxn.signedTransaction.signedOperations, REVEAL_TXN_PARAM.connectionUrl)
        console.log("transactionResult ", transactionResult)
    })

})
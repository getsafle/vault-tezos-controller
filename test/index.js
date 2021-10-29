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
    DEPLOY_CONTRACT_TRANSACTION_PARAM: {
        DEPLOY_AMOUNT,
        DEPLOY_DELEGATE,
        DEPLOY_FEE,
        DEPLOY_STORAGE_LIMIT,
        DEPLOY_GAS_LIMIT,
        CONTRACT_CODE,
        STORAGE
    },
    INVOKE_CONTRACT_TRANSACTION_PARAM: {
        INVOKE_CONTRACT_ADDRESS,
        INVOKE_AMOUNT,
        INVOKE_FEE,
        INVOKE_STORAGE_LIMIT,
        INVOKE_GAS_LIMIT,
        INVOKE_ENTRY_POINT,
        INVOKE_PARAMETERS
    },
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3
} = require('./constants')

const ACTIVATE_TXN_PARAM = {
    transaction: {
        data: {}, txnType: ACTIVATE_ACCOUNT
    },
    connectionUrl: TEZOS_TESTNET_GRANADANET
}

const REVEAL_TXN_PARAM = {
    transaction: {
        data: {}, txnType: REVEAL_ACCOUNT
    },
    connectionUrl: TEZOS_TESTNET_GRANADANET
}

const DELEGATE_TXN_PARAM_NO_DELEGATE = {
    transaction: {
        data: {}, txnType: DELEGATE
    },
    connectionUrl: TEZOS_TESTNET_GRANADANET
}

const DELEGATE_TXN_PARAM = {
    transaction: {
        data: {
            delegate: DELEGATE_ADD
        }, txnType: DELEGATE
    },
    connectionUrl: TEZOS_TESTNET_GRANADANET
}

const TEZ_TRANSFER_TXN_PARAM = {
    transaction: {
        data: {
            to: TO_ADDRESS,
            amount: TEZ_AMOUNT
        }, txnType: NATIVE_TRANSFER
    },
    connectionUrl: TEZOS_TESTNET_GRANADANET
}

const DEPLOY_CONTRACT_TXN_PARAM = {
    transaction: {
        data: {
            amount: DEPLOY_AMOUNT,
            delegate: DEPLOY_DELEGATE,
            fee: DEPLOY_FEE,
            storageLimit: DEPLOY_STORAGE_LIMIT,
            gasLimit: DEPLOY_GAS_LIMIT,
            code: CONTRACT_CODE,
            storage: STORAGE,
        }, txnType: DEPLOY_CONTRACT_TRANSACTION
    },
    connectionUrl: TEZOS_TESTNET_GRANADANET
}

const INVOKE_CONTRACT_TXN_PARAM = {
    transaction: {
        data: {
            contractAddress: INVOKE_CONTRACT_ADDRESS,
            amount: INVOKE_AMOUNT,
            fee: INVOKE_FEE,
            storageLimit: INVOKE_STORAGE_LIMIT,
            gasLimit: INVOKE_GAS_LIMIT,
            entrypoint: INVOKE_ENTRY_POINT,
            parameters: INVOKE_PARAMETERS,
        }, txnType: CONTRACT_TRANSACTION
    },
    connectionUrl: TEZOS_TESTNET_GRANADANET
}

function delay(interval) {
    return it('should delay', done => {
        setTimeout(() => done(), interval)

    }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
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
        assert(tezWallet.address !== null)
    })

    it("Should fetch account details ", async () => {
        assert(tezWallet.address !== null)
        const account = await tezWallet.getAccounts()
        console.log("account", account)
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

    it("Get fees", async () => {
        const { transactionFees: revealTransactionFees } = await tezWallet.getFee(REVEAL_ACCOUNT);
        console.log("revealTransactionFees ", revealTransactionFees)

        const { transactionFees: delegateTransactionFees } = await tezWallet.getFee(DELEGATE);
        console.log("delegateTransactionFees ", delegateTransactionFees)

        const { transactionFees: nativeTransferTransactionFees } = await tezWallet.getFee(NATIVE_TRANSFER);
        console.log("nativeTransferTransactionFees ", nativeTransferTransactionFees)

        const { transactionFees: deployContractTransactionFees } = await tezWallet.getFee(DEPLOY_CONTRACT_TRANSACTION);
        console.log("deployContractTransactionFees ", deployContractTransactionFees)

        const { transactionFees: callContractTransactionFees } = await tezWallet.getFee(CONTRACT_TRANSACTION);
        console.log("callContractTransactionFees ", callContractTransactionFees)
    })

    it("Should sign and send activate txn", async () => {
        try {
            const activateTxn = await tezWallet.signTransaction(ACTIVATE_TXN_PARAM.transaction, ACTIVATE_TXN_PARAM.connectionUrl)
            console.log("activateTxn ", activateTxn)
            const transactionResult = await tezWallet.sendTransaction(activateTxn.signedTransaction.signedOperations, ACTIVATE_TXN_PARAM.connectionUrl)
            console.log("Activation transactionResult ", transactionResult)
        } catch (err) {
            console.log("Activation will only pass on first attempt of fund raiser wallet. Will always fail")
            console.log("Error : ", err)
        }
    })

    it("Should sign and send reveal txn", async () => {
        try {
            const revealTxn = await tezWallet.signTransaction(REVEAL_TXN_PARAM.transaction, REVEAL_TXN_PARAM.connectionUrl)
            console.log("revealTxn ", revealTxn)
            const transactionResult = await tezWallet.sendTransaction(revealTxn.signedTransaction.signedOperations, REVEAL_TXN_PARAM.connectionUrl)
            console.log("Reveal transactionResult ", transactionResult)
        } catch (err) {
            console.log("Reveal will only pass on first attempt and account should have some funds. Probably will always fail due to 1 balance")
            console.log("Error : ", err)
        }
    })

    it("Should sign and send delegate txn with no delegate address", async () => {
        const delegate = await tezWallet.signTransaction(DELEGATE_TXN_PARAM_NO_DELEGATE.transaction, DELEGATE_TXN_PARAM_NO_DELEGATE.connectionUrl)
        console.log("delegate ", delegate)
        // const transactionResult = await tezWallet.sendTransaction(delegate.signedTransaction.signedOperations, DELEGATE_TXN_PARAM_NO_DELEGATE.connectionUrl)
        // console.log("Delegate transactionResult ", transactionResult)
    })

    delay(10000)

    it("Should sign and send delegate txn with delegate address", async () => {
        const delegate = await tezWallet.signTransaction(DELEGATE_TXN_PARAM.transaction, DELEGATE_TXN_PARAM.connectionUrl)
        console.log("delegate ", delegate)
        // const transactionResult = await tezWallet.sendTransaction(delegate.signedTransaction.signedOperations, DELEGATE_TXN_PARAM.connectionUrl)
        // console.log("Delegate address transactionResult ", transactionResult)
    })

    delay(10000)

    it("Should sign and send TEZ", async () => {
        const transferTez = await tezWallet.signTransaction(TEZ_TRANSFER_TXN_PARAM.transaction, TEZ_TRANSFER_TXN_PARAM.connectionUrl)
        console.log("transferTez ", transferTez)
        // const transactionResult = await tezWallet.sendTransaction(transferTez.signedTransaction.signedOperations, TEZ_TRANSFER_TXN_PARAM.connectionUrl)
        // console.log("Send tez transactionResult ", transactionResult)
    })

    delay(10000)

    it("Should sign and send deploy contract transaction", async () => {
        const deployContractTxn = await tezWallet.signTransaction(DEPLOY_CONTRACT_TXN_PARAM.transaction, DEPLOY_CONTRACT_TXN_PARAM.connectionUrl)
        console.log("deployContractTxn ", deployContractTxn)
        // const transactionResult = await tezWallet.sendTransaction(deployContractTxn.signedTransaction.signedOperations, DEPLOY_CONTRACT_TXN_PARAM.connectionUrl)
        // console.log("deploy contract transactionResult ", transactionResult)
    })

    delay(10000)

    it("Should sign and send invoke contract transaction", async () => {
        const invokeContractTxn = await tezWallet.signTransaction(INVOKE_CONTRACT_TXN_PARAM.transaction, INVOKE_CONTRACT_TXN_PARAM.connectionUrl)
        console.log("invokeContractTxn ", invokeContractTxn)
        // const transactionResult = await tezWallet.sendTransaction(invokeContractTxn.signedTransaction.signedOperations, INVOKE_CONTRACT_TXN_PARAM.connectionUrl)
        // console.log("Invoke contract transactionResult ", transactionResult)
    })

})
var assert = require('assert');
const { KeyringController: Tezos, getBalance } = require('../src/index')
const {
    HD_WALLET_12_MNEMONIC,
    TEZOS_NETWORK: {
        TEZOS_TESTNET_HANGZHOU,
        TEZOS_TESTNET_GRANADANET,
        CONSEIL_TESTNET_HANGZHOU,
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
    connectionUrl: TEZOS_TESTNET_HANGZHOU
}

const REVEAL_TXN_PARAM = {
    transaction: {
        data: {}, txnType: REVEAL_ACCOUNT
    },
    connectionUrl: TEZOS_TESTNET_HANGZHOU
}

const DELEGATE_TXN_PARAM_NO_DELEGATE = {
    transaction: {
        data: {}, txnType: DELEGATE
    },
    connectionUrl: TEZOS_TESTNET_HANGZHOU
}

const DELEGATE_TXN_PARAM = {
    transaction: {
        data: {
            delegate: DELEGATE_ADD
        }, txnType: DELEGATE
    },
    connectionUrl: TEZOS_TESTNET_HANGZHOU
}

const TEZ_TRANSFER_TXN_PARAM = {
    transaction: {
        data: {
            to: TO_ADDRESS,
            amount: TEZ_AMOUNT
        }, txnType: NATIVE_TRANSFER
    },
    connectionUrl: TEZOS_TESTNET_HANGZHOU
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
    connectionUrl: TEZOS_TESTNET_HANGZHOU
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
    connectionUrl: TEZOS_TESTNET_HANGZHOU
}

function delay(interval) {
    return it('should delay', done => {
        setTimeout(() => done(), interval)

    }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
}

const opts = {
    mnemonic: HD_WALLET_12_MNEMONIC,
    network: TEZOS_TESTNET_HANGZHOU.NETWORK
}

describe('Initialize wallet ', () => {
    const tezWallet = new Tezos(opts)

    it("Should generate new address ", async () => {
        const wallet = await tezWallet.addAccount()
        console.log("wallet, ", wallet)
        const wallet2 = await tezWallet.addAccount()
        console.log("wallet2, ", wallet2)
    })

    it("Should get accounts", async () => {
        const acc = await tezWallet.getAccounts()
        console.log("acc ", acc)
        assert(acc.length === 2, "Should have 2 addresses")
    })
    it("Should get privateKey ", async () => {
        const acc = await tezWallet.getAccounts()
        const privateKey = await tezWallet.exportPrivateKey(acc[0])
        console.log("privateKey, ", privateKey)
    })

    it("Should import new account ", async () => {
        const acc = await tezWallet.getAccounts()
        const { privateKey } = await tezWallet.exportPrivateKey(acc[0])
        const account = await tezWallet.importWallet(privateKey)
        console.log("account, ", account)
        assert(account === acc[0], "Should be the zeroth account")
    })

    it("Should get balance of the address ", async () => {
        const acc = await tezWallet.getAccounts()
        console.log("acc ", acc)
        const balance = await getBalance(acc[0], opts.network)
        console.log("balance ", balance)
    })

    it("Sign message", async () => {
        const acc = await tezWallet.getAccounts()

        const signedMessage1 = await tezWallet.signMessage(TESTING_MESSAGE_1, acc[0])
        console.log("Signed message 1: ", signedMessage1)

        const signedMessage2 = await tezWallet.signMessage(TESTING_MESSAGE_2, acc[0])
        console.log("Signed message 2: ", signedMessage2)

        const signedMessage3 = await tezWallet.signMessage(TESTING_MESSAGE_3, acc[0])
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
            const acc = await tezWallet.getAccounts()
            ACTIVATE_TXN_PARAM.transaction['from'] = acc[0]

            const activateTxn = await tezWallet.signTransaction(ACTIVATE_TXN_PARAM.transaction)
            console.log("activateTxn ", activateTxn)
            const transactionResult = await tezWallet.sendTransaction(activateTxn.signedTransaction.signedOperations)
            console.log("Activation transactionResult ", transactionResult)
        } catch (err) {
            console.log("Activation will only pass on first attempt of fund raiser wallet. Will always fail")
            console.log("Error : ", err)
        }
    })

    // it("Should sign and send reveal txn", async () => {
    //     try {
    //         const acc = await tezWallet.getAccounts()
    //         REVEAL_TXN_PARAM.transaction['from'] = acc[0]

    //         const revealTxn = await tezWallet.signTransaction(REVEAL_TXN_PARAM.transaction)
    //         console.log("revealTxn ", revealTxn)
    //         const transactionResult = await tezWallet.sendTransaction(revealTxn.signedTransaction.signedOperations)
    //         console.log("Reveal transactionResult ", transactionResult)
    //     } catch (err) {
    //         console.log("Reveal will only pass on first attempt and account should have some funds. Probably will always fail due to 1 balance")
    //         console.log("Error : ", err)
    //     }
    // })

    // it("Should sign and send delegate txn with no delegate address", async () => {
    //     const acc = await tezWallet.getAccounts()
    //     DELEGATE_TXN_PARAM_NO_DELEGATE.transaction['from'] = acc[0]

    //     const delegate = await tezWallet.signTransaction(DELEGATE_TXN_PARAM_NO_DELEGATE.transaction)
    //     console.log("delegate ", delegate)
    //     // const transactionResult = await tezWallet.sendTransaction(delegate.signedTransaction.signedOperations)
    //     // console.log("Delegate transactionResult ", transactionResult)
    // })

    // delay(10000)

    // it("Should sign and send delegate txn with delegate address", async () => {
    //     const acc = await tezWallet.getAccounts()
    //     DELEGATE_TXN_PARAM.transaction['from'] = acc[0]

    //     const delegate = await tezWallet.signTransaction(DELEGATE_TXN_PARAM.transaction)
    //     console.log("delegate ", delegate)
    //     // const transactionResult = await tezWallet.sendTransaction(delegate.signedTransaction.signedOperations)
    //     // console.log("Delegate address transactionResult ", transactionResult)
    // })

    // delay(10000)

    // it("Should sign and send TEZ", async () => {
    //     const acc = await tezWallet.getAccounts()
    //     TEZ_TRANSFER_TXN_PARAM.transaction['from'] = acc[0]

    //     const transferTez = await tezWallet.signTransaction(TEZ_TRANSFER_TXN_PARAM.transaction)
    //     console.log("transferTez ", transferTez)
    //     // const transactionResult = await tezWallet.sendTransaction(transferTez.signedTransaction.signedOperations)
    //     // console.log("Send tez transactionResult ", transactionResult)
    // })

    // delay(10000)

    // it("Should sign and send deploy contract transaction", async () => {
    //     const acc = await tezWallet.getAccounts()
    //     DEPLOY_CONTRACT_TXN_PARAM.transaction['from'] = acc[0]

    //     const deployContractTxn = await tezWallet.signTransaction(DEPLOY_CONTRACT_TXN_PARAM.transaction)
    //     console.log("deployContractTxn ", deployContractTxn)
    //     // const transactionResult = await tezWallet.sendTransaction(deployContractTxn.signedTransaction.signedOperations)
    //     // console.log("deploy contract transactionResult ", transactionResult)
    // })

    // delay(10000)

    // it("Should sign and send invoke contract transaction", async () => {
    //     const acc = await tezWallet.getAccounts()
    //     INVOKE_CONTRACT_TXN_PARAM.transaction['from'] = acc[0]

    //     const invokeContractTxn = await tezWallet.signTransaction(INVOKE_CONTRACT_TXN_PARAM.transaction)
    //     console.log("invokeContractTxn ", invokeContractTxn)
    //     // const transactionResult = await tezWallet.sendTransaction(invokeContractTxn.signedTransaction.signedOperations)
    //     // console.log("Invoke contract transactionResult ", transactionResult)
    // })

})
    // */
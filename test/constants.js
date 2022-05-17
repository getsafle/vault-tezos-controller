module.exports = {
    HD_WALLET_12_MNEMONIC: 'session couch almost stadium firm embark lawn panic session planet error swing endless clip grief',
    // 'affair entry detect broom axis crawl found valve bamboo taste broken hundred',
    HD_WALLET_12_MNEMONIC_NEW: "real art call uncle tuition curve soul fiction riot evolve jump fetch jungle fine sunset",

    HD_WALLET_24_MNEMONIC: 'begin pyramid grit rigid mountain stamp legal item result peace wealth supply satoshi elegant roof identify furnace march west chicken pen gorilla spot excuse',

    // TEZOS_NETWORK: {
    //     TEZOS_TESTNET_FLORENCENET: "https://tezos-florence.cryptonomic-infra.tech:443",
    //     TEZOS_TESTNET_GRANADANET: "https://tezos-granada.cryptonomic-infra.tech:443",
    //     CONSEIL_TESTNET_FLORENCENET: "https://conseil-florence.cryptonomic-infra.tech:443",
    //     CONSEIL_TESTNET_GRANADANET: "https://conseil-granada.cryptonomic-infra.tech:443",
    //     TEZOS_MAINNET: "https://tezos-prod.cryptonomic-infra.tech:443",
    //     COONSEIL_MAINNET: "https://conseil-prod.cryptonomic-infra.tech:443"
    // },

    TEZOS_NETWORK: {
        TEZOS_TESTNET_ITHACANET: {
            NETWORK: "TEZOS_TESTNET_ITHACANET",
            URL: "	https://ithacanet.ecadinfra.com"
        },
        TEZOS_TESTNET_HANGZHOU: {
            NETWORK: "TEZOS_TESTNET_HANGZHOU",
            URL: "https://tezos-hangzhou.cryptonomic-infra.tech:443",
        },
        TEZOS_TESTNET_GRANADANET: {
            NETWORK: "TEZOS_TESTNET_GRANADANET",
            URL: "https://tezos-granada.cryptonomic-infra.tech:443",
        },
        CONSEIL_TESTNET_HANGZHOU: {
            NETWORK: "CONSEIL_TESTNET_HANGZHOU",
            URL: "https://conseil-hangzhou.cryptonomic-infra.tech:443"
        },
        CONSEIL_TESTNET_GRANADANET: {
            NETWORK: "CONSEIL_TESTNET_GRANADANET",
            URL: "https://conseil-granada.cryptonomic-infra.tech:443"
        },
        TEZOS_MAINNET: {
            NETWORK: "TEZOS_MAINNET",
            URL: "https://tezos-prod.cryptonomic-infra.tech:443"
        },
        CONSEIL_MAINNET: {
            NETWORK: "CONSEIL_MAINNET",
            URL: "https://conseil-prod.cryptonomic-infra.tech:443"
        }
    },

    TRANSACTION_TYPE: {
        ACTIVATE_ACCOUNT: "ACTIVATE_ACCOUNT",
        REVEAL_ACCOUNT: "REVEAL_ACCOUNT",
        DELEGATE: "DELEGATE",
        NATIVE_TRANSFER: "NATIVE_TRANSFER",
        DEPLOY_CONTRACT_TRANSACTION: "DEPLOY_CONTRACT_TRANSACTION",
        CONTRACT_TRANSACTION: "CONTRACT_TRANSACTION"
    },

    ACTIVATE_TRANSACTION_PARAM: {},
    REVEAL_TRANSACTION_PARAM: {},
    DELEGATE_TRANSACTION_PARAM: {
        DELEGATE_ADD: "tz1VoSM93UoY5gjuvb1bHdwdJZzU4P5eEAs4"
    },
    NATIVE_TEZ_TRANSFER_TRANSACTION_PARAM: {
        TO_ADDRESS: "tz1e8UhukEtmsEWyEjxksShSaYzDahH7j7NP",
        TO_ADDRESS_MY: "tz1MFVnvExbNbyJqutxthyXta78yMtrb1AC9",
        TEZ_AMOUNT: 100000
    },
    DEPLOY_CONTRACT_TRANSACTION_PARAM: {
        DEPLOY_AMOUNT: 0,
        DEPLOY_DELEGATE: undefined,
        DEPLOY_FEE: 100000,
        DEPLOY_STORAGE_LIMIT: 1000,
        DEPLOY_GAS_LIMIT: 100000,
        CONTRACT_CODE: `[
            {
               "prim":"parameter",
               "args":[ { "prim":"string" } ]
            },
            {
               "prim":"storage",
               "args":[ { "prim":"string" } ]
            },
            {
               "prim":"code",
               "args":[
                  [  
                     { "prim":"CAR" },
                     { "prim":"NIL", "args":[ { "prim":"operation" } ] },
                     { "prim":"PAIR" }
                  ]
               ]
            }
         ]`,
        STORAGE: '{"string": "Sample"}',
    },

    INVOKE_CONTRACT_TRANSACTION_PARAM: {
        INVOKE_CONTRACT_ADDRESS: 'KT1RXcEx754BaN4hkorh3DTEkejaf4LPa4Mp',
        INVOKE_AMOUNT: 10000,
        INVOKE_FEE: 100000,
        INVOKE_STORAGE_LIMIT: 1000,
        INVOKE_GAS_LIMIT: 100000,
        INVOKE_ENTRY_POINT: undefined,
        INVOKE_PARAMETERS: '"Cryptonomicon 222"',
    },
    TESTING_MESSAGE_1: "ThisMessageOneIsForTesting",
    TESTING_MESSAGE_2: "This_message_two_is_for_testing",
    TESTING_MESSAGE_3: "This message three is for testing"

}
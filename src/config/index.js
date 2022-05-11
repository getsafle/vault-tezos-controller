const { TezosConstants, TezosParameterFormat } = require('conseiljs')
module.exports = {
    tezos: {
        HD_PATH: `m/44'/1729'/0'/0'`
    },
    tezos_transaction: {
        ACTIVATE_ACCOUNT: "ACTIVATE_ACCOUNT",
        REVEAL_ACCOUNT: "REVEAL_ACCOUNT",
        DELEGATE: "DELEGATE",
        NATIVE_TRANSFER: "NATIVE_TRANSFER",
        DEPLOY_CONTRACT_TRANSACTION: "DEPLOY_CONTRACT_TRANSACTION",
        CONTRACT_TRANSACTION: "CONTRACT_TRANSACTION"
    },
    tezos_key_hint: {
        EDSK: 'edsk'
    },
    tezos_transaction_default_values: {
        DEFAULT_TRANSFER_TXN_FEE: TezosConstants.DefaultSimpleTransactionFee,
        DEFAULT_DELEGATE_TXN_FEE: TezosConstants.DefaultDelegationFee,
        DEFAULT_CONTRACT_TXN_CODE_FORMAT: TezosParameterFormat.Micheline,
        DEFAULT_CONTRACT_TXN_PARAM_FORMAT: TezosParameterFormat.Michelson,
        DEFAULT_TXN_OFFSET: TezosConstants.HeadBranchOffset,
        DEFAULT_TXN_OPTIMIZATION: false,
    },
    tezos_connection: {
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
    }
}
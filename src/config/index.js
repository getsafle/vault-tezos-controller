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
    }
}
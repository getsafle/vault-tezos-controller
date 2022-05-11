const { tezos_connection: { TEZOS_TESTNET_HANGZHOU, TEZOS_TESTNET_GRANADANET, CONSEIL_TESTNET_HANGZHOU, CONSEIL_TESTNET_GRANADANET, TEZOS_MAINNET, CONSEIL_MAINNET } } = require("../../config/index")

function getActiveNetwork(_network) {
    switch (_network) {
        case TEZOS_TESTNET_HANGZHOU.NETWORK:
            return TEZOS_TESTNET_HANGZHOU.URL;
        case TEZOS_TESTNET_GRANADANET.NETWORK:
            return TEZOS_TESTNET_GRANADANET.URL;
        case CONSEIL_TESTNET_HANGZHOU.NETWORK:
            return CONSEIL_TESTNET_HANGZHOU.URL;
        case CONSEIL_TESTNET_GRANADANET.NETWORK:
            return CONSEIL_TESTNET_GRANADANET.URL;
        case CONSEIL_MAINNET.NETWORK:
            return CONSEIL_MAINNET.URL;
        default:
            return TEZOS_MAINNET.URL;
    }

    return _network === TESTNET.NETWORK ? TESTNET.URL : _network === DEVNET.NETWORK ? DEVNET.URL : MAINNET.URL
}

module.exports = getActiveNetwork
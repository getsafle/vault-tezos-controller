var assert = require('assert');
const Tezos = require('../src/index')
const {
    HD_WALLET_12_MNEMONIC
} = require('./constants')

describe('Initialize wallet ', () => {
    const tezWallet = new Tezos(HD_WALLET_12_MNEMONIC)

    it("Should have correct mnemonic", () => {
        assert.equal(tezWallet.mnemonic, HD_WALLET_12_MNEMONIC, "Incorrect hd wallet" )
    })
})
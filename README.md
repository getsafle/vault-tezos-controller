# tezos-wallet-controller

This repository contains `XTZHdKeyring` class to create **Tezos wallet** from **Safle Vault**.

## Usecase

We will be using `XTZHdKeyring` class to initialize the wallet and then utilize the provided functions to perform the required tasks. <br />
The class initialization is done in the following way.

```
const tezWallet = new XTZHdKeyring(`mnemonic`)
```

`mnemonic` is the BIP-39 key phrase to generate the wallet.

Once we initialize the class, we can utilize the provided functions.

The wallet have the following functions:

#### generateWallet()

This function is used to generate the Solana wallet and set the 0th address as the default address. <br />
parameters: - <br />
returns: `{address : wallet_address}`

#### exportPrivateKey()

This function is used to export the private key for the generated address. <br />
**parameters:** - <br />
**returns:** `{privateKey : private_key}`

#### getAccounts()

This function is used to get the wallet address. <br />
**parameters:** - <br />
**returns:** `{address : wallet_address}`

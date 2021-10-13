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
returns: `{address : string} // wallet address`

#### exportPrivateKey()

This function is used to export the private key for the generated address. <br />
**parameters:** - <br />
**returns:** `{privateKey : string} // address private key`

#### signTransaction(transaction: _TransactionObj_ , connectionUrl: _string_ )

This function is used to sign a transaction off-chain and then send it to the network.<br /> Transactions are of 4 types:

1. Activate account (only Fundraiser accounts):<br />
Any Fundraiser wallet needs to be activated before it can accept funds.<br />We will create account from mnemonic so this function is not required.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {},
    txnType: ACTIVATE_ACCOUNT // type constant
}
```

2. Reveal account:<br />
Any tezos wallet needs to be revealed, i.e. published on the network to perform transactions.<br />The account will need to pay fee for the transaction and hence there should be some value in it.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {},
    txnType: REVEAL_ACCOUNT // type constant
}
```

3. TEZ transfer:<br />
   Trasaction to transfer XTZ from one wallet/address to another.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {
        to, // destination address
        amount, // amount in µtz (micro-tez)
    },
    txnType: NATIVE_TRANSFER // type constant
}
```

4. Delegate:<br />
   Transaction to delegate an account for voting process.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {
        delegate, // delegate address (optional)
    },
    txnType: DELEGATE // type constant
}
```

5. Contract Deployment:<br />
   Transaction to deploy a smart contract.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {
        amount, // amount to send to contract (if payable)
        delegate, // delegate contract
        fee, // contract fee
        storageLimit, // storage limit
        gasLimit, // gas limit
        code, // contract michelson code
        storage // storage variables
    },
    txnType: DEPLOY_CONTRACT_TRANSACTION // type constant
}
```

6. Invoke Contract: <br />
   Transaction to call functions of smart contract.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {
        contractAddress, // address of contract to call
        amount, // amount (if payable)
        fee, // transaction fee
        storageLimit, // storage limit
        gasLimit, // gas limit
        entrypoint, // function to call
        parameters, // function params / storage params value
    },
   txnType: CONTRACT_TRANSACTION // type constant
}
```

**parameters:**

```
name: transaction,
type: TransactionObj, // refer to the above 6 trancationObj types.

name: connectionUrl, // Tezos network URL
type: string
```

```
Return Object:
signedTransactionObject: {
  results: {
    contents: [Array],
    signature : string // 'edsigu1yWMor3YgXpFtHm7PEd86mCT8ruavGsB6AYnqUrgb9ZgcfRLBbw5bpq6CsiCUwNWsBTKQf6jpPASSZQTD46Wuk7PKmFyg'
  },
  signedOperations: {
    bytes: Buffer // <Buffer 081b31e64fd4e006fe34d71a69fbb101c4ce6bdc2989c87922662eec27b8566f6c0011ad4e6efaf8690155cdf8b5132b0d60...103morebytes>,
    signature: string //'edsigu1yWMor3YgXpFtHm7PEd86mCT8ruavGsB6AYnqUrgb9ZgcfRLBbw5bpq6CsiCUwNWsBTKQf6jpPASSZQTD46Wuk7PKmFyg'
  }
}
```

**returns:** `{signedTransaction: signedTransactionObject} signed raw transaction`

#### signMessage(message: _string_ )

This function is used to sign a message. <br />
**parameters:**

```
name: message
type: string
```

**returns:** `{signedMessage: string} // signed message hex string`


#### getAccounts()

This function is used to get the wallet address. <br />
**parameters:** - <br />
**returns:** `{address : string}  // wallet address`

#### sendTransaction(rawTransaction: _Buffer_ | _UInt8Array_ , connectionUrl: _string_)

This function is used send the signed transaction onto the chain. <br />
**parameters:**

```
name: rawTransaction, // {signedTransactionObject.signedOperations} signed raw transaction (got from signedTransaction())
type: Buffer | UInt8Array

name: connectionUrl, // SOLANA network URL
type: string
```

**returns:** `{transactionDetails : string} // transaction hash`

#### getFee(txnType: _string_)

This function is used to get the transaction fees. <br />

**parameters:** - <br />

```
name: txnType
type: string
value: DELEGATE | REVEAL_ACCOUNT | NATIVE_TRANSFER | DEPLOY_CONTRACT_TRANSACTION | CONTRACT_TRANSACTION
```

**returns:** `{transactionFees: integer} // transaction fees`
## Keywords

### delegate
Account ID to delegate to

### fee
Fee to be paid for the operation

### storageLimit
Storage fee. Fee to be paid for storing the data.

### gasLimit
Gas limit for transaction

### storage
Initial storage value
### parameters 
Contract arguments

### parameterFormat
Contract argument format
    
### offset
Age of the block to use as branch, set to 0 for head, default is 54 to force operation expiration with 10 blocks.
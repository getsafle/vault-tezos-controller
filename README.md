# vault-tezos-controller

## Install

`npm install --save @getsafle/vault-tezos-controller`

## Initialize the Tezos Controller class

```
const { KeyringController, getBalance } = require('@getsafle/vault-tezos-controller');

const tezosController = new KeyringController({
    // 12 words mnemonic to create wallet
    mnemonic: string,
    // network - type of network [TEZOS_TESTNET_GHOSTNET | TEZOS_TESTNET_HANGZHOU | TEZOS_TESTNET_GRANADANET | CONSEIL_TESTNET_HANGZHOU | CONSEIL_TESTNET_GRANADANET | TEZOS_MAINNET | CONSEIL_MAINNET]
    // default is TEZOS_MAINNET even if no network is passed
    network: string (TEZOS_TESTNET_GHOSTNET | TEZOS_TESTNET_HANGZHOU | TEZOS_TESTNET_GRANADANET | CONSEIL_TESTNET_HANGZHOU | CONSEIL_TESTNET_GRANADANET | TEZOS_MAINNET | CONSEIL_MAINNET)
});
```

## Methods

### Generate Keyring with 1 account or add new account

```
const keyringState = await tezosController.addAccount();
```

### Export the private key of an address present in the keyring

```
const privateKey = await tezosController.exportPrivateKey(address);
```

### Get all accounts in the keyring

```
const privateKey = await tezosController.getAccounts();
```

### Sign a transaction

```
const signedTx = await tezosController.signTransaction(tezosTx: TransactionObj);

```

###### TransactionObj

1. Activate account (only Fundraiser accounts):<br />
   Any Fundraiser wallet needs to be activated before it can accept funds.<br />We will create account from mnemonic so this function is not required.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {},
    txnType: ACTIVATE_ACCOUNT, // type constant
    from //sender address
}
```

2. Reveal account:<br />
   Any tezos wallet needs to be revealed, i.e. published on the network to perform transactions.<br />The account will need to pay fee for the transaction and hence there should be some value in it.<br />The transaction object is of the following type:

```
TransactionObj: {
    data: {},
    txnType: REVEAL_ACCOUNT, // type constant
    from //sender address
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
    txnType: NATIVE_TRANSFER, // type constant
    from //sender address
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
    from //sender address
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
    txnType: DEPLOY_CONTRACT_TRANSACTION, // type constant
    from //sender address
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
   txnType: CONTRACT_TRANSACTION, // type constant
   from //sender address
}
```

**parameters:**

```
name: transaction,
type: TransactionObj, // refer to the above 6 trancationObj types.
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

### Sign a message

```
const signedMsg = await tezosController.signMessage(msgString, address);
```

### Get fees

```
const fees = await tezosController.getFee(address);
```

### Get balance

```
const balance = await getBalance(address, network); // if network !== TESTNET || then it will fetch mainnet balance
```

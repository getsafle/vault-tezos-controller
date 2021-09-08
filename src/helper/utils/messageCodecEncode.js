const { TezosMessageUtils, TezosLanguageUtil } = require('conseiljs')

const operationTypes = new Map([
    [0, 'endorsement'],
    [1, 'seedNonceRevelation'],
    [2, 'doubleEndorsementEvidence'],
    [3, 'doubleBakingEvidence'],
    [4, 'accountActivation'],
    [5, 'proposal'],
    [6, 'ballot'],
    [7, 'reveal'],
    [8, 'transaction'],
    [9, 'origination'],
    [10, 'delegation'],
    [107, 'reveal'],
    [108, 'transaction'],
    [109, 'origination'],
    [110, 'delegation']
]);
const sepyTnoitarepo = [...operationTypes.keys()].reduce((m, k) => {
    const v = operationTypes.get(k) || ''; if (m[v] > k) {
        return m;
    } return Object.assign(Object.assign({}, m), { [v]: k });
}, new Map());


function encodeOperation(message) {
    if (message.hasOwnProperty('pkh') && message.hasOwnProperty('secret')) {
        return encodeActivation(message);
    }
    if (message.hasOwnProperty('kind')) {
        const operation = message;
        if (operation.kind === 'reveal') {
            return encodeReveal(message);
        }
        if (operation.kind === 'transaction') {
            return encodeTransaction(message);
        }
        if (operation.kind === 'origination') {
            return encodeOrigination(message);
        }
        if (operation.kind === 'delegation') {
            return encodeDelegation(message);
        }
    }
    if (message.hasOwnProperty('vote')) {
        return encodeBallot(message);
    }
    throw new Error('Unsupported message type');
}

function encodeActivation(activation) {
    let hex = TezosMessageUtils.writeInt(sepyTnoitarepo['accountActivation']);
    hex += TezosMessageUtils.writeAddress(activation.pkh).slice(4);
    hex += activation.secret;
    return hex;
}

function encodeReveal(reveal) {
    if (reveal.kind !== 'reveal') {
        throw new Error('Incorrect operation type.');
    }
    let hex = TezosMessageUtils.writeInt(sepyTnoitarepo['reveal']);
    hex += TezosMessageUtils.writeAddress(reveal.source).slice(2);
    hex += TezosMessageUtils.writeInt(parseInt(reveal.fee));
    hex += TezosMessageUtils.writeInt(parseInt(reveal.counter));
    hex += TezosMessageUtils.writeInt(parseInt(reveal.gas_limit));
    hex += TezosMessageUtils.writeInt(parseInt(reveal.storage_limit));
    hex += TezosMessageUtils.writePublicKey(reveal.public_key);
    return hex;
}

function encodeTransaction(transaction) {
    if (transaction.kind !== 'transaction') {
        throw new Error('Incorrect operation type');
    }
    let hex = TezosMessageUtils.writeInt(sepyTnoitarepo['transaction']);
    hex += TezosMessageUtils.writeAddress(transaction.source).slice(2);
    hex += TezosMessageUtils.writeInt(parseInt(transaction.fee));
    hex += TezosMessageUtils.writeInt(parseInt(transaction.counter));
    hex += TezosMessageUtils.writeInt(parseInt(transaction.gas_limit));
    hex += TezosMessageUtils.writeInt(parseInt(transaction.storage_limit));
    hex += TezosMessageUtils.writeInt(parseInt(transaction.amount));
    hex += TezosMessageUtils.writeAddress(transaction.destination);
    if (!!transaction.parameters) {
        const composite = transaction.parameters;
        const code = TezosLanguageUtil.normalizeMichelineWhiteSpace(JSON.stringify(composite.value));
        const result = TezosLanguageUtil.translateMichelineToHex(code);
        if ((composite.entrypoint === 'default' || composite.entrypoint === '') && result === '030b') {
            hex += '00';
        }
        else {
            hex += 'ff';
            if (composite.entrypoint === 'default' || composite.entrypoint === '') {
                hex += '00';
            }
            else if (composite.entrypoint === 'root') {
                hex += '01';
            }
            else if (composite.entrypoint === 'do') {
                hex += '02';
            }
            else if (composite.entrypoint === 'set_delegate') {
                hex += '03';
            }
            else if (composite.entrypoint === 'remove_delegate') {
                hex += '04';
            }
            else {
                hex += 'ff'
                    + ('0' + composite.entrypoint.length.toString(16)).slice(-2)
                    + composite.entrypoint.split('').map(c => c.charCodeAt(0).toString(16)).join('');
            }
            hex += ('0000000' + (result.length / 2).toString(16)).slice(-8) + result;
        }
    }
    else {
        hex += '00';
    }
    return hex;
}

function encodeOrigination(origination) {
    if (origination.kind !== 'origination') {
        throw new Error('Incorrect operation type');
    }
    let hex = TezosMessageUtils.writeInt(sepyTnoitarepo['origination']);
    hex += TezosMessageUtils.writeAddress(origination.source).slice(2);
    hex += TezosMessageUtils.writeInt(parseInt(origination.fee));
    hex += TezosMessageUtils.writeInt(parseInt(origination.counter));
    hex += TezosMessageUtils.writeInt(parseInt(origination.gas_limit));
    hex += TezosMessageUtils.writeInt(parseInt(origination.storage_limit));
    hex += TezosMessageUtils.writeInt(parseInt(origination.balance));
    if (origination.delegate !== undefined) {
        hex += TezosMessageUtils.writeBoolean(true);
        hex += TezosMessageUtils.writeAddress(origination.delegate).slice(2);
    }
    else {
        hex += TezosMessageUtils.writeBoolean(false);
    }
    if (!!origination.script) {
        let parts = [];
        parts.push(origination.script['code']);
        parts.push(origination.script['storage']);
        hex += parts
            .map(TezosLanguageUtil.normalizePrimitiveRecordOrder)
            .map(p => TezosLanguageUtil.normalizeMichelineWhiteSpace(JSON.stringify(p)))
            .map(p => TezosLanguageUtil.translateMichelineToHex(p))
            .reduce((m, p) => { return m + ('0000000' + (p.length / 2).toString(16)).slice(-8) + p; }, '');
    }
    return hex;
}

function encodeDelegation(delegation) {
    if (delegation.kind !== 'delegation') {
        throw new Error('Incorrect operation type');
    }
    let hex = TezosMessageUtils.writeInt(sepyTnoitarepo['delegation']);
    hex += TezosMessageUtils.writeAddress(delegation.source).slice(2);
    hex += TezosMessageUtils.writeInt(parseInt(delegation.fee));
    hex += TezosMessageUtils.writeInt(parseInt(delegation.counter));
    hex += TezosMessageUtils.writeInt(parseInt(delegation.gas_limit));
    hex += TezosMessageUtils.writeInt(parseInt(delegation.storage_limit));
    if (delegation.delegate !== undefined && delegation.delegate !== '') {
        hex += TezosMessageUtils.writeBoolean(true);
        hex += TezosMessageUtils.writeAddress(delegation.delegate).slice(2);
    }
    else {
        hex += TezosMessageUtils.writeBoolean(false);
    }
    return hex;
}

function encodeBallot(ballot) {
    let hex = TezosMessageUtils.writeInt(sepyTnoitarepo['ballot']);
    hex += TezosMessageUtils.writeAddress(ballot.source).slice(2);
    hex += ('00000000' + ballot.period.toString(16)).slice(-8);
    hex += TezosMessageUtils.writeBufferWithHint(ballot.proposal).toString('hex').slice(4);
    hex += ('00' + ballot.vote.toString(16)).slice(-2);
    return hex;
}

module.exports = encodeOperation
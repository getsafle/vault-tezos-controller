// const performPostRequest = require('./postRequest')
const { TezosMessageUtils, TezosNodeReader, TezosConstants, TezosNodeWriter } = require('conseiljs')

// const messageCodecEncode = require('./messageCodecEncode') // equivalent to `TezosMessageCodec.encodeOperation`

// function forgeOperations(branch, operations) {
//     let encoded = TezosMessageUtils.writeBranch(branch);
//     operations.forEach(m => encoded += messageCodecEncode(m));
//     return encoded;
// }

// async function preapplyOperation(server, branch, protocol, operations, signedOpGroup, chainid = 'main') {
//     const payload = [{
//         protocol: protocol,
//         branch: branch,
//         contents: operations,
//         signature: signedOpGroup.signature
//     }];

//     const response = await performPostRequest(server, `chains/${chainid}/blocks/head/helpers/preapply/operations`, payload);
//     const text = await response.text();
//     let json;
//     try {
//         json = JSON.parse(text);
//     } catch (err) {
//         throw new Error(`Could not parse JSON from response of chains/${chainid}/blocks/head/helpers/preapply/operation: '${text}' for ${payload}`);
//     }
//     return json;
// }

async function signOperation(server, operations, signer, offset = TezosConstants.HeadBranchOffset) {
    const blockHead = await TezosNodeReader.getBlockAtOffset(server, offset);
    const blockHash = blockHead.hash.slice(0, 51); 

    // const forgedOperationGroup = forgeOperations(blockHash, operations);
    const forgedOperationGroup = TezosNodeWriter.forgeOperations(blockHash, operations);

    const opSignature = await signer.signOperation(Buffer.from(TezosConstants.OperationGroupWatermark + forgedOperationGroup, 'hex'));

    const signedOpGroup = Buffer.concat([Buffer.from(forgedOperationGroup, 'hex'), opSignature]);
    const base58signature = TezosMessageUtils.readSignatureWithHint(opSignature, signer.getSignerCurve());
    const opPair = { bytes: signedOpGroup, signature: base58signature };
    const appliedOp = await TezosNodeWriter.preapplyOperation(server, blockHash, blockHead.protocol, operations, opPair);

    return { results: appliedOp[0], signedOperations: opPair }; 
}

module.exports = signOperation
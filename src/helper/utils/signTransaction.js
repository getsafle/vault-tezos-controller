const { TezosMessageUtils, TezosNodeReader, TezosConstants, TezosNodeWriter } = require('conseiljs')

async function signOperation(server, operations, signer, offset = TezosConstants.HeadBranchOffset) {
    const blockHead = await TezosNodeReader.getBlockAtOffset(server, offset);
    const blockHash = blockHead.hash.slice(0, 51); 

    const forgedOperationGroup = TezosNodeWriter.forgeOperations(blockHash, operations);

    const opSignature = await signer.signOperation(Buffer.from(TezosConstants.OperationGroupWatermark + forgedOperationGroup, 'hex'));

    const signedOpGroup = Buffer.concat([Buffer.from(forgedOperationGroup, 'hex'), opSignature]);
    const base58signature = TezosMessageUtils.readSignatureWithHint(opSignature, signer.getSignerCurve());
    const opPair = { bytes: signedOpGroup, signature: base58signature };
    const appliedOp = await TezosNodeWriter.preapplyOperation(server, blockHash, blockHead.protocol, operations, opPair);

    return { results: appliedOp[0], signedOperations: opPair }; 
}

module.exports = signOperation
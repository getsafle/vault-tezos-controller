const performPostRequest = require('./utils/postRequest')

async function injectOperation(server, signedOpGroup, chainid = 'main') {
    const response = await performPostRequest(server, `injection/operation?chain=${chainid}`, signedOpGroup.bytes.toString('hex'));
    const text = await response.text();

    return text;
}

module.exports = injectOperation
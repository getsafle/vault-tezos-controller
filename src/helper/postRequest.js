const fetch = require('node-fetch');

function performPostRequest(server, command, payload = {}) {
    const url = `${server}/${command}`;
    const payloadStr = JSON.stringify(payload);
    return fetch(url, { method: 'post', body: payloadStr, headers: { 'content-type': 'application/json' } });
}

module.exports = performPostRequest
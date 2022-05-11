const conseiljs = require('conseiljs');
const util = require('util');

const platform = 'tezos';
const network = 'carthagenet';
const entity = 'accounts';

const conseilServer = { url: '', apiKey: '', network };

async function accountBalance(address) {
    let accountQuery = conseiljs.ConseilQueryBuilder.blankQuery();
    accountQuery = conseiljs.ConseilQueryBuilder.addFields(accountQuery, 'manager', 'balance');
    accountQuery = conseiljs.ConseilQueryBuilder.addPredicate(accountQuery, 'manager', conseiljs.ConseilOperator.EQ, [address]);
    accountQuery = conseiljs.ConseilQueryBuilder.addPredicate(accountQuery, 'balance', conseiljs.ConseilOperator.GT, [0]);
    accountQuery = conseiljs.ConseilQueryBuilder.addAggregationFunction(accountQuery, 'balance', conseiljs.ConseilFunction.sum);
    accountQuery = conseiljs.ConseilQueryBuilder.setLimit(accountQuery, 1);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, platform, network, entity, accountQuery);

    console.log(`${util.inspect(result, false, 2, false)}`);
}

module.exports = accountBalance

accountBalance('tz1aQuhhKCvjFZ4XbnvTU5BjaBiz3ceoMNag');
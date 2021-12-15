const cron = require('node-cron');
const express = require('express');

const axios = require('axios');

const { ArbitrageRepository } = require('db-domain/server/repositories');
const { Arbitrage } = require('db-domain/server/domain')
const models  = require('db-domain/server/models');

app = express();

cron.schedule("*/30 * * * * *", async function () {
    await GetArbitrages();
});

app.listen(8556);

const GetArbitrages =  async () => {

    const symbols = ['btc', 'eth', 'dai', 'usdc'];

    let promises = [];
    const executingDate = (new Date()).toGMTString();
    console.log(`Starting getting data... ${executingDate}`);

    for (let index = 0; index < symbols.length; index++) {
        try {
            promises.push(getTickerData(symbols[index]));
        } catch (error) {
            console.log(error);
        }
    }

    const apisRecords = await Promise.all(promises);
    let records = [];

    for (let index = 0; index < apisRecords.length; index++) {
        records = records.concat(apisRecords[index]);
    }

    const arbitrageRepository = new ArbitrageRepository({ models });
    await arbitrageRepository.createBulk(records);

    const finishDate = (new Date()).toGMTString();
    console.log(`finishing process... ${finishDate}`);
}
 
async function getTickerData(ticker){
    console.log(`Getting data... ${ticker}`);
    const response = await axios(`https://criptoya.com/api/${ticker}/ars`);

    if (response.status != 200) {console.log('skipping process... error on api.'); return;};

    console.log(`response data... ${ticker} - ${response.status}`);

    let records = [];

    for(let data in response.data){
        const exchange = response.data[data];

        records.push({
            exchange: data,
            symbol: ticker,
            ask: exchange.ask,
            totalAsk: exchange.totalAsk,
            bid: exchange.bid,
            totalBid: exchange.totalBid,
            time: (new Date(exchange.time * 1000)).toGMTString()
        });
    }

    return records;
}
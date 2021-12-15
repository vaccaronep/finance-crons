const axios = require('axios');

const { ArbitrageRepository } = require('db-domain/server/repositories');
const { Arbitrage } = require('db-domain/server/domain')
const models  = require('db-domain/server/models');

const GetArbitrages =  async () => {

    const symbols = ['btc', 'eth', 'dai', 'usdc'];

    for (let index = 0; index < symbols.length; index++) {
        const symbol = symbols[index];
        try {
            const response = await axios(`https://criptoya.com/api/${symbol}/ars`);

            let records = [];

            for(let data in response.data){
                const exchange = response.data[data];

                records.push({
                    exchange: data,
                    symbol,
                    ask: exchange.ask,
                    totalAsk: exchange.totalAsk,
                    bid: exchange.bid,
                    totalBid: exchange.totalBid,
                    time: (new Date(exchange.time * 1000)).toGMTString()
                });
            }

            const arbitrageRepository = new ArbitrageRepository({ models });

            await arbitrageRepository.createBulk(records);
        } catch (error) {
            console.log(error);
        }
    }
}
 
GetArbitrages();
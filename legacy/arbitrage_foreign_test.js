const axios = require("axios");

const { ArbitrageRepository } = require("db-domain/server/repositories");
const models = require("db-domain/server/models");



const GetForeignArbitrages = async () => {
  console.log(new Date() + "Starting process...");

  const [binance] = await Promise.all([getBinance()]);

  const arbitrageRepository = new ArbitrageRepository({ models });

  await arbitrageRepository.createBulk([...binance]);

  console.log(new Date() + "Finishing process...");
};

async function getBinance() {
  try {
    const response = await axios(
      "https://api.binance.com/api/v3/ticker/bookTicker"
    );

    if (response.status != 200) {
      console.log("skipping process... error on api.");
      return;
    }
    const valid_instruments = ["BTCUSDT", "ETHUSDT", "LTCUSDT"];

    let records = [];

    for (let index = 0; index < response.data.length; index++) {
      const element = response.data[index];
      if (valid_instruments.includes(element.symbol)){
        records.push({
          exchange: "binance",
          symbol: element.symbol,
          ask: element.askPrice,
          totalAsk: element.askPrice,
          bid: element.bidPrice,
          totalBid: element.bidPrice,
          time: new Date().toGMTString(),
          isLocal: false
        });
      }
    }
    
    return records;
  } catch (error) {
    console.log(error);
  }
}

GetForeignArbitrages();
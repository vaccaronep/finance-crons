"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesExecutor = void 0;
class ServicesExecutor {
    constructor(components) {
        this.services = [];
        this.services.push(
        // new Kraken(["BTC/USDT", "XRP/USDT", "ETH/USDT"], components),
        // new Bitfinex([], components),
        // new Poloniex(['USDT_BTC', 'USDT_ETH', 'USDT_XRP'], components),
        );
    }
    execute() {
        this.services.forEach((service) => __awaiter(this, void 0, void 0, function* () {
            yield service.init();
            yield service.open();
            yield service.message();
            yield service.error();
            yield service.close();
            yield service.start();
        }));
    }
}
exports.ServicesExecutor = ServicesExecutor;
//# sourceMappingURL=services-executor.js.map
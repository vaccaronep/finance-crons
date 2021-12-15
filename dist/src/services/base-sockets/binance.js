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
exports.BaseBinance = void 0;
const base_service_1 = require("../base-service");
const wsBinance = require('node-binance-api');
class BaseBinance extends base_service_1.BaseService {
    constructor(pairs, { dbMessagesQueue }) {
        super('', pairs, 'binance');
        this.baseMsg = undefined;
        this.socket = new wsBinance().options({});
        this.dbMessagesQueue = dbMessagesQueue;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    error() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    message() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.BaseBinance = BaseBinance;
//# sourceMappingURL=binance.js.map
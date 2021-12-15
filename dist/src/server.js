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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const bull_board_1 = require("bull-board");
const components_1 = require("./components");
const arbitrage_executor_1 = require("./services/manager/arbitrage-executor");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = 5000;
        const components = yield (0, components_1.initComponents)();
        app.use(body_parser_1.default.json());
        app.use('/admin/queues', bull_board_1.router);
        // initSockets
        const sockets = new arbitrage_executor_1.ArbitrageExecutor(components);
        sockets.execute();
        return new Promise((resolve, reject) => {
            const server = app
                .listen(port, () => {
                components.logger.info(`Application listening in port ${port}`);
                resolve(server);
            })
                .on("error", (e) => {
                reject(e);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=server.js.map
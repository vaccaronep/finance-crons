"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(url, pairs, key) {
        this.url = url;
        this.pairs = pairs;
        this.key = key;
    }
    init() {
        throw new Error("Method not implemented.");
    }
    open() {
        throw new Error("Method not implemented.");
    }
    close() {
        throw new Error("Method not implemented.");
    }
    error() {
        throw new Error("Method not implemented.");
    }
    message() {
        throw new Error("Method not implemented.");
    }
    start() {
        throw new Error("Method not implemented.");
    }
    reconnect() {
        this.open();
        this.message();
        this.close();
        this.start();
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base-service.js.map
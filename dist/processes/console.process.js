"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleProcessor = void 0;
class ConsoleProcessor {
    constructor() { }
    process(job, done) {
        console.log(job.data);
        done(null, 'success');
    }
}
exports.ConsoleProcessor = ConsoleProcessor;
//# sourceMappingURL=console.process.js.map
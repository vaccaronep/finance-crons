"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
(0, server_1.main)().catch((e) => {
    console.error("Exiting process because of unhandled exception", e);
    process.exit(1);
});
//# sourceMappingURL=app.js.map
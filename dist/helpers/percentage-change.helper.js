"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConsiderablePercentageMovement = void 0;
function checkConsiderablePercentageMovement(oldValue, newValue, validPercentage) {
    if (newValue == 0)
        return false;
    let percentageMove = ((oldValue / newValue) - 1) * 100;
    if (percentageMove < 0)
        percentageMove *= -1;
    return percentageMove >= validPercentage;
}
exports.checkConsiderablePercentageMovement = checkConsiderablePercentageMovement;
//# sourceMappingURL=percentage-change.helper.js.map
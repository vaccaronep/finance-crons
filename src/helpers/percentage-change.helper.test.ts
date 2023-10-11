import { checkConsiderablePercentageMovement } from "./percentage-change.helper";

describe("percentage change helper", () => { 
    test("new value is 0 should return false", () => {
        const result = checkConsiderablePercentageMovement(0,0,0);
        expect(result).toBe(false);
    })

    test("should return false if gap between new and old is smaller than allowed pct", () => {
        const oldValue = 4;
        const pctMove = 0.1;
        const newValue = oldValue * (1 - pctMove + 0.01);
        const result = checkConsiderablePercentageMovement(oldValue, newValue, pctMove);
        expect(result).toBe(false);
    })

    test("should return true if gap between new and old is greater than allowed pct", () => {
        const oldValue = 4;
        const pctMove = 0.5;
        const newValue = oldValue * (1 - pctMove);
        const result = checkConsiderablePercentageMovement(oldValue, newValue, pctMove);
        expect(result).toBe(true);
    })
})
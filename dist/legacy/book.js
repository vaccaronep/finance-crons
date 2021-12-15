"use strict";
function a(n) {
    let count = 0;
    for (let i = 0; i < n; i++) {
        count++;
    }
    count += 3;
    return count;
}
function sumRule(n) {
    let count = 0;
    for (let index = 0; index < n; index++) {
        count += index;
    }
    for (let index = 0; index < 5 * n; index++) {
        count += index;
    }
    return count;
}
function productRule(n) {
    var count = 0;
    for (var i = 0; i < n; i++) {
        count += 1;
        for (var i = 0; i < 5 * n; i++) {
            count += 1;
        }
    }
    return count;
}
function polinomicRule(n) {
    var count = 0;
    for (var i = 0; i < n * n; i++) {
        count += 1;
    }
    return count;
}
function scope1() {
    var top = "top";
    bottom = "bottom";
    console.log(bottom);
    var bottom;
}
scope1();
function scope3(print) {
    if (print) {
        let insideIf = '12';
    }
    console.log(insideIf);
}
scope3(true); // prints ''
"5" == 5; // returns true
"5" === 5; // returns false
function isEquivalent(a, b) {
    // arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    // If their property lengths are different, they're different objects
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        // If the values of the property are different, not equal
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    // If everything matched, correct
    return true;
}
Math.floor; // rounds down to nearest integer
Math.round; // rounds to nearest integer
Math.ceil; // rounds up to nearest integer
Math.floor(0.9); // 0
Math.floor(1.1); // 1
Math.round(0.49); // 0
Math.round(0.5); // 1
Math.round(2.9); // 3
Math.ceil(0.1); // 1 Math.ceil(0.9); // 1 Math.ceil(21);
function numberEquals(x, y) {
    return Math.abs(x - y) < Number.EPSILON;
}
numberEquals(0.1 + 0.2, 0.3); // true
//# sourceMappingURL=book.js.map
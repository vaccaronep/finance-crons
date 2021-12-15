//For example, do not do this:
var test = {
prop1: 'test'
}
function printProp1(test){
console.log(test.prop1);
}
printProp1(test); //'test'

//instead, pass the property like this:
var test = {
prop1: 'test'
}
function printProp1(prop1){
console.log(prop1);
}
printProp1(test.prop1); //'test'
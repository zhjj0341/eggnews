let row = {
  a: 1,
  b: 2
}

function test (params) {
  return {
    c: params['a'] + 1,
    d: params['b'] + 2
  }
}

// 例子1
let result = test(row)
conosole.log(result['c'])
conosole.log(result['d'])
// 例子2
conosole.log(test(row)['c'])
conosole.log(test(row)['d'])

console.log(test)
var test

console.log(test1)
let test1
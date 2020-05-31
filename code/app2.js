const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let maybe = Maybe.of([5, 6, 1])
let ex1 = function (functor) {
    return functor.map(fp.map(fp.add(1)))
}

// console.log(ex1(maybe))


//实现一个函数ex2，能够使用fp.first获取列表的第一个元素
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = function (functor) {
    return functor.map(fp.first)._value
}



//实现一个函数ex3，使用safeProph和fp.first找到user的名字的首字母

let safeProp = fp.curry(function (x, o) { return Maybe.of(o[x]) })
let user = { id: 2, name: 'Albert' }
let ex3 = function (user) {
    return safeProp("name", user).map(fp.first)._value
}

console.log(ex3(user))

//使用Maybe重写ex4，不要有if语句

let ex4 = function (n) {
    if (n) {
        return parseInt(n)
    }
}

ex4 = function (n) {
    return Maybe.of(n).map(parseInt)._value
}


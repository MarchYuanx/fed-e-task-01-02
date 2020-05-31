const fp = require('lodash/fp')

// 数据
// horsepower 马力，dollar_value 价格，in_stock 库存
const cars = [
    {
        name: 'Ferrari FF',
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: 'Spyker C12 Zagato',
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: 'Jaguar XXR-S',
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false
    },
    {
        name: 'Audi R8',
        horsepower: 525,
        dollar_value: 114200,
        in_stock: false
    },
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true
    },
    {
        name: 'Pagani Huayra',
        horsepower: 700,
        dollar_value: 1300000,
        in_stock: false
    }
]

// 使用函数组合 fp.flowRight() 重载实现下面这个函数

let isLastInStock = function (cars) {
    // 获取最后一条数据
    let last_car = fp.last(cars)
    // 获取最后一条数据的in_stock属性值
    return fp.prop('in_stock', last_car)
}

let isLastInStock2 = function (cars) {
    const fn = fp.flowRight(fp.prop('in_stock'), fp.last)
    return fn(cars)
}

let firstName = function (cars) {
    const fn = fp.flowRight(fp.prop('name'), fp.first)
    return fn(cars)
}


let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
// <-无须改动

let averageDollarValue = function (cars) {
    let dollar_values = fp.map(function (car) {
        return car.dollar_value
    }, cars)
    return _average(dollar_values)
}



let averageDollarValue2 = function (cars) {
    const fn = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))
    return fn(cars)
}


let _underscore = fp.replace(/\W+/g, '_')


let sanitizeName = fp.flowRight(_underscore, fp.toLower)


console.log(sanitizeNames(cars))

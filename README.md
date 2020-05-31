# 简答题

## 1. 描述引用计数的工作原理和优缺点 

- 原理：
通过引用计数器设置引用数，当引用关系改变时修改引用数，判断当前引用数是否为0，为0时立即回收
- 优点：发现垃圾时立即进行回收、最大限度减少程序暂停
- 缺点：无法回收循环引用的对象、时间开销相对较大

## 2. 描述标记整理算法的工作流程

标记整理算法可以看作是标记清除的增强，在清除阶段之前会先执行整理

标记 > 整理 > 清除
- 标记：遍历所有对象标记活动（可达）对象
- 整理：移动内存中对象位置，让内存空间具有连续性
- 回收：遍历所有对象，清除没有标记的对象、回收相应的空间

## 3. 描述 V8 中新生代存储区垃圾回收的流程
- 新生代内存分为两个等大的空间，使用空间From，空闲空间To
- 将活动对象储存在From空间
- 在标记整理之后将活动活动对象拷贝到To空间
- 拷贝过程中，在一轮GC中未清除的对象会晋升，To 空间使用率超过25%也会晋升
- From与To交换空间完成释放


## 4. 描述增量标记算法在何时使用及工作原理
- 使用时间：当新生代的对象出现晋升而老生代出现空间不足时，使用增量标记进行效率提升。

- 工作原理：为了降低老生代的垃圾回收而造成的卡顿，把标记过程拆分成多个阶段，与程序执行交替进行（因为垃圾回收与程序执行无法并行），直到标记阶段完成。

# 代码题1

基于以下代码完成下面四个练习

```
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
```

## 练习1
使用函数组合 fp.flowRight() 重载实现下面这个函数
```
let isLastInStock = function (cars) {
  // 获取最后一条数据
  let last_car = fp.last(cars)
  // 获取最后一条数据的in_stock属性值
  return fp.prop('in_stock', last_car)
}
```
实现如下
```
let isLastInStock = function(cars){
    const fn = fp.flowRight(fp.prop('in_stock'), fp.last)
    return fn(cars)
}
```

## 练习2
使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

实现如下
```
let firstName = function(cars){
    const fn = fp.flowRight(fp.prop('name'), fp.first)
    return fn(cars)
}
```

## 练习3
使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现

```
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
```

实现如下
```
let averageDollarValue2 = function (cars) {
  const fn = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))
  return fn(cars)
}
```

## 练习4
使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式，例如：sanitizeNames(['Hello World'])=>['hello_world']

```
let _underscore = fp.replace(/\W+/g, '_')
// <- 无须改动，并在sanitizeNames中使用它
```

实现如下
```
let sanitizeNames = fp.flowRight(_underscore,fp.toLower)
```

# 代码题2
基于下面提供的代码，完成后续的四个练习
```
// support.js
class Container {
  static of(value) {
    return new Container(value)
  }
  constructor(value) {
    this._value = value
  }
  map(fn) {
    return Container.of(fn(this._value))
  }
}

class Maybe {
  static of(x) {
    return new Maybe(x)
  }
  isNothing() {
    return this._value === null || this._value === undefined
  }
  constructor(x) {
    this._value = x
  }
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value))
  }
}

module.exports = {
  Maybe,
  Container
}
```

## 练习1
使用fp.add(x,y)和fp.map(f,x)创建一个能让functor里的值（数组元素中的数值+1）增加的函数ex1
```
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let maybe = Maybe.of([5, 6, 1])
let ex1 = // ...你需要实现的位置
```
实现如下
```
let ex1 = function(){
    return functor.map(functor.map(fp.add(1)))
}
```

## 练习2
实现一个函数ex2，能够使用fp.first获取列表的第一个元素
```
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = // ...你需要实现的位置
```
实现如下
```
let ex2 = function(functor){
    return functor.map(fp.first)._value
}
```

## 练习3
实现一个函数ex3，使用safeProph和fp.first找到user的名字的首字母
```
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let safeProp = fp.curry(function (x, o) { return Maybe.of(o[x]) })
let user = { id: 2, name: 'Albert' }
let ex3 = // ...你需要实现的位置
```
实现如下
```
let ex3 = function (user) {
  return safeProp("name", user).map(fp.first)._value
}
```
## 练习4
使用Maybe重写ex4，不要有if语句
```
const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let ex4 = function (n) {
  if (n) {
    return parseInt(n)
  }
}
```

实现如下
```
let ex4 = function(n){
    return Maybe.of(n).map(parseInt)._value
}
```
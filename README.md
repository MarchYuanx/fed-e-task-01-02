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

## 基于以下代码完成下面四个练习

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

### 练习1
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

### 练习2
使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

实现如下
```
let firstName = function(cars){
    const fn = fp.flowRight(fp.prop('name'), fp.first)
    return fn(cars)
}
```

### 练习3
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

### 练习4
使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式，例如：sanitizeNames(['Hello World'])=>['hello_world']

```
let _underscore = fp.replace(/\W+/g, '_')
// <- 无须改动，并在sanitizeNames中使用它
```

实现如下
```
let sanitizeNames = fp.flowRight(_underscore,fp.toLower)
```
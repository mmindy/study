# ES6 관련 기록

> 고무곰님 강의 ++ 외부 자료

# Block Scope

## 문 vs. 식 vs. 값
- 모든 데이터는 값, 식, 문 중 하나
- 값, 식은 동일
- 문은 해당 내용을 실행하고 끝

**문**  
- if문, for문, while문, switch-case문
- '문단'의 약자. 결과 리턴 X
- 문 자체가 하나의 block-scope가 됨

**식**
- expression
- 값이 될 수 있는 경우(값을 반환하는 무언가)

```js
(10 + 20);
"abc" + "def";
a();
```

**값**


## Hoisting

```js
if (true) {
  let a = 10;
  if (true) {
    console.log(a); // (1) reference error : a is not definded
    const a = 20;
    console.log(a); // 20
  }

  console.log(a);
}

console.log(a);
```
- (1)에서 reference error로, `a`가 선언되지 않았다고 뜨는 것은 호이스팅과 TDZ의 문제
- 호이스팅이 되지 않았다면 상위 스코프의 `a`를 찾아 10을 출력하였을 텐데, 에러 출력됨

> **TDZ(Temporal Dead Zone, 임시사각지대)**
> - ECMAScript에서 정의한 개념은 아니지만, JS 개발 사이에서 통용됨


## this
```js
var value = 0;
var obj = {
  value: 1,
  setValue : function() {
    this.value = 2; // this === obj
    (function() {
      this.value = 3; // this === window --> 얘는 메서드가 아니기 때문!
    })()
  }
}

obj.setValue();
console.log(value); // 3
console.log(obj.value); // 2
```
**ES5**
- 메서드로 호출한 함수의 `this`는 해당 객체! 
  ```js
  obj.setValue(); // this === obj
  ```
- 그러나 메서드 내 즉시실행 함수 내  `this`는 함수로 실행이 되었기 때문에, `window`!
- 이를 고치기 위해 사용한 방법들
  ```js
  // (1)
  ...
  setValue : function() {
    this.value = 2; 
    var self = this;
    (function() {
      self.value = 3;
    })()
  }
  ...
  
  // (2)
  ...
  setValue : function() {
    this.value = 2; 
    (function() {
      this.value = 3;
    }).call(this)
  }
  ...
  ```

이게 **ES6**에서는!?
```js
...
setValue : function() {
  let a = 20;
  this.value = 2; 
  {
    let a = 10;
    this.value = 3;
  }
}
...
```
- `this` 바인딩을 하지 않아서 밖의 setValue의 this를 사용함!


## immutable object 변경 불가능한 객체
```
mutable 변경 가능한
immutable 변경 불가능한 
```
**해결방안**
1. `Object.freeze()`
2. `Object.defindeProperty()`


### 얕은 복사와 깊은 복사
- 얕은 복사 : 객체의 프로퍼티들을 복사(depth 1까지)
- 깊은 복사 : 객체의 프로퍼티들을 복사(모든 depth)  
  1. 프로퍼티를 복사한다
  2. 프로퍼티 중에 참조형이 있으면 1번 반복

```js
var a = {
  a: 1,
  b: [1,2,3],
  c: { d:1, e:2 }
};

var b = Object.assign({}, a);
b.b = Object.assign([]. a.b);
...
```


# Block Scoped Variables

## `const`를 쓰세요

- 프론트 개발에 주로 객체가 쓰이기 때문에, `const`를 많이 쓰게 됨
- `let`의 경우 '값 자체의 변경이 필요한 예외적인 경우에 쓰이는데,   
  이 경우, 클린 코드를 짤 수 있을 가능성이 있음!

## 전역 변수

**전역 변수를 쓰지 말아라!**
```js
var a = 10;

delete a; // false
delete window.a; // false

window.b = 20;

delete window.b; // true
delete b; // true
```
- 전역공간에서 `var`로 선언한 변수는 **전역 변수임과 동시에 전역 객체의 프로퍼티가 됨**
- 그렇기 때문에 `delete`로 지우려면 양쪽에 걸쳐 있기 때문에, 지울 수 없다고 하는 것!  

**ES6**
```js
let c = 30;

window.c; // undefined
c; // 30

delete c; // false

window.b = 20;
delete b; // true
```
- 전역 객체와 공간을 분리시킴

# Template Literal
- 문자열

```js
var a = 'abc'
var b = "abc"
var c = `abc`
```
```js
const string = `a b c
d e f
g h i`;

const a = 10;
const b = 20;
const before = a + " + " + b + " = " + (a+b);
const after = `${a} + ${b} = ${a+b}`
```
- 줄바꿈 인식
- string interpolation : 글자사이에 변수 삽입 가능  
  - `${ }` 안에는 `toString()`처리 됨   
  - 값 혹은 식 올 수 있음

### template language / template engine / template library
- handlebars
- mustanche
- php
- jsp
- asp

html 안에서 변수들 활용하여 제작 가능. 위의 template literal로 구현가능   
(단 reduce 사용하야하고, 좀더 복잡하다는 단점)


## forEach / map / reduce

### 1. forEach

```
Array.prototype.forEach(callback[, thisArg])
 : callback(currentValue[, index[, originArr]])
 : thisArg - this 할당할 대상, 안하면 window
```
- for 문 돌리는 것과 같은 개념

### 2. map
```
Array.prototype.map(callback[, thisArg])
 : callback(currentValue[, index[, originArr]])
```
-for 문을 돌려서 새로운 배열 만듦

### 3. reduce (es5에서 등장)
```
Array.prototype.reduce(callback[, initialValue])
 : callback(accumulator, currentValue[, currentIndex[, originalArray]])
   - (누적계산값, 현재값[, 현재 인덱스[, 원본배열]])
 : initialValue - 초기값, 생략시 인자 자동 지정   
```
- for 문을 돌려서 최종적으로 다른 무언가를 만드는 목적

> 

## tag function
```js
const tag = function(strs, arg1, arg2) {
  return {strs:strs, args:[arg1,arg2]};
}

const res = tag `순서가 ${1}이렇게 ${2}`; 
console.log(res); 
// {strs:Array(3), args:Array(2)}
// {strs:["순서가 ", "이렇게 ", ""], args:[1,2]}
```

## `String.raw`
- raw : 날것의
- 이스케이프된 문자를 원본 그대로 보여주는 프로퍼티

```js
// * 일반 문자열 출력 시, 이스케이프 하여 출력
`순서가 ${1}이렇게 ${2}\n\n`; 
/*
순서가 1이렇게 2


*/

// * String.raw로 출력 시, 원본 문자열 출력
String.raw `순서가 ${1}이렇게 ${2}\n\n`; 
// 순서가 1이렇게 2\n\n
```

## Default Parameter 매개변수 기본값
```js
const f = function(x,y,z) {
  x = x ? x : 4;
  y = y || 5;
  if (!z) z = 6;
}
```
- 이와 같은 경우 falsy한 데이터는 모두 걸러짐. `null, 0`등을 걸러내려면, 아래처럼 했어야 했다

```js
const f = function(x,y,z) {
  x = x !== undefined ? x : 4;
  y = typeof y !== "undefined" || 5;
  if (!z) z = 6;
}
```

- 이를 위해 ES6에서는,
```js
const f = (x = 4,y = 5,z = 6) => {
  //
}
```
해당 매개변수들은 `let`으로 선언한 것과 같은 효과

- Arguments에는 영향을 주지 않음
```js
const f = (x = 4,y = 5,z = 6) => {
  console.log(arguments);
  console.log(x,y,z);
}

f();
// 나오지 않음
// 4,5,6
```

# Rest Parameter

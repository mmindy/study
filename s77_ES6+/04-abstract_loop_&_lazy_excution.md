# Abstract Loop & Lazy Excution
- iterator와 generator 기반, loop추상화 & 지연실행하는 법
- 지연실행은 함수의 특권. 함수 호출 지연 실행 but generator 통해 지연실행 할 수 있음
- coroutine 지원하는 언어에서는 제어문으로 지연실행 가능

## Abstract Loop 루프 추상화
- iterator 통해 루프 추상화. 기존 제어문보다 iterator가 갖는 제어권 많아 추상화 
- 제어문 관련 제어권이 제어문에서 iterator로 넘어감

### Complex Recursion 
- 단순한 배열을 루프인 경우는 간단히 이터레이션을 작성할 수 있다
```js
{
  [Symbol.iterator] () { return this; },
  data : [1,2,3,4],
  next() {
    return {
      done : this.data.length === 0,
      value : this.data.shift()
    }
  }
}
```

- 복잡한 다층형 그래프는 어떻게 이터레이션할 것인가?
```js
{
  [Symbol.iterator]() {return this;},
  data : [{a:[1,2,3,4], b:"-"}, [5,6,7], 8, 9],
  next() {
    return ???
  }
} 
```
- 루프 도는 대상의 길이가 동적으으로 변하는 경우
- 루프의 복잡성이 높아지거나(복잡 or 재귀적 요소) 제어권 넘어설 경우

```js
{
  [Symbol.iterator]() {return this;},
  data : [{a:[1,2,3,4], b:"-"}, [5,6,7], 8, 9],
  next() {
    let v;
    while(v = this.data.shift()) {
      switch(true) {
        case Array.isArray(v) :
          this.data.unshift(...v);
          break;
        case v && typeof v == 'object' : // null 배제
          for ( var k in v ) if ( v.hasOwnProperty(k)) this.data.unshift(v[k]);
          break;
        default :
          return { value: v, done: false };
      }
    }
    return { done: true };
  }
} 
```

```js
// ES6 
{
  [Symbol.iterator]() {return this;},
  data : [{a:[1,2,3,4], b:"-"}, [5,6,7], 8, 9],
  next() {
    let v;
    while(v = this.data.shift()){
      if (!(v instanceof Object)) return { value:v }; // number ,string, boolean, NaN, undefined / null은 Object
      if (!Array.isArray(v)) v = Object.values(v); // Object에서 value만 모아 배열로 생성 
      // 위에서 if로 추상 조건들을 먼저 풀어줌
      this.data.unshift(...v);
    }
    return { done: true };
  }
}
```

```js
// 좀더 mandatory하게
{
  [Symbol.iterator]() {return this;},
  data : [{a:[1,2,3,4], b:"-"}, [5,6,7], 8, 9],
  next() {
    let v;
    while(v = this.data.shift()){
      if (!(v instanceof Object)) return { value:v };
      else {
        if (!Array.isArray(v)) v = Object.values(v);
        this.data.unshift(...v);
      }
    }
    return { done: true };
  }
}
```

```js
const Compx = class{
  constructor(data) { this.data = data; }
  [Symbol.iterator] {
    const data = JSON.parse(JSON.stringify(this.data));
    return {
      next() {
        let v;
        while (v = data.shift()) {
          if (!(v instanceof Object)) return {value:v};
          if (!Array.isArray(v)) v = Object.values(v);
          data.unshift(...v);
        }
        return {done:true};
      }
    }
  }
}

const a = new Compx([{a:[1,2,3,4], b: "-"}, [5,6,7], 8,9]);
console.log([...a]);
console.log([...a]);
```

```js
// generator 사용하여 코드 줄이기
const Compx = class{
  constructor(data) { this.data = data; }
  *gene {
    const data = JSON.parse(JSON.stringify(this.data));
    let v;
    while (v = data.shift()) {
      if (!(v instanceof Object)) yeild v;
      else {
        if (!Array.isArray(v)) v = Object.values(v);
        data.unshift(...v);
      }
    }
  }
};

const a = new Compx([{a:[1,2,3,4], b: "-"}, [5,6,7], 8,9]);
console.log([...a.gene()]);
console.log([...a.gene()]);
```

### Abstract Loop 추상 루프
- 목적이 있는 루프의 경우, 목적을 바꾸면 루프를 다시 짜야 함
- 다양한 구조의 루프와 무관하게 해당 값이나 상황의 개입만 하고 싶은 경우에 추상 루프 사용!
```js
(data, f) => {
  let v;
  while ( v = data.shift() ){
    if (!(v instatnceof Object)) f(v);
    esle {
      if (!Array.isArray(v)) v = Object.values(v);
      data.unshift(...v)
    }
  }
}
```
- 여기서 문제는 `f(v);`! `f(v)` 호출 전 콘솔 찍고 싶다면, 같은 구조 복붙(중복 정의)해야 함!  
  왜냐면 제어**문**이기 때문! 
- 어떻게 구조만 남길 수 있을까?! 라는 고민 시작 -- **제어문의 재활용**
- 결국 제어문을 직접 사용할 수 없고 구조 객체를 이용해 루프 실행기를 별도로 구현!  
  위의 예제에서 `while() { }`은 루프 공통골격, 구조 객체란, 
  ```js
  if (!(v instatnceof Object)) {
    ////
  } esle {
    if (!Array.isArray(v)) v = Object.values(v);
    data.unshift(...v)
  }
  ```
- **if를 제거할 수 있을까?**   
  : 없다. if는 필요에 의해 태어난 것이기 때문에!   
  : if로 나누어지는 경우의 수만큼 값을 미리 만들어 놓고 바깥에서 선택해서 들어오게 함!

**팩토리 + 컴포지트**
- 선택기는 팩토리 메소드, 선택기에 해당하는 객체는 컴포지트 패턴으로 분리
- if 내 문을 값으로 바꿈 - 라우터 로직 ??????????
```js
const Operator = class{
  static factory(v){
    if (v instanceof Object) {
      if (!Array.isArray(v)) v = Object.values(v);
      return new ArrayOp(v.map(v=> Operator.factory(v)));
    } else return new PrimaOp(v);
  }
  constructor(v) { this.v = v; }
  operation(f) { throw 'override'; }
};

const PrimaOp = class extends Operator{
  constructor(v) { super(v); }
  operation(f) { f(this.v); }
};

const ArrayOp = class extends Operator{
  constructor(v) { super(v); }
  operation(f) { for(const v of this.v) v.operation(f); }
};

Operator.factory([1,2,3,{a:4, b:5},6,7]).operation(console.log)
```

## Lazy Execution
- 자바스크립트 최적화는 미비하지만, 돔 관련 스크립트 최적화의 경우는 효과가 있다
- 브라우저에서 프로파일 찍으면 97%가 랜더링 문제
- 따라서 일반적인 최적화는 랜더링이며, 자바스크립트 알고리즘의 경우 클래스 라이브러리 표준이 있을 경우 그것 사용하면 됨! 

### 방법1. YEILD
```js
const odd = function*(data) {
  for (const v of data) {
    console.log("odd", odd.cnt++);
    if ( v%2 ) yield v;
  }
};

odd.cnt = 0;
for (const v of odd(1,2,3,4)) console.log(v);
```

```js
const task = function*(data,n) {
  for (const v of data) {
    console.log("take", take.cnt++);
    if (n--) yield v; else break;
  }
}
take.cnt = 0;
for (const v of take([1,2,3,4], 2)) console.log(v);
```


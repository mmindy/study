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
          for ( var k in v) this.data.unshift(v[k]);
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
      if (!( v instanceof Object)) return { value:v }; // number ,string, boolean, NaN, undefined / null은 Object
      if (!Array.isArray(v)) v = Object.values(v); // Object에서 value만 모아 배열로 생성 
      // 위에서 if로 추상 조건들을 먼저 풀어줌
      this.data.unshift(...v);
    }
    return { done: true };
  }
}
```
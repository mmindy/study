
### 개념을 제대로 알아보는 ES6+ Flow 중급
- 링 크 : [inflearn](https://www.inflearn.com/course/es6-2/)
- 강의자 : 정재남 님
- - - 


#Symbol

> **자료형 : 기본형 vs. 참조형**
> Premitive Value
> - number
> - string
> - boolean
> - null
> - undefinded
> - **Symbol**
> 
> Reference Value
> - object
> - array
> - function
> - Map
> - Set
> - WeakMap
> - WeakSet

- 암묵적 형변환 불가
  ```js
  a + 1; // "a1"
  true + 1; // 2
  Symbol() + 1; // Uncaught TypeError
  ```

### Symbol에 접근할 수 있는 방법
```js
const x = _ => {
  const a = Symbol("a");
  return {
    [a] : 10
  }
}
const y = x(); 

y.a; // undefined
y.Symbol(a); // undefined
y["a"]; // undefined
y[Symbol("a")]; // undefined
```
이 상태에서 `10`이라는 값에 접근할 수 있는 방법 없음

1. 객체 내 Symbol이 할당된 변수를 끌어낸다
  ```js
  const x = _ => {
    const a = Symbol("a");
    return {
      [a] : 10,
      a : a
    }
  }
  const y = x();
  y[y.a]; // 10

  // 은닉화에 성공한 경우! 
  // a를 내가 노출해야만 값에 접근이 가능하다
  ```

2. `Reflect.ownKeys()` : 객체가 갖고 있는 모든 프로퍼티를 출력
  ```js
  const b = Reflect.ownKeys(y);
  y[b[0]]; // 10 -- 실무환경에서 해당 프로퍼티의 순번 알 수 없음
  ```

### Symbol의 사용
```js
const obj = {
  [Symbol("a")] : 1
}
```
- 1이라는 값을 알아낼 수 있는 방법 없음!

```js
const NAME = Symbol("name");

const obj1 = {
  [NAME] : "minji",
  age : 123
}

obj1[NAME]; // "minji"
```

굳이 접근하는 방법 : 옳지 않아!!
```js
Object.getOwnPropertiySymbols(obj1).forEach( k => {
  console.log(k, obj1[k]);
})

// Symbol("name") "minji"
```
```js
Reflect.ownKeys(obj1).forEach( k => {
  console.log(k, obj1[k]);
})

// age 123
// Symbol("name") "minji
```

## Private Member 만들기
- Symbol을 통해 타 언어의 private 변수를 따라 만들 수 있음!
- private member의 최대 목적은 실수 방지. 변수에 접근하여 값 변경 금지 위함!
- 객체지향 프로그래밍에서 private / public 구분하여 사용



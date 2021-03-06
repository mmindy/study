# Iteration & Generation

: js에서 loop를 구현하는 것들  

들어가기에 앞서, **Interface in JS**를 이해해 보자

## Interface
1. Interface란 사양에 맞는 값과 연결된 속성키의 세트
2. 어떤 Object라도 Interface의 정의를 충족시킬 수 있다
3. 하나의 Object는 여러개의 인터페이스를 충족시킬 수 있다

### Interface test
1. test라는 키를 갖고
2. 값으로 문자열 인자를 1개 받아 불린 결과를 반환하는 함수가 온다 
    ```js
    {
      test(str){ return true; }
    }
    ```

## Iterator Interface
아래 사항을 만족시키면 Iterator Interface에 해당, iterator 객체  
1. next라는 키를 갖고
2. 값으로 인자 받지 않고 `IteratorResultObject`를 반환하는 함수가 온다 -- `IteratorResultObject`도 interface로 정의가 필요함
3. `IteratorResultObject`는 `value`와 `done`를 갖고 있다
4. 이중 `done`은 계속 반복 할 수 있을지에 따라 불린값 반환한다
```js
{
  next() {
    return { value:1, done:false }
  }
}
```

```js
{
  data : [1,2,3,4],
  next() {
    return {
      done : this.data.length == 0,
      value : this.data.pop()
    }
  }
}
```

## Iterable Interface
: Iterator 반환

1. `Symbol.iterator`라는 키를 갖고
2. 값으로 인자를 받지 않고, `iterator Object`를 반환하는 함수가 온다
```js
{
  [Symbol.iterator]() {
    return {
      next() {
        return { value:1, done: false}
      }
    }
  }
}
```
- iterator만 있으면, `pop`으로 없애기 때문에 한번만 돌면 끝
- 그러기에 data 를 사본으로 루프돌린다면, data만 reset하여 계속해서 iterator 쓸 수 있음
- 그 reset포인트를 만들어 주는 게 iterable interface
- 루프 돌때 마다 루프를 위한 변수와 원본데이터 보관 

## Loop to iterator 
- 왜 이터레이터를 쓰는거지? `for`나 `while` 등 제어문을 쓰면 안 되나?
- 문은 한번 실행하고 나면 재사용 X / 루프를 객체화 시키는 것이 이터레이터

### While문으로 살펴보는 iterator
- 현대 언어의 이슈는 기존 문으로 사용했던 것을 값(객체,함수 등)으로 변환. 재사용하게 만드는 것

```js
let arr = [1,2,3,4];
while(arr.length > 0) {
  console.log(arr.pop());
}
```
**반복문 === iterator interface** 구조 분석
```
// 반복문
while( (1) [계속 반복할지 판단]) {
  (2) [반복 시마다 처리할 것]
}
```
```
// iterator interface
{  
  arr : [1,2,3,4],  
  next() {  
    return {  
      (1) done: tihs.arr.length === 0,
      (2) value: console.log(this.arr.pop())
    }  
  }  
}  
```
1. 반복자체를 하지는 않지만
2. 외부에서 반복을 하려고할 때
3. 반복에 필요한 조건과 실행을 
4. 미리 준비해 둔 객체   
▽ ▽ ▽  
- 반복 행위와 반복을 위한 준비를 분리  
▽ ▽ ▽  
1. 미리 반복에 대한 준비를 해두고
2. 필요할 때 필요한 만큼 반복
3. 반복을 재현할 수 있음

## ES6+ Loop
**사용자 반복 처리기** : 직접 iterator 반복처리기 구현  

 - 자바스크립트 표준 iterator pattern

```js
const loop = (iter, f) => {
  // iterable이라면 iterator얻음
  if ( typeof iter[Symbol.iterator] == "function") {
    iter = iter[Symbol.iterator]();
  } else return;

  // iteratorObject가 아니라면 건너뜀
  if ( typeof iter.next != "function") return;

  do {
    const v = iter.next();
    if (v.done) return; // 종료처리 -- 조건은 내가 결정한다
    f(v.value); // 현재 값 전달
  } while(true); // 여기서 do...while 구문은 단순 반복처리기 역할
};

const iter = {
  arr : [1,2,3,4],
  [Symbol.iterator]() { return this; },
  next() {
    return {
      done : this.arr.length === 0,
      value : this.arr.pop()
    };
  }
};

loop(iter, console.log); 
// 4
// 3
// 2
// 1
```

### 내장 반복 처리기
- 해체구문은 일반적으로 할당쪽(변수선언)에 쓰임

#### Array destructuring 배열 해체
```js
const iter = {
  [Symbol.iterator]() { return this; },
  arr : [1,2,3,4],
  next() {
    return {  
      done : this.arr.length === 0,
      value : this.arr.pop()
    };
  }
};

const [a, ...b] = iter;
a; // 4
b; // [3,2,1]
```

#### Spread 펼치기
```js
const iter = {
    [Symbol.iterator]() {return this;},
	arr : [1,2,3,4],
	next() {
    return {
      done : this.arr.length === 0,
      value : this.arr.pop()
    };
  }
};
const a = [...iter]
a; // [4, 3, 2, 1]
```

#### Rest Parameter 나머지 인자
```js
const iter = {
    [Symbol.iterator]() {return this;},
	arr : [1,2,3,4],
	next() {
    return {
      done : this.arr.length === 0,
      value : this.arr.pop()
    };
  }
};
const test = (...arg) => console.log(arg);
test(...iter);
```

#### For of
```js
const iter = {
    [Symbol.iterator]() {return this;},
	arr : [1,2,3,4],
	next() {
    return {
      done : this.arr.length === 0,
      value : this.arr.pop()
    };
  }
};

for (const v of iter) {
  console.log(v);
}
```

- 자바스크립트 내장 iterable 객체 : String, Array, TypedArray, Map, Set ...


## Practice
### 제곱을 요소로 갖는 가상 컬랙션
> - **동기명령** : 한번에 적재한 명령이 한번에 cpu에서 실행하는 것(cpu 점유). 이를 관찰하는 게 flow
> - **blocking** : 동기 명령 중에 cpu에 관여할 수 없는 것
> - 브라우저는 얼마나 blocking 상태를 봐줄 것인가,   
  pc브라우저는 30초이지만 업테이트로 20초도 안됨. 안드로이드 크롬은 pc와 같음 그러나 안드로이드 os는 5초 이상 지속되면 멈추게 함. window os는 15초  **> 따라서 약 5초 정도**  
  \>> 이는 우리가 정한 loop를 초로 환산할 수 없다
> - **sleep** : blocking 사이에 여유를 두는 것. js는 프레임으로 이를 제어
> - **긴 블로킹 할 수 없기 때문에 루프를 돌릴 때 상세하게 나누어서 짜야함 && limit를 걸어서 무한루프 방지!**
> - **클로저**란 함수 생성 시, 자유변수를 캡처 해당 스코프에 가둬서 사용하는 것


```js
const N2 = class{
  constructor (max) {
    this.max = max; // 무한 배열 막음
  }

  [Symbol.iterator]() {
    let cursor = 0, max = this.max;
    return {
      done : false, // done이 무한히 false일 것을 막아야 함
      next() {
        if ( cursor > max ) {
          this.done = true; // 무한 루프 방지
        } else {
          this.value = cursor * cursor;
          cursor++
        }
        return this;
      }
    }
  }
}
```

```js
console.log([...new N2(5)]);

for (const v of new N2(5)) {
  console.log(v);
}
```

## Generator
> 다시 참고) **Iterator & Iterator result object & ㅑterable**
> - **Iterator Interface**  
>   1. next라는 키를 갖고,   
>   2. 값으로 인자 받지 않고 `IteratorResultObject`를 반환하는 함수가 온다    
> 
> - **IteratorResultObject**  
>   1. `value`와 `done`를 갖고 있다  
> 
> - **Iterable**  
>   1. `[Symbol.iterator]`라는 키를 갖고  
>   2. 값으로 인자를 받지 않고, `iterator Object`를 반환하는 함수가 온다

- iterator generator 만들기 : 쉽게 iterator 만들기
- 주요기능은 iterator 생성하는 것
- Generator 함수 호출 시마다 iterator 만들어짐  
  Generator가 만든 iterator는 동시에 iterable임

```js
// 위의 iterator를 generator로 구현한 코드
const generator = funciton*(max) {
  let cursor = 0;
  while(cursor < max) {
    yield cursor * cursor;
    cursor++;
  }
}
```
- 함수의 인자와 지역변수 사용, 제어문 사용하는 일반적인 동기화 흐름 들어감
- 다른 점은 `yield`활용하는 점, `yield` 호출 시 `next()`반환하는 효과와 같음  
  이 시점에 suspension(정지, 연기, 보류) 생기는데, 이때 iterator result object 반환하게 됨. `done:false`로 보내고 멈춤  
  다시 호출 시 `yield`구문 다음부터 재실행   
- 자바스크립트는 문 하나를 record로 만들고 special record로 제어문 반환하는데,   
  자바스크립트 엔진 실행기는 record를 돌리고 있고, 노이만 머신을 emulating(모방) 하는 것  
  record를 돌려주는 가상머신 돌리는 것. 여기에 `yield`를 실행하면 suspension 발생하는 것!
- 문은 중간에 멈출 수 없어! 라는 것이 일반적 상식이지만 `yield`통해 문을 멈출 수 있게 됨
- routine은 한번 들어와서 한번에 실행하고 나가는 것이지만(일반 함수의 경우),   
  generator는 여러번 들어와서 여러번 나갈 수 있기에 coroutine이라고 함

- iterator와 generator 차이
  - iterator에서는 `next()`를 호출, 해당 코드를 실행하는 것이지만
  - generator에서는 while문 내 `yield` 기준으로 나뉘어 원하는 코드 반환 가능
  - generator에서는 모든 제어권을 갖고 있음 
  - done & value를 yield가 모두 갖고 있음. generator를 빠져나올 때 done이 false가 됨

- iterator : 상태에 대한 관리요소가 scope 이용 자유변수, 인스턴스 만들어 필드로 관리(객체 구조물 활용)   
  generator : 지역변수, 인자로 관리
# Iterator와 Generator

## Iterator 반복기
- 객체는 한번에 하나씩 컬렉션 항목을 액세스하는 법을 아는 경우 iterator
- javascript에서 반복기는 열 내 다음 항목을 반환하는 `next()` 메소드 제공하는 객체  
  `next()` 메소드는 두 속성 지닌 객체 반환(`{value: , done: }`)

- 이터레이터는 '지금 어디 있는지' 파악할 수 있도록 돕는다는 면에서 책갈피와 비슷한 개념

```js
function makeIterator(array){
  var nextIndex = 0;

  return {
    next: function(){
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {done: true};
    }
  }
}

var it = makeIterator(['yo', 'ya']);
it.next(); // {value: 'yo', done:false}
it.next(); // {value: 'ya', done:false}
it.next(); // {value: undefined, done:true}
```
- `next`에서 배열의 마지막요소를 반환했다고 해서 끝이 아님  
  value가 `undefined`를 반환하지만 계속해서 호출 할 수 있음
- 그렇다고 해서 결과가 바뀌지는 않음, 

## iterable 반복가능한
- 객체가 `for ... of` 구조에서 반복 동작을 정의 하는 경우

### 1. 사용자 정의 itarable
```js
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
[...myIterable] // [1, 2, 3]
```

### 2. 내장 iterable
- **String, Array, TypedArray, Map, Set**  
- 해당 객체의 프로토타입에 `Symbol.iterator` 메서드 있는 경우


### 3. iterable을 기대하는 구문
- **`for ... of` 루프, 전개연산자, `yeild*`, 해체할당**

**iterable**한 개체 특징  
- `Array.from`메소드, spread operator로 배열로 전환 가능
- 해체할당 가능
- `for ... of` 명령 수행 가능
- `Promise.all`, `Promise.race` 명령 수행 가능
- `generator - yield*` 문법으로 이용 가능


## Generator 생성기
- 이터레이터를 사용해 자신의 실행을 제어하는 함수
- 일반적인 함수의 경우, 호출자가 매개변수 외에는 함수의 실행에 대한 제어권 없음
- 제너레이터는 함수의 실행을 개별적 단계로 나우어 함수 실행을 제어, 실행 중인 함수와 통신 가능  
  - 제너레이터는 언제든 호출자에게 제어권 넘길 수 있음(`yield`)
  - 제너레이터는 호출한 즉시 실행하는 것이 아니라, 이터레이터 반환하고 이터레이터의 `next()`메서드를 호출하면서 실행됨

```js
function* rainbow() {
	yield "red";
	yield "orange";
	yield "yellow";
	yield "green";
	yield "blue";
	yield "navy";
	yield "purple";
}

const it = rainbow();
it.next(); // { value: "red", done: false }
it.next(); // { value: "orange", done: false }
it.next(); // { value: "yellow", done: false }
it.next(); // { value: "green", done: false }
it.next(); // { value: "blue", done: false }
it.next(); // { value: "navy", done: false }
it.next(); // { value: "purple", done: false }
it.next(); // { value: undefined, done: true }
it.next(); // { value: undefined, done: true }

for (let color of rainbow()) {
  console.log(color);
}

const it2 = rainbow();
[...it2]; // ["red", "orange", "yellow", "green", "blue", "navy", "purple"]
```


### yield 표현식과 양방향 통신
- 제네레이터 - 호출자 사이 양방향 통신 가능
- 통신은 `yield` 표현식 통해 이루어지며, `yield` 표현식의 값은 호출자가 제너레이터의 이터레이터에서 `next()`를 호출했을 때 제공하는 매개변수

```js
function* interrogate() {
  const name = yield 'What is your name?';
	const color = yield 'What is your favorite color?';
	return `${name}'s favorite color is ${color}`;
}

const it = interrogate();

it.next(); // { value: 'What is your name?', done: false}
it.next('minji'); // { value: 'What is your favorite color?', done: false}
it.next('green'); // { value: 'minji's favorite color is green', done: true}
```
- 호출자가 제너레이터에 정보를 전달하므로, 제너레이터는 그 정보에 따라 자신의 동작 방식 자체를 바꿀 수 있음

### 제네레이터와 return
- `yield`문은 제너레이터의 마지막 문이더라도 제너레이터 끝내지 않음
- `return`문은 제너레이터 내 사용 위치와 상관 없이, `done`을 true / `value`는 return의 반환값으로 설정

```js
function* abc() {
  yield "a";
  yield "b";
  return "c";
}

const it = abc();
it.next(); // { value: "a", done: false }
it.next(); // { value: "b", done: false }
it.next(); // { value: "c", done: true }
```
- 주의할 점,  
  제너레이터 사용시 `done`이 `true`일 경우, `value`의 프로퍼티에 주의를 기울이지 않음!  
  **제너레이터가 반환하는 값 사용하려면 `yield`, 제너레이터 종료시키려면 `return`사용!!!**

```js
for (let l of abc()) {
  console.log(l); // 이경우 c는 출력되지 않음!
}
```




> **참고 서적**  
> - [「반복기와 실행기」](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Iterators_and_Generators), MDN, 2018.07.27
> - 『러닝 자바스크립트』, 「이터레이터와 제너레이터」, 이선 브라운, 한선용, 한빛미디어, 2017
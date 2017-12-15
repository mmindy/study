# 1. this라나 뭐라나

## 1.1 this를 왜?
숙련된 개발자조차 헷갈릴 정도라면 대체 this는 뭐에 쓰는 물건인지 궁금할 것이다. 공들여 학습할 가치는 있을까? "어떻게" 이전에 "왜"부터 따져보자

**먼저 this의 유용함과 사용 동기를 알아보자.** 코드가 "어떻게" 작동하는지 혼란스럽다면 일단, "왜"라는 문제에만 집중하자.

```js
function identify() {
	return this.name.toUpperCase();
}

function speak() {
	var greeting = "Hello, I'm " + identify.call(this);
	console.log(greeting);
}

var me = {
	name : "Kyle"
};

var you = {
	name : "Reader"
};

identify.call(me); // Kyle
identify.call(you); // Reader

speak.call(me); // Hello, I'm Kyle
speak.call(you); // Hello, I'm Reader
```
- `identify()`, `speak()` 두 함수는 객체별로 따로따로 함수를 작성할 필요 없이 다중 콘텍스트 객체인 `me`와 `you`에서 모두 재사용할 수 있다

```js
function identify(context) {
	return context.name.toUpperCase();
}

function speak(context) {
	var greeting = "Hello, I'm " + identify(context);
	console.log(greeting);
}

var me = {
	name : "Kyle"
};

var you = {
	name : "Reader"
};

identify(you);
speak(me);
```

- `this`를 안 쓰고, `identify()`, `speak()` 함수 콘텍스트 객체를 명시할 수도 있다

**하지만 암시적인 객체 레퍼런스를 '함께 넘기는(passing along)' this 체계가 좀더 API 설계가 깔끔하고 명확하며 재사용하기 쉽다.**
사용패턴이 복잡해질수록 보통 명시적인 파라미터로 콘텍스트를 넘기는 방법이 this 콘텍스트를 사용하는 것보다 코드가 더 지저분해진다.

## 1.2. 헷갈리는 것들
`this`란 글자 그대로 생각하게 해 그 의미를 해석하는 데 헷갈리는 점이 있다.

### 1.2.1. 자기 자신 - `this`가 함수 그 자체를 가리킨다는 오해
- **함수는 `this`로 자기 참조를 할 수 없다**
- 함수가 내부에서 자기 자신을 가리는 경우 :
	재귀(함수 내부에서 자기 자신을 다시 호출) 로직이 들어가는 경우 /
	최초 호출 시 이벤트에 바인딩된 함수 자신을 언바인딩(unbinding)하는 경우

```js
// this로 자기 참조를 할 수 없다는 증명
// 함수 foo() 호출 횟수를 추적하는 예제

function foo(num) {
	console.log( "foo : " + num );

	// foo 가 몇번 호출 됐는지 추적
	this.count++;
}

foo.count = 0;

var i;

console.log("처음 : "+foo.count);
for ( i = 0; i < 10; i++ ){
	if ( i > 5 ) {
		foo(i);
	}
}

console.log("끝 : " + foo.count);
```
- `foo.count = 0`을 하면 `foo`라는 함수 객체에 `count` 프로퍼티가 추가된다. 그러나 `this.count`에서 `this`는 함수 객체를 바라보는 것이 아니며, 프로퍼티 명이 똑같아 헷갈리지만 근거지를 둔 객체 자체가 다르다

> **애초에 의도한 대로 `count` 프로퍼티가 증가한 게 아니라면, 대체 어떤 `count`가 증가한 겁니까?**
> 그 장본인은 전역변수 `count`로 현재 값은 `NaN`임을 알 수 있다.

```js
// 많은 개발자들이 이 부분에서 '왜 this 참조가 이상하게 이루어졌을까'라는 중요한 질문의 답을 찾지 않고, 이슈 자체를 피하거나 count프로퍼티를 다른 객체로 옮기는 우회책을 선택한다
function foo(num) {
	console.log("foo : " + num);
	data.count++;
}

var data = {
	count : 0
}

var i;
for( i = 0; i < 10; i++) {
	if (i>5) {
		foo(i);
	}
}

console.log(data.count); // 4
```
> 렉시컬 스코프를 사용하지 말라는 게 아니다. 렉시컬 스코프 그 자체는 훌륭하고 유용한 시스팀이나, this에 대해 어렴풋이 짐작만 하다가 뭐가 좀 안 된다 싶을 때 그냥 렉시컬 스코프를 다시 찾는 식으로는 발전이 없다

**함수가 내부에서 자기 자신을 참조할 때 일반적으로 `this`만으로는 부족하며, 어휘식별자(lexical identifier, 변수)를 거쳐 함수 객체를 참조한다**

```js
function foo() {
	foo.count = 4; 	// foo는 자기 자신을 가르킨다
}

setTimeout(funciton(){
	// 익명함수 (이름없는 함수)는 자기 자신을 가리킬 방법이 없다
}, 1000);
```

**기명함수(named function)는 함수명 자체가 내부에서 자신을 가리키는 레퍼런스로 쓰인다.** 하지만 익명함수(anonymous function)는 이름식별자(name identifier)가 없으므로 함수 자신을 참조할 방법이 마땅치 않다

```js
function foo(num) {
	console.log( "foo : "+ num );
	this.count++;
}

foo.count = 0;
var i;
for( i = 0; i < 10; i++) {
	if ( i > 5 ) {
		// this는 이제 확실히 함수 객체 'foo' 자신을 가리킨다
		foo.call(foo, i);
	}
}
console.log(foo.count); // 4
```

### 1.2.2. 자신의 스코프
- `this`가 바로 함수의 스코프를 가리킨다는 말도 아주 흔한 오해다.
- **분명한 건, `this`는 어떤 식으로도 함수의 렉시컬 스코프를 참조하지 않는다는 사실!**
- 내부적으로 스코프는 별개의 식별자가 달린 프로퍼티로 구성된 객체의 일종이나,
	스코프 '객체'는 자바스크립트 구현체인 '엔진'의 내부 부품이기 때문에 일반 자바스크립트 코드로는 접근하지 못한다

```js
function foo() {
	var a = 2;
	this.bar();
}

function bar() {
	console.log(this.a);
}

foo(); // ReferenceError : a is not defined
```
- `bar()` 함수는 `this.bar()`로 참조하려고 한 것부터가 문제다. `bar()` 앞의 `this`를 빼고, 식별자를 어휘적으로 참조하는 것이 가장 좋은 호출 방법이다
- 실제 `foo()`와 `bar()` 사이 어떠한 연결 통로도 없으며, 렉시컬 스코프 안에 있는 뭔가를 `this` 레퍼런스로 참조하기란 애당초 가능하지 않다

## 1.3. this는 무엇인가?
부정확한 추측을 이제 정리하고, this체계가 어떻게 작동하는지 알아보자

- `this`는 작성 시점이 아닌 런타임 시점에 바인딩되며, 함수 호출 당시 상황에 따라 콘텍스트가 결정된다
- **함수 선언 위치와 상관 없이, `this` 바인딩은 오로지 어떻게 함수를 호출했느냐에 따라 정해진다**

- 어떤 함수를 호출하면 활성화 레코드(activation record), 즉 실행 콘텍스트(execution context)가 만들어진다.
	여기엔 함수가 호출된 근원(콜스텍, call-stack)과 호출 방법, 전달된 파라미터 등의 정보가 담경 있다. `this`레퍼런스는 그중 하나로, 함수가 실행되는 동안 이용할 수 있다

## 1.4. 정리하기
`this`를 제대로 배우고 싶다면 먼저 가지고 있는 오해와 추측으 버리고, `this`가 함수 자신이나 함수의 렉시컬 스코프를 가리키는 레퍼런스가 아니라는 점을 분명히 인지해야 한다.
**`this`는 실제로 함수 호출 시점에 바인딩되며, 전적으로 함수를 호출하는 코드에 의해 무엇을 가리킬지 결정된다**

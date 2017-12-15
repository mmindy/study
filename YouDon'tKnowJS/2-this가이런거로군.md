# 2. this가 이런 거로군!

1장에서는 `this`가 알고 있었던 것과는 달리 호출부(함수가 어떻게 호출되었는가)에서 함수를 호출할 때 바인딩된다는 사실을 이야기했다.

## 2.1. 호출부
- `this` 바인딩의 개념을 이해하려면 먼저 **호출부**, 즉 **함수 호출(선언이 아니다)** 코드부터 확인하고 `this`가 가리키는 것이 무엇인지 찾아봐야 한다
- 호출부는 '함수를 호출한 시점'으로 돌아가면 금세 확인할 수 있을 것 같지만, 코딩 패턴에 따라 찾기 모호한 경우가 많다
	이럴 때 중요한 것은, **호출 스택(현재 실행 지점에 오기까지 호출된 함수의 스택)을 생각해 보는 것이다!**
- 호출부는 현재 실행중인 함수 '직전'의 호출코드 '내부'에 있다
- `this` 바인딩은 오직 호출부와 연관되기 때문에 호출 스택에서 진짜 호출부를 찾아내려면 코드를 주의깊게 봐야 한다

```js
function baz() {
	// 호출 스택 - 'baz'
	// 따라서 호출부는 전역 스코프 내부다
	console.log("baz");
	bar();	// < bar 의 호출부
}

function bar() {
	// 호출 스택 - "baz > bar"
	// 따라서 호출부는 "baz" 내부다
	console.log("bar");
	foo();	// < foo 의 호출부
}

function foo() {
	// 호출 스택 - "baz > bar > foo"
	// 따라서 호출부는 "bar" 내부다
	console.log("foo");
}
baz(); // < baz 의 호출부
```

## 2.2. 단지 규칙일 뿐
이제 함수가 실행되는 동안 this가 무엇을 참조할지를 호출부가 어떻게 결정하는지 알아보자

### 2.2.1. 기본 바인딩 - 단독 함수 실행(standalone function invocation)

```js
function foo() {
	console.log(this.a);
}
var a = 2;
foo(); //2
```

- `var a = 2`처럼 전역 스코프에 변수를 선언하면 변수명과 동일한 이름의 전역 객체 프로퍼티가 생성된다
- `foo()` 함수 호출 시, `this.a`는 전역 객체 `a`이다. **기본 바인딩이 적용되어 `this`는 전역 객체를 참조한다!**

```js
function foo() {
	"use strict";

	console.log(this.a);
}
var a = 3;
foo(); // TypeError : 'this' is 'undefined'
```
- **단, 엄격 모드(strict mode)에서는 전역 객체가 기본 바인딩 대상에서 제외된다.** 따라서 이 경우, `this`는 `undefined`!

```js
function foo() {
	console.log(this.a);
}

var a = 2;

(function() {
	"use strict";
	foo();
})();
```
- 미묘하지만 중요한 사실은 보통 `this` 바인딩 규칙은 오로지 호출부에 좌우되지만, 비엄격 모드에서 `foo()`함수의 본문을 실행하면, 전역객체만이 기본 바인딩의 유일한 대상이라는 점이다. `foo()` 호출부의 엄격 모드 여부는 상관없다.

> 그렇다고 엄격 모드와 비엄격 모드를 섞어 쓰면 탈이 난다. 프로그램 전체에서 두 모드 중 하나만 쓰자.
> 단, 외부 서드파티 라이브러리를 가져다 사용할 때 여러분 코드의 모드와 다르면 호환성 이슈를 잘 살펴야 한다

### 2.2.2. 암시적 바인딩 - 객체의 소유(owning) / 포함(containing) 여부 확인
이는 호출부에 콘텍스트 객체가 있는지, 즉 객체의 소유 / 포함 여부를 확인하는 것이다(소유와 포함 둘은 오해의 소지가 있는 용어다)

```js
function foo() {
	console.log(this.a);
}

var obj = {
	a : 2,
	foo : foo
}

obj.foo(); // 2
```

- `foo()`를 처음부터 `foo` 프로퍼티로 선언하든 이 예제처럼 나중에 레퍼런스로 추가하든, `obj` 객체가 이 함수를 정말로 '소유'하거나 '포함'한 것은 아니다
- 그러나 호출부는 `obj` 콘텍스트로 `foo()`를 참조하므로 `obj` 객체는 함수 호출 시점에 함수의 레퍼런스를 '소유'하거나 '포함'한다고 볼 수 있다
- **함수 레퍼런스에 대한 콘텍스트 객체가 존재할 때, 암시적 바인딩(implicit binding) 규칙에 따르면 바로 이 콘텍스트 객체가 함수 호출 시 `this`에 바인딩된다**

```js
function foo() {
	console.log(this.a);
}

var obj2 = {
	a : 42,
	foo : foo
};

var obj1 = {
	a : 2,
	obj2 : obj2
};

obj1.obj2.foo(); //42
```
- 위처럼 **객체 프로퍼티 참조가 체이닝된 형태라면 최상위/최하위 수준의 정보만 호출부와 연관된다**


#### 암시적 소실
- '암시적으로 바인딩된(implicitily bound)' 함수에서 바인딩이 소실되는 경우가 있는데, `this` 바인딩이 의외로 헷갈리기 쉬운 케이스다
- 엄격 모드 여부에 따라 전역 객체나 undefined 중 한 가지로 기본 바인딩된다

```js
function foo() {
	console.log( this.a );
}

var obj = {
	a : 2,
	foo : foo
};

var bar = obj.foo;
var a = "전역 변수!";

bar(); // "전역 변수!"
```

- `bar`는 `obj`의 `foo`를 참조하는 변수처럼 보이지만, 실은 `foo`를 직접 가리키는 또다른 레퍼런스다
	게다가 호출부에서 그냥 평범하게 `bar()`를 호출하므로 기본 바인딩이 적용된다

```js
// 콜백 함수 전달하는 경우
function foo() {
	console.log(this.a);
}

function doFoo(fn) {
	// "fn"은 'foo'의 또다른 레퍼런스일 뿐!
	fn();  // <- 호출부!!
}

var obj = {
	a : 2,
	foo : foo
};

var a = "전역!";
doFoo(obj.foo);
```
- **파라미터로 전달하는 건 일종의 암시적 할당이다**
	따라서 예제처럼 함수를 파라미터로 넘기면 암시적으로 레퍼런스가 할당되어 이전 예제와 결과가 같다

```js
// 콜백 받아 처리하는 함수가 내장함수일 경우
function foo() {
	console.log( this.a );
}

var obj = {
	a : 2,
	foo :foo
};

var a = "전역!";
setTimeout( obj.foo , 100); // "전역!"
```

- 콜백을 받아 처리하는 함수가 내장함수일 경우도 마찬가지

```js
// setTimeout()의 이론적인 의사구현체(pseudoimplementation)의 형태
function setTimeout() {
	// "delay" 밀리초 동안 기다린다
	fn(); // <- 호출부!
}
```

### 2.2.3. 명시적 바인딩 - `call()`과 `apply()` 메소드
- 함수 레퍼런스 프로퍼티를 객체에 더하지 않고 어떤 객체를 `this`바인딩에 이용한다
- `call()`과 `apply()` 메소드는 `this`에 바인딩할 객체를 첫째 파라미터로 받아 함수 호출 시 이 객체를 `this`로 세팅한다
	**`this`를 지정한 객체로 직접 바인딩하므로 이를 '명시적 바인딩(explicit binding)'이라 한다**

```js
function foo() {
	console.log(this.a);
}

var obj = {
	a : 2
};

foo.call(obj); // 2
```

- `foo.call(obj)`에서 명시적으로 바인딩하여 함수를 호출하므로, `this`는 반드시 `obj`가 된다
- **객체 대신, 단순 원시값(문자열, 불리언, 숫자)을 파라미터로 전달하면 원시 값에 대응되는 객체(각각 new String(), new Boolean(), new Number())로 레핑(wrapping)되며, 이 과정을 박싱(Boxing)이라고 한다**

- 하지만 아쉽게도 이렇게 명시적으로 바인딩해도 앞에서 언급한 `this`바인딩이 도중에 소실되거나 프레임워크가 임의로 덮어써 버리는 문제는 해결할 수 없다


#### 하드 바인딩(hard binding) - 명시적 바인딩을 약간 변형한 꼼수
```js
function foo() {
	console.log(this.a);
}

var obj = {
	a : 2
};

var bar = function() {
	foo.call(obj);
}

bar(); //2
setTimeout(bar, 100); // 2

// 하드 바인딩된 bar에서 재정의된 this는 의미없다
bar.call(window);
```

- 함수 `bar()`는 내부에서 `foo.call(obj)`로 `foo`를 호출하면서 `obj`를 `this`에 강제로 바인딩하도록 하드 코딩한다.
	따라서 `bar`를 어떻게 호출하든 이 함수는 항상 `obj`를 바인딩하여 `foo`를 실행한다
- 이런 바인딩은 명시적이고 강력해서 하드 바인딩이라고 한다

**하드 바인딩으로 함수를 감싸는 형태의 코드는 다음과 같이 인자를 넘기고 반환값을 돌려받는 창구가 필요한 경우**
```js
function foo(something) {
	console.log(this.a, something);
	return this.a + something;
}

var obj = {
	a : 2
};

var bar = function() {
	return foo.apply(obj, arguments);
};

var b = bar(3); // 2 3
console.log(b); // 5
```

**재사용 가능한(resuable) 헬퍼(helper) 함수를 쓰는 경우**
```js
function foo(something) {
	console.log(this.a, something);
	return this.a + something;
}

// 간단한 bind 헬퍼
function bind(fn, obj) {
	return function() {
		return fn.apply(obj, arguments);
	};
}

var obj = {
	a : 2
};

var bar = bind(foo, obj);
var b = bar(3);
console.log(b);
```

- 하드 바인딩은 자주 쓰는 패턴이어서 ES5 내장 유틸리티 `Function.prototype.bind()`는 주어진 this 콘텍스트로 원본함수를 호출하도록 하드코딩된 함수를 반환한다




#### API 호출 콘텍스트

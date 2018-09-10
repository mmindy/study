# Further Routine

## Spread ref
- 참조 값은 퍼져 나가기 때문에, 잘못쓰면 어떤 것도 쉽게 바꿀 수 없는 상태가 된다
- 참조를 끊어내고 복사본을 넘기고 리턴하는 것이 최적의 방법!
```
변수 A,B,C,D
A = routineA(B)
C = routineB(D)

routineA = B => {
  arguments[B]
  Local variables LA(B)
  return LA
}

routineB = (D) => {
  arguments[D]
  Local variables LB(D)
  return LB
}
```

- 메인 루틴과 서브 루틴이 대화할 때 인자값(argument)과 리턴으로 대화하는데,     
  참조값을 넘기는 경우, 되도록 내부에서 새로운 값 만들어 넘기자  
  => 이는 여파를 없애기 위함
- 복사본을 만드는 습관 들이고, 다른 객체에 인자로 넘기는 것까지 고려해야 함


## Sub Routine Chain

> [지난 강의 참고] **함수의 스택 메모리, call stack**
> - routine 내에서 routine 호출할 경우, 각 routine 별 keep한 메모리들이 바로, call stack
> - routine 안에 routine이 얼마나 축적되어 있냐에 따라 call stack이 계속 쌓임. 이때 stack이 많이 쌓여 죽어버리는 현상이 stack overflow
> - return 통해 값 반환 시 하나씩 stack이 해지

call stack을 자세히 보자!
- call stack에 keep된 메모리 == 해당 routine의 인자와 지역변수 > 실행 컨텍스트(execution context)

그런데,

1. 만약, routine에서 새로운 routine 호출 시점을 return 시점으로 한다면?
2. 또, return 포인트를 처음 routine을 호출했던 곳으로 잡는다면?    
  (단, 이는 언어에서 지원해야할 문제)

\>> **마지막에 호출된 routine의 리턴 값을 처음 routine을 호출한 지점으로 보낼 수 있다!**   
\>> 그 결과, **routine 별로 call stack을 만들어내지 않아도 된다! >> 이게 바로 "<u>꼬리 물기 최적화</u>!!"**

**이를 통해 효율적으로 함수를 처리할 수 있는데, 이는 <u>제어문의 loop(stack clear 기능)</u>와 비슷하다**  
\> 꼬리 물기 최적화를 지원하는 언어에서는 제어문을 활용하지 않더라도 함수를 통해 고성능의 반복문을 만들 수 있다(사파리에서 지원)


## Tail Recursion 꼬리물기 최적화

- 언어는 꼬리물기 최적화 위한 조건 정의해 두는데, 이를 지키면 효율적인 코드 작성 가능!

```js
// 재귀함수 sum
const sum = v => v + ( v > 1? sum(v-1) : 0);
sum(3); // 6
```

- 위의 경우 아래와 같이 작동
```
(1)
sum(v:3)
  return 3 + sum(2) // 6

(2)
sum(v:2)
  return 2 + sum(1) // 3

(3)
sum(v:1)
  return 1 + 0  // 1
```

이때, 꼬리 물기 최적화가 가능할까? == 메모리를 날릴 수 있을까? 
- 없다. 왜냐하면 이전 숫자와 덧셈을 해야하기 때문. 여기서는 <u>더하기(연산자)가 꼬리물기 최적화를 방해하고 있음</u>
- **연산자는 꼬리물기 최적화를 방해한다**(연산자가 무엇인지, 해당 연산 대상이 무엇인지 기억해야 하기 때문)  
  === 모든 연산자는 stack memory를 만들어 낸다
- tail recursion 가능하려면, return과 routine 호출 사이에 아무것도 일어나지 않아야 함!

### tail recursion을 만들어보자

#### 1. 연산을 인자로 옮기자
- 가장 많이 알려진 방법 
- 함수의 콜을 처리할 때 로컬메모리만 처리하면 되고, 다음번 함수 콜에 인자쪽 메모리를 옮기면 됨? 
- **stack memory를 발생시키지 않는 연산자: 삼항 연산자(`?`), `&&`, `||`**
- 재귀를 짜려면 꼬리물기 최적화로 짜야 이상적인 방법!

```js
// 꼬리 물기 최적화
const sum01 = ( v prev = 0 ) => {
  prev += v;
  return ( v > 1 ? sum(v-1, prev) : prev);
}
```

## Tail Recursion to Loop
```js
// 루프문
const sum02 = v => {
  let prev = 0;
  while (v > 1) {
    prev =+ v;
    v--;
  }
  return perv;
}
```
- 재귀 함수를 돌리다 보면, stack overflow로 죽을 수 있으니, 꼬리 물기 최적화가 정답!
- 언어가 꼬리 물기 최적화를 지원하지 않는다면, 위와 같이 루프문으로 바꿀 수 있다  
  ('루프문 <-> 꼬리물기최적화'를 자유자재로 바꿀 수 있어야 한다!)
- 메모리 관점에서 보는 routine

## Closure
**static state**
- sub routine을 문으로 만들면, 실행중 함수를 만들 수 없음. 각각의 흐름을 따르는 것. 
- main flow와 sub routine이 공유하는 것은 전역뿐! 다른 영역
- 문으로 만들면 각 클래스에 중복 기록할 수밖에 없음. 클로저 나타나지 않음
- 실행(런타임) 중에 routine 생성X

**runtime state** 새로운 기술의 출현
- 람다 : routine을 값으로 치환
- 클로저란 런타임 중에 routine생성할 수 있는 언어에서만 생성 가능
- routine이 처음부터 정적인 문으로 존재X
- 실행 중간에 routine 생성
- main flow 내에 sub routine 포함. sub routine은 main flow와 전역을 공유! >> 인식할 수 있는 변수 더 많아짐! 

> **자유변수**
> 클로저는 독립적인 (자유) 변수를 가리키는 함수이다. 또는, 클로저 안에 정의된 함수는 만들어진 환경을 ‘기억한다’.

## Nested Closure 중첩된 클로저
- 클로저는 루틴만이 만드는 것은 아님. ES6 이후 블록 스코프 생성으로 인해 클로저 만들어지기도 함
```js
window.a = 3;
if ( a===3 ) {
  const b = 5;
  const f1 = v => {
    const c = 7;
    if ( a+b >c ){
      return p => v + p + a + b + c;
    } else {
      return p => v + p + a + b;
    }
  }
}
```

## Shadowing
> 언어별로 지원 여부 갈림
- 이름이 겹치면 실행하는 코드의 가장 가까운 위치의 코드 반영 & 다른 변수들은 까매짐(shadowing)


- 중첩된 클로저 중 각각 클로저 상태에서 같은 이름의 변수 사용하는 경우 발생
- **네임스페이스 정의할 때 쓰임**
- 안에 있는 sub routine이 밖의 변수를 못 건드리게 하고 싶을 때! 내부에 같은 이름 선언함으로써 해결  
  === 중첩된 클로저에서 외부 변수 보호하는 유일한 방법   
  === 보안 권한 설정
- 가장 좋은 이름은 기저 코드에서부터 사용하기에 내부 routine이 외부 플로우 변수 오염시키는 일 발생(좋은 이름 중첩으로 사용하여!)  
  \> 그렇기에 무조건! 지켜야 하는 방법!
```js
const a = 3;  // (1) 전역
if ( a==3 ) {
  const a = 5; // (2) 블록 스코프
  const f1 = v => { 
    const a = 7;  // (3) ROUTINE 
    console.log(a);
  }
}
```
- (3)을 선언하여 sub routine 내에서 (1), (2)에 접근할 수 없게 만듦


## Co Routine
- '문을 중간에 멈출 수 있다'라는 생각에서 시작
- routine을 여러번 실행할 수 있다! single routine의 반댓말
- js에서는 generator로 구현 가능!

**(Single) Routine**   
- 한번에 routine의 흐름을 보장함

**Co Routine**   
- `yeild` : co routine 용 return
- 서스팬션suspention, 일시정지 후 복귀 반복

- 공유할 상태가 많을 때, 받아서 다음번 routine에 전달(arguments)하는 것이 무거워짐.  
  co routine 사용 시, 지역변수로 상태 유지 가능해져 코드 이해 및 효율도 높아짐
- yeild가 loop 내에 있을 경우, loop 돌 때 마다 걸려서 멈추게 됨! > 반복문을 멈출 수 있게 됐다!  
  loop <-> recursive function 서로 바꿀 수 있으니, loop를 재귀함수로 바꿔 실행할 수 있음!

```js
const generator = function* (a) {
  a++;
  yield a;
  a++;
  yield a;
  a++;
  yield a;
}

const coroutine = generator(3); // 
```
- 제네레이터 자체가 co routine이 아니라, 제네레이터를 호출하는 것이 co routine!
- 제네레이터는 co routine을 만들어주는 도구

```js
let result = 0;
result += coroutine().value;
console.log(result);
```
```js
let result = 0;
result += coroutine.next().value;
console.log(result); // 4
result += coroutine.next().value;
console.log(result); // 9
result += coroutine.next().value;
console.log(result); // 15 - co routine 빠져나옴
```
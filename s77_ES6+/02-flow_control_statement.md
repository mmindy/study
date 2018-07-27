# Flow Control Statement

### Record, Completion Record
- 자바스크립트는 문을 해석할때, 하나의 실행 단위(처리 과제)로 인식 (식은 하나의 값으로 수렴)  
  - 여기서 과제를 record라고 함
  - 문 하나를 record로 저장, 하나씩 소비해가며 해결해감
- statement - record : 레코드 변환과 등록, 처리 과정이 자바스크립트의 주

- **Flow Control Statement** : flow 컨트롤 하는 문들은 **completion record**로 등록

- 자바스크립트는 우리가 작성한 문을 record / completion record 로 등록하는데,  
  completion record는 우리가 작성한 문 중에 어떤 것을 control statement로 사용할 지 선택함


## Direct Flow Control (직접 flow 컨트롤)

### 직접 flow 컨트롤 명령어, `Label`

#### Identifier 식별자
- 자바스크립트 변수 규칙과 같으나, $로 시작, 포함할 수 없음!
- 전체 문서에 label 외, 문이 없으면 syntax error  
  : 브라우저에서 label은 문으로 인정하지 않음 / record X 이에 달리는 태그 같은 애  
  : 공문(`;`)만 입력하더라도 OK  
  ```js
  abc :  //  X 
  ```
- label은 runtime이 아닌 parsing 시점에 인식되기 때문에, 같은 스코프에 같은 이름 두개 등장X
  ```js
  abc: 3;
  abc: 3; // 중복 선언 불가 - syntax error
  ```

#### Scope - label의 scope
**Label shadow / static parsing**
- label의 스코프는 함수로 결정 (블록(`{ }`) 스코프X)
- 대신 label scope 존재! : label 바로 뒤에 중괄호  
  - label 스코프 안에서는 영역 나뉘기 때문에 같은 이름으로 선언 가능!
  ```js
  abc : {
    abc : 3;  
  } // label scope : 중문과 다른 개념
  ```
  - label scope 생성하며 label shadowing이 일어나기 때문

**Label Range & Set**
- Label Range : label 영역을 나누는 것
  ```js
  // 오류
  abc : {
    console.log("start")
    if (true) {
      break;  
    }
    console.log("end");
  }

  /// 이렇게 해야 OK
  abc : {
    console.log("start")
    if (true) {
      break abc;  
    }
    console.log("end");
  }
  ```
- Label Range를 인식하려면 label set을 알아야 함!  
  - 어떻게 해서 label range를 생성하는가
  1) **Auto Label** : label에서 다음 label까지가 하나의 range 이룸
  2) **iteration(for,while), switch** : 이들이 나오면, 얘네가 label range 제한할 수 있음(얘네 직전까지 range 범위 잘림)
  3) **undefinded named label** : 
      ```js
      console.log('0');
      abc : 
      if ( true ) {
        break abc;
      }

      console.log('1');
      bbb:
      console.log('2');
      ```

```js
for ( var i = 0; i < 10; i++) {
  if (i==5) break;
}

/// 아래와 같은것. js 엔진에서 그렇게 만듦

temp38:
for ( var i = 0; i < 10; i++) {
  if (i==5) break temp38;
}
```

#### AS Comment : label 주석으로 활용하기
- 뒤에다 주석 달다보면 가독성 떨어짐
- 앞쪽에 레이블로 주석 대체
```js
a : console.log("1"); // 1번주석
b : console.log("123123123"); // 2번주석
c : console.log("456456465456465465465"); // 3번주석
```

####
- label 호출 시, 블록의 가장 하단으로 감

### Switch
```js
switch ( ) {
  case '' : 
  break;
}
```

1. special label block
- switch에서의 중괄호는 문법적 토큰
- 이 중괄호 통해 special label block 만듦
- case 안의 식을 동적

- run time 평가 / default 평가 처리 ???

2.  fall through
3. auto lable

```js
switch ( ) {
  case '' : console.log("c")
}
```

??????
- - - - 다시 듣자,,,!!! 

```js
// runtime switch
var c = 2;
switch (true) {
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
}
```

## Optional Flow Control
- optional : 선택적. 해도 되고 안해도 되고 (<->mandatory 필수적인)

> 프로그래밍 랭기지는 컴퓨터를 위한 것. 컴퓨터 환경에 맞는 문법으로 작성
> 프로그래밍 언어의 미묘한 차이들을 이해하고,자신의 의도에 맞게 사용해야 함!

- if 는 optional / if else 는 mandatory
### truthy, falsey
- while문과 if문은 truthy와 falsey
  : falsey만 이해하면 그 외의 것은 truthy(falsey 값 : 0 / 빈문자열 / undefinded / null / NaN)

### Optional, Mandatory
- 코드 레이어링을 할 대 중요한 것!
```js
// 얘네 자체가 madatory : case 가 만들어졌으니까
if (a) console.log('case 1');
else console.log('case 2');

if (b) console.log('case 3');  // optional
console.log('case 4');  // madatory

////////
// else 문이 없으니까 optional
if (a) console.log('case 1');
else if (b) console.log('case 2');

////////
// 이건 조건이 불충만하기때문에, optional-madatory의 구분 불명확. mandatory로 수렴한다고 볼 수 없음(전체 케이스 다룬다는 거 모름)
if (a) console.log('case 1');
else if (a && b) console.log('case 2');
else console.log('case 3');


////////
// else if 문으로 mandatory 만듦
if (a) console.log('case 1');
else if (a && b) console.log('case 2');
else if (!a && b) console.log('case 2');
else if (a && !b) console.log('case 2');
else if (!a && !b) console.log('case 2');


/// 위의 본모습
// 자바스크립트의 모든 문은 왼쪽에서 오른쪽으로 결합.
// 그러나 if-else문과 화살표함수만 오른쪽에서 왼쪽으로 결합(후방결합)
// 뒤의 else는 앞의 if의 것
// rl 결합은 lr결합과 다름. 그만큼 어려우므로 중괄호, 괄호 치며 짜 나가야 오류 줄이는 법!

if (a) console.log('case 1');
else {
  if (a && b) console.log('case 2');
  else {
    if (!a && b) console.log('case 2');
    else {
      if (a && !b) console.log('case 2');
      else if (!a && !b) console.log('case 2');
    }
  }
}

//////
// 조건이 여러개 있으면, 조건만큼 if 문 있는 게 mandatory로 수렴하는 길
// 그러나 a는 b에 따라 해석이 달라지는 것으로 보았을 때, mandatory라 볼 수 없음 - 두 변수 사이 관계성 불명확
// b와 a의 관계 명확하게 밝히는 것이 중요. a에 b.a라고 쓰는 게 좀 더 명확해지지만, 중복성 있기 때문에 이 코드는 망할 거야
// 그러니, mandatory로 수렴할 것들을 단단히 잡아 놓고 세세하게 mandatory로 단계별로 들어감
if (a) {
  console.log('case 1');
} else {
  if (b) {
    if (a) {
      console.log('case 2');
    } else {
      console.log('case 3');
    }
  } else {
    if (a) {
      console.log('case 4');
    } else {
      console.log('case 5');
    }
  }
}
```

### RL parsing 후방결합
- 중괄호 씌워라

## Iterate flow control 반복
컴퓨터의 반복
- iteration : 반복 내용 변하지 않을 때
- recursive : 반복 내용이 변할 때. 재귀함수 (ex. a > b > c > a ...)

문으로 지원하는 건, iteration

### For문
```js
for ( (1) ; (2) ; (3) ) { }
```
- `while`문을 사용하다 사용자 경험에 따라 탄생한 게 `for`문
- 그렇기 때문에 언어마다 사용법? 이 다름

#### Limited statement
- (1)에 들어가는 것들
`var a = 0` 얘는 문인데,  
`a = 3` 얘는 식이고,  
`a = 4, b = 3` 컴마는 먼데?!  
이게 바로 **limited statement block**  
언어에 따라 받아들이는 문 종류 다름  

#### Empty truthy
- (2)에 들어가는 것들
`true` 값,
그런데 `` 공문도 들어간다???

#### Last Execution
- (3)에 들어가는 것들
마지막에 평가해서 마지막에 강제로 삽입한다!

### WHILE 문
```js
while (a) {

}
```
- 필수 조건 : while의 조건에 들어간 `a`가 while의 본문에 무조건 `a`의 변화가 있어야 한다!
- 특수한 경우 - 무한루프를 위한 것이라면, `while(true) {  }`
- 현실에서는 
  ```js
  while (a.b()){
    some.k();
  }
  ```
  이런 경우 조건의 `a`가 본문에 있는지 알 수 없기에, 나쁜코드!
  ```js
  var k = a.b();
  while (k) {
    some.k();
    k = a.b();
  }
  ```
  이렇게 하더라도 `a.b`와 `k`의 관계를 모르지만 while문을 추적할 수 있음! 통제 가능해짐!
  
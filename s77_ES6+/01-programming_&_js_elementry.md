# Programming & Javascript Elementry

## What did you do that?

**이에 대한 답을 내기 위한 개념들,**
- **철학** : 합리주의 / 상대주의 : 모두가 동의하지만, 상황에 따라 달라질 수 있음
- 철학 위에 **가치**, **원칙**, **패턴**  
  - **가치** : 의사소통, 단순함, 유연함
  - **원칙** : 지역화, 중복제거, 대칭성(ex. get-set/add-remove ...)  
    (원칙의 가치는, 원칙을 정해놓으면 예외 발생 시 즉시 알 수 있음. 그러나 항상 지킬 때 노력이 필요하기에 신중해야 함)  
  - **패턴**(관습) : 개발론(함수지향, 객제지향 ... ), 설계론, 각종 적용 패턴
- **동기** : 돈(비용) / 시간

## Program & timing
### 컴파일 언어의 생명주기  

- ▼ **`language code`** (text file)     >>>    [ lint time ]    
  : lint time : compile 이전 에러 있을 법한 곳 잡음
- ▼ **`machine language`** (compiler, 번역)   >>>    [ compile time ]   
  : (어떻게 적재되지 않은 데이터(메모리 없음)를 컴파일하는가) virtual memory 기반으로 컴파일
- ▼ **`file`** 
- ▼ **`load`** (file을 메모리에 적재, 여기부터 프로그램이라고 말함)  
  : Vtable Mapping : 이 순간 컴파일 시 생성된 가짜 메모리(virtual memory)와 진짜 메모리와 맵핑함
- ▼ **`run`**   >>>    [ run time ]
- ■ **`terminate`**

++ context error : 런타임까지 걸리지 않은 논리적 오류. 코드에서는 문제가 없으나 의사소통에서 문제 있는 경우  
++ 런타임 에러의 경우, 에러 원인 찾기 어려움

**compile 시**
- (어떻게 적재되지 않은 데이터(메모리 없음)를 컴파일하는가) virtual memory 기반으로 컴파일  

**load 시**  
1) Esseintial definition loading : 중요한 애들 먼저
2) vtable mapping
3) run 
4) runtime definition loading : 런타임의 새로운 정의 로딩


## Script program
### 스크립트 언어의 생명주기

- ▼ **`language code`** (text file)     >>>    lint time
- ▼ **`file`** 
- ▼ **`load(file을 메모리에 적재)`**  
- ▼ **`machine language (compiler)`**
- ▼ **`run`**                           >>>    run time
- ■ **`terminate`**


#### run time
```
1) declare base function, class
2) declare extended function, class - -run time : 
3) use function, class
```
- 1-2 : 두개 비교 시, 1은 static time - 2는 runtime  
  2-3 : 두개 비교 시, 2은 static time - 3는 runtime
- 스크립트언어는 컴파일 타임이 없어서 레이어로 처리. 단계적으로 처리됨

> 컴퓨터 과학




## Run Time
: load 이후에 실행, 메모리에 적재되는 시점
- **Loading** --  Memory : 로딩 시 메모리에 명령과 데이터(값)으로 적재
- **Instruction Fetch & Decoding** -- CPU : 외부 버스 통해 들어와(fetch), 디코더로 디코딩(decoding), 제어정보(연산유닛)에서 연산 실행   
  1) 이순간 메모리에 적재되어 있던 값들이 데이터유닛으로 전달,   
  2) 제어정보로 넘어온 명령 데이터에 맞는 데이터를 제어정보로 전달하여 연산,  
  3) 제어정보에서 도출된 값을 다시 메모리에 적재
- **Execution**



## Memory, Address, Pointer, Variable, Dispatch
- dispatch: 주소로 부터 값을 얻음

개발 시 효율 위해 참조의 참조 사용하는 데 왜?  

메모리 모델
```
A = "test"
&A = 11 // 메모리 주소값

B = &A
*B = "test" // 메모리 주소값을 찾아 값을 찾음

C = B 
D = B

B = &K  // B의 배신. 직접 참조의 문제
```

**double dispatch**
- linked list 구조와 비슷한 개념
- 두번 쿠션 쳐서 값 얻어내기 때문에 객체 내 `value`가 변해도 `C`와 `D`는 유지됨
```
B = { value: &A, v: 3}
c = B
D = B

B.value = &K
```
- - - 
자 이제 자바스크립트

## Lexical Grammar 자바스크립트의 문법적(어휘적) 요소들 
- Control Character 제어문자
- White Space 공백문자 : 띄어쓰기류 문자
- Line Terminator 개행문자
- Comments 개행문자 : 주석
- Keyword 예약어
- Literals 리터럴 : 더이상 나눌 수 없는 최소단위 문자

## Language Element

### Statements 문 
- 공문, 식문, 제어문, 선언문 -- 단문, 중문
- 문은 실행기에게 주는 힌트  
- 처리할 뿐 메모리에 남지 않음. 변수에 할당할 수 없음
  ```js
  const a = if ( .. ) ... // X
  ```
- control statements(제어문)이라 부르기도(작은 개념)   
  - 문 대부분이 flow 제어를 하기 때문
- 종류 :  
  1) 공문 : 아무것도 없는 것 `;`
      ```js
      for(var i=0; i < 5; i++); // OK!
      ```
  2) 식문 (이후에)
  3) 제어문 : 흐름 제어 통해 사용
  4) 선언문 : 메모리상에 변수 할당하는 일(할당과 함께 v table 만들어짐)

  > **변수**   
  > : 변수란 메모리 주소, 타입, 크기 요소 들어 있음  `var`, `const`, `let`
  > 이 정보 합쳐서 v-table에 넣고, 실제 메모리에 적재됐을 때 이에 따라 프로그램 돌아가게 됨

  1) 단문 : 한 문장
  2) 중문 : 하나의 문이 들어갈 자리에 중괄호(`{ }`)로 묶은 문들이 들어감  
      중문에 들어가는 중괄호 뒤엔 세미콜론(`;`) 들어가지 않음. 세미콜론은 리터럴에서!  
      
      ```js
      var a, b
      if (true) a = 3; b = 3;
      if (true) { a = 3; b = 3; }

      if (true) a = 3; else b = 3; // 문의 구조 상 틀리지 않음! if-else는 문을 받음

      if (true) a = 3; else if (a>2) b = 3; else b = 5; // 관습적으로 쓰지만, 
      if (true) a = 3; else { if (a>2) b = 3; else b = 5; } // 이것과 같은 의미 
      ```

### Expression 식(== 값 / 값을 표현하는 여러가지 방법들) 

- 값식, 연산식, 호출식

- 식을 문으로 인정하는데, 그게 식문(하나의 식을 문으로 인정)
    ```js
    3;4;5; // 하나의 식을 문으로 인정하기 때문
    if (true) 3;
    ```
  1) 값식 : 값 자체
  2) 연산식 : 연산자 사용
  3) 호출식 : 호출
  
### Identifier 식별자(대부분 변수) 
- 기본형, 참조형 -- 변수, 상수


## Sync Flow 
- 동기화 로직/흐름
- 명령어의 해석 순서 : 오른쪽 > 왼쪽, 위 > 아래

## Flow Control
- sync flow를 제어문으로 제어문으로 흐름 제어
  : 조건문, 반복문 등으로 흐름 제어 가능

## Sub flow
- 일정 구문이 sync flow 여러 부분에서 필요한 경우, sub flow 생성하여 사용 
- 함수, 클래스 등 만들어 제어



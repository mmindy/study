# Sub Routine

## Sub routine flow
- sub routine <-> main routine : 두 개념은 상대적으로, 절대적이지 않음(관점, 기준에 따라 달라짐) -- 상대주의
- 합리주의 : 상대주의적인 관점을 어떻게 정의할지 합의를 이끌어 내는 것. 사회적 합의

**sub routine flow의 특징**
- 자신을 호출했던 main flow로 돌아감
- sub routine으로 갔다가 돌아오는 시점, 복귀 포인트가 있음  
  이는 sub routine을 호출할 때 복귀 포인트를 지정해둠
```js
const routineA = b => {
  const result = b * 2;
  console.log(result);
  return result;
};

const routineB = d => {
  const result = d * 3;
  console.log(result);
  return result;
};

const b = 10, d = 30;
const a = routineA(b);
console.log(a);
const c = routineB(d);
console.log(c);
```
- 여기서 볼 것은 function이 아니라, routine! (함수를 만드는 것은 sub routine을 만드는 것)
- `this`는 메소드를 만드는 것 = 메소드는 클래스 구문에서 메소드 문법으로 정의하는 것(ES6)

## Communicate with routine 
- argument / return 을 통해, main routine과 sub routine 간 값 주고 받음
- 연산은 스택 메모리를 생성하여 이전 값 기억하고, 다음 값과 연산함
  ```js
  const routineA = arg => {
    const result = arg * 2;
    return result;
  }
  const B = 10, C = 20, D = 30;
  const A = routineA(B) + routineA(C) + routineA(D)
  ```
- 이는 기본이 되는 방법, routine에서만 이러한 형태로 이루어짐 

## Sub routine in sub routine
- sub routine에서 새로운 sub routine을 호출하는 경우
- `keep`  
  - routine은 별도 메모리를 갖고 있어서 새로운 sub routine을 호출하여도 기존의 값을 기억해둔다.  
  - 여기서 기존 메모리를 기억해두는 것(메모리 스냅샷)을 keep이라고 함!

```js
const routineA = arg => routineB(arg*2);
const routineB = arg => arg * 3;

const b = 10;
const a = routineA(b);
```

- **함수의 스택 메모리, call stack**
  - routine 내에서 routine 호출할 경우, 각 routine 별 keep한 메모리들이 바로, call stack
  - routine 안에 routine이 얼마나 축적되어 있냐에 따라 call stack이 계속 쌓임. 이때 stack이 많이 쌓여 죽어버리는 현상이 stack overflow
  - return 통해 값 반환 시 하나씩 stack이 해지

## Value vs. Reference (값과 참조)
- 값 : 메모리상에서 전달될 때마다 복사  
  참조 : 메모리상에서 공유된 객체를 가리키는 포인트 복사

### main routine <-> sub routine 간 **'값'**을 주고 받을 때  
- 복사된 값을 주고 받기 때문에 routine 간 의존성 낮아짐
- 값(primative)은 언어별로 정의하는 것이 다름
- 하나의 routine이 여러 flow와 소통해도 의존성 x, side effect 발생 안 함 >> **상태 안전(state safe)**
```js
const routine = a => a * 2;
const flow1 = _ => {
  const b = 10, d = 20;
  const a = routine(b);
  const c = routine(d);
  return a + c;
};
const flow2 = _ => {
  const b = 30, d = 40;
  const a = routine(b);
  const c = routine(d);
  return a + c;
};
flow1();
flow2();
```

### main routine <-> sub routine 간 **'참조'**을 주고 받을 때  
- 참조를 넘겨서 sub routine에서 참조 값 변경할 경우, 복잡해짐 -- 권장하지 X!!
  ```js
  const routine = ref => ['a', 'b'].reduce((p,c) =>{
    delete p[c];
    return p;
  }, ref);
  const ref = { a:3, b:4, c:5, d:6 };
  const a = routine(ref);

  ref === a; // true
  ```

**아래의 방법들로 함수의 side effect 줄일 수 있음!**
- 값을 전달하는 것이 가장 안전하지만, 값을 전달할 수 없는 경우, 아래와 같은 방법으로 코드 작성

- 해결책 1. argument를 readonly로 만들어 작성! 
  ```js
  const routine = ({a,b, ...rest}) => rest;
  const ref = { a:3, b:4, c:5, d:6 };
  const a = routine(ref);
  ref !== a; // true
  ```
- 해결책2. local variables 생성 시, 새 객체 만듦
  ```js
  const routine = ref => ({ ...ref, e:7 });
  const ref = { a:3, b:4, c:5, d:6 };
  const a = routine(ref);;
  ref !== a; // true
  ```

  ## Structured design
  - 높은 응집도, 낮은 결합도

```
  **결합도**                 **응집도**
   content          |         coincidental
   common           |         logical
   external         |         temporal
   contral          |         procedural
   stamp            |         communicational
   data             ▽         functional
```

### 결합도 coupling
**1. content coupling 강결합** -- 좋지 않아!
- A 클래스 속성 v가 변경되면 즉시 B 클래스가 깨짐
```js
const A = class{
  constructor(v){
    this.v = v;
  }
};

const B = class {
  constructor(a) {
    this.v = a.v;
  }
}

const b = new B(new A(3));
```

**2. common coupling 강결합**
- common : 공용 클래스(전역 객체) > 우리가 만듦
- common 클래스 변경 시, 즉시 A B 클래스 깨짐
```js
const Common = class {
  constructor(v) {
    this.v = v;
  }
};

const A = class {
  costructor(c) {
    this.v = c.v;
  }
}

const B = class { 
  constructor(c) {
    this.v = c.v;
  }
};

const a = new A(new Common(3));
const b = new B(new Common(5));
```

**3. external coupling 강결합** 
- A, B 클래스는 외부의 정의에 의존함
- `member`의 json구조가 변경되면 깨짐
- 외부에서 주어지는 요소
- 불가피하게 짜는 경우가 많음. 회피 못함 >> 정복해야 함! > 관리대상
- 제일 좋은 방법 > `member.name`없을 경우 `thow` 던져버리기  
  강결합은 되도록 빨리 에러 던져야 함!
```js
const A = class {
  constructor(member) {
    this.v = member.name;
  }
};

const B = class {
  constructor(member) {
    this.v = member.age;
  }
};

fetch("/member").then(res => res.json()).then(member => {
  const a = new A(member);
  const b = new B(member);
});
```

**4. control coupling 강결합**
- 회피 방법 있음
- A 클래스 내부의 변화는 B 클래스의 오작동 유발 
- routine에게 직접 대상 객체 주지 않고, 대상 객체의 힌트 줄 경우 발생!
- 아래의 경우, flag변수가 하단 flow에 관여하여 강결합 발생  
  process 내 flag를 어디서 어떻게 가지고 있는지 몰라서 A 클래스 내부 변경 불가
- 팩토리 패턴에서 자주 발생하는 오류

```js
const A = class {
  process(flag, v) {
    switch(flag) {
      case 1: return this.run1(v);
      case 2: return this.run2(v);
      case 3: return this.run3(v);
    }
  }
};

const B = class {
  constructor(a) {
    this.a = a;
  }

  noop() {
    this.a.process(1);
  }

  echo(data) {
    this.a.process(2, data); // 여기서 '2'가 문제!
  }
};

const b = new B(new A());
b.noop();
b.echo("test");
```

**5. stamp coupling 강결합 or 유사약결합**
- A와 B는 ref로 통신함  
  ref에 의한 모든 문제가 발생할 수 있음
- counter 증가시키는 것이 복잡하여 counter 처리기(`this.counter.add(this.data)`) 따로 받아서 카운터 증가 위임
- A에게 넓은 범위로 주어서 문제 발생 > A에게는 `data.count`로 주었어야 함    
  A에서도 count key를 사용하고 있어서 B에서 count라는 key를 변경하지 못함
  **필요한 값(범위)만을 넘겨야 한다!**
```js
const A = class { 
  add(data) {
    data.count++;
  }
};

const B = class {
  constructor (counter) {
    this.counter = counter;
    this.data = { a:1, count:0 };
  }
  count() {
    this.counter.add(this.data);
  }
};

const b = new B(new A());
b.count();
b.count();
```

**6.data coupling 약결합**
- A와 B는 value로 통신함. 
- 모든 결합 문제에서는 자율워짐
- A는 숫자를 반환한다는 믿음 있음(남은 결합)

```js
const A = class { 
  add(count) {
    return count + 1;
  }
};

const B = class {
  constructor (counter) {
    this.counter = counter;
    this.data = { a:1, count:0 };
  }
  count() {
    this.data.count = this.counter.add(this.data.count);
  }
};

const b = new B(new A());
b.count();
b.count();
```

- **routine 간 대화할 때 reference가 아닌 value로 함으로써, 의존성 낮출 수 있음!!!!**
- `내가 얘 때문에 수정을 하지 못하는가`라는 관점에서 코드를 살피자!

### 응집성 cohesion

**1. coincidental**
- 아무런 관계가 없음. 다양한 이유로 수정됨
- 작성자 외에 알 수 없음. 우연히 임의로 만듦
```js
const Util = class {
  static isConnect() {}
  static log() {}
  static isLogin() {}
}
```

**2. logical**
- 사람이 인지할 수 있는 논리적 결합
- 언제나 일부만 사용됨
- 인식이 동등한 사람들만 인식할 수 있음
- 도메인이 특수할수록 logical은 치명적

```js
const Math = class {
  static sin(r) {}
  static coin(r) {}
  static random() {}
  static sqrt(v) {}
}
```

**3. temporal**
- 시간의 순서
- 시점을 기준으로 관계없는 로직을 묶음
- 관계가 아니라 코드의 순서가 실행을 결정
- 역할에 맞는 함수에게 위임해야 함

- `init()`메소드 내 순서의 우선순위 알 수 없음 - 결국 작성자의 로직
```js
const App = class{
  init() {
    this.db.init();
    this.net.init();
    this.asset.init();
    this.ui.start();
  }
}
```

**4. procedural**
- 외부에 반복되는 흐름을 대체하는 경우
- 순서정책 변화에 대응 불가
- 함께 의도한 순서. 순서도 의사코드

```js
const Account = class {
  login() {
    p = this.ptoken();
    s = this.stoken();
    if (!s) this.newLogin();
    else this.auth(s);
  }
}
```

**5. communicational**
- 하나의 대상에 대해 상호보완적으로 주제 처리
- 하나의 구조에 대해 다양한 작업이 모여 있음
- 역할 생각해볼 수 있음(책임과 권한)

- 일반적으로 하나의 객체가 하나의 역할을 수행하는 것이 이상적

```js
const Array = class {
  push(v) {}
  pop() {}
  shift() {}
  unshift() {}
}
```

**6. sequantial**
- 실행순서가 밀접하게 관계되며 같은 자료를 공유하거나 출력 결과가 연계됨
- procedural + communicational 결합 개념
```js
const Account = class {
  ptoken() {
    return this.pk || (this.pk = IO.cookie.get("ptoken"));
  }
  stoken(){
    if(this.sk) return this.sk;
    if(this.pk){
      const sk = Net.getSessionFromPtoken(this.pk);
      sk.then(v=>this.sk);
    }
  }
  auth(){
    if(this.isLogin) return;
    Net.auth(this.sk).then(v=>this.isLogin);
  }
}
```

**7. functional**
- 우리가 추구해야 할 코드
- 역할모델에 충실하게 단일한 기능이 의존성 없이 생성된 경우

- - -
- 높은 응집성과 낮은 결합성이 함께 공존하는 것은 어려움  
  높은 응집성을 가지면 높은 결합성 갖는 경우 多
- 비례하여 갖게 되기에 두개 동시에 달성할 수 없음.   
  따라서, **둘 사이 밸런스를 맞추어 서로 수용할 수 있는 코드를 만드는 것이 중요!**
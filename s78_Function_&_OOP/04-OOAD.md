# OOAD

- 대부분의 프론트 === 대화형 : 특정 이벤트에 반응하는 프로그램 방식
- 전체적인 흐름제어 X . 흐름에 맞춰 프로그램 반응 설계
- 이벤트 프로그램, 다이알로그 프로그램  
  : 로직 단편화돼 있음, 일관성 유지하기 위한 스킬 필요(프레임워크(ex. redux)지원되기도 함)

```
**오늘의 목표**   
- 난감한 도메인을 만났을 때 우리는 어떻게 데이터 분석해서 처리할 수 있는가  
- 또한, 데이터 분석의 결과가 객체지향이 될 수 있게!
```

### 객체지향을 위해 알아야 할 것 
- 객체지향은 추상화라는 영역에 포함  
- 객체지향 분석에서는 사물을 있는 그대로 객체로 받아들이는 것이 아니라, 추상화를 이해하고 추상화 기법을 사용하여 모델링함

#### 추상화
1. categorization : 일정 기준에 의해 분류
2. modeling : 특정 특징들을 포함해 모델링(기억해야 할 특징이 무엇인가!)
3. grouping(집합) : 가장 기초적인 추상화. categorization와 다른 이유는, 기준이 무작위적인 점  

#### 그렇다면, 무엇을 기준으로 객체지향 프로그래밍이라고 부르고, 어떤 걸 객체지향 시스템이라고 부르냐
(객체지향 언어의 필수요소)
1. 대체 가능성  
    - 보다 구상형은 추상형으로 대체할 수 있다  
      (=== 자식이 부모 대체할 수 있다, 구상클래스가 인터페이스/추상클래스 대체 가능하다)
    - 나를 보다 큰 카테고리/모델링으로 변형해도 내가 그 자리에 대체할 수 있어!  
    - 상속, 위임 등을 가능하게 만드는 개념
2. 내적 동질성(일관성)
    - 처음 만들었을 때의 원형이 무엇인가! 
    - overwrite된 속성은 만들어진 구상객체을 사용한다

#### 객체 지향에서 객체를 여러개 만들 때, 객체 간 지켜야 할 규칙
(객체지향 언어의 선택요소)
1. 은닉(hiding)
    - 숨기는 것 / 어디까지 보이고, 숨길 것인가
    - 이상적 : 아무것도 안 보여주는 것
2. 캡슐화
    - 은닉과는 상관 없음
    - 캡슐화의 목적은 외부에 정보를 노출하지 않는 것. 
    - 상대방이 몰라도 되는 이상, 알려주지 않고 추상화된 행위만 알려줌. 가장 모르는 수준까지 알려줌


## Tetris
- 실시간으로 일어나는 일을 자동으로 처리함 > 시간이라는 flow에 맞춰 통제  

**필요할 법한 객체 후보**
```
Game : 게임 본체
 | 
 |   |-> Stage : 현재 스테이지 정보
 |-- |-> Score : 점수 및 계산법
 |   |-> Block : 범용 블록 정보
 |
 |-> Panel : 범용 패널  
 |      |- Start : 시작화면
 |      |- Stage End : 스테이지 종료
 |      |- Dead : 죽음
 |      |- Clear : 클리어
 |      |- Report : 결과 화면
 |
 |-> Data : 게임↔렌더링 간 프로토콜
        ↑
        |- Renderer : 범용 렌더링 처리기
```
- 본인의 고유한계와 책임 역할이 있을 것 (**역할, 책임, 권한**이 동시에 부여됨)
- 단방향 의존성(simplex, 단방향 참조)이 이상적!   
  양방향 의존성(multiplex, 양방향 참조)일 경우, 객체지향 무너짐


### Stage : 현재 스테이지 정보

Stage 전에 utils 먼저 정의하기!

```js
const prop = (target, v) => Object.assign(target,v); // 속성 정의
```

이제 Stage

```js
const Stage = class {
  // args: 마지막 판, 최소 속도, 최대 속도, 자신의 변화를 통보받음
  constructor(last, min, max, listener) { 
    prop(this, {last,min,max,listener});
  }

  clear() { // 상태 초기화
    this.curr = 0;
    this.next(); // 초기화 시작
  }

  next() { // 판이 올라가면 판의 스피드 설정하는 일을 함
    if (this.curr++ < Stage.last) { // this.curr 증가
      const rate = (this.curr - 1) / (this.last -1);
      this.speed = this.min + (this.max - this.min) + (1-rate); // 판이 올라갈 때마다 빨라짐
      this.listener(); // this.curr 올라간 것 외부에 통보 -- listener는 함수
    }
  }
}
```
생각해볼 것
- `판이 올라가면 스피드가 올라간다`는 설정을 누가 갖고 있어야 하는가! -- **Game vs. Stage**  
  : 지금은 Stage가 갖고 있다고 보는 것! 현재 스테이지 값(`this.curr`)은 Stage가 갖고 있기 때문에   
  : 자기 속성 바탕으로 스피드 결정 하는 것이기 때문  
  : 현재 스테이지 값을 은닉, 스피드 설정을 캡슐화  

**`Stage`의 책임**
1. 스테이지가 끝까지 왔냐 안왔냐
2. 스테이지가 끝이 아니라면, 한판 올려주고 거기에 맞는 스피드 부여
3. clear 기능

**`listener`의 역할**
- 해당 클래스의 값을 외부에 통보하는 역할 
- stage나 score 등 게임 환경 값이 변경됐을 때, 게임 화면 바뀌어야 하는데 이러한 값들을 게임 패널에게 전달하는 역할!!
- 데이터

### Score : 점수 및 계산법 
```js
const Score = class {
  constructor(listener) {
    prop(this, {listener})
  }

  clear() { this.curr = this.total = 0; }

  // 몇줄지웠느냐(줄 수에 따라 보상체계 다름), 이번에 지워진 것에 대한 점수체계(stage에 따라 체계 달라지기 때문)
  add(line, stage) {  
    const score = stage.score(line); // stage에 score 값 위임 + 협력, 현재 stage를 Score가 모르기 때문!
    this.curr += score;
    this.total =+ score;
    this.listener();
  }
} 

const Stage = class {
  // ...

  score(line) {
    return parseInt((this.curr * 5) * 2 (2 ** line));
  }
}
```
포인트
- `const score = stage.score(line)`   
  : score지정을 Stage 클래스에 위임하여, Score 내부 로직 건들이지 않고, 값 받아옴  
  : `score`의 기반이 되는 현재 판(`this.curr`)에 대한 정보를 `Stage`가 갖고 있기 때문

- `const score = stage.score(line)`이러한 결합은 비교적 약결합(점수를 더할 때마다 임시적으로 stage와 결합)  
  : `add`할 때마다 `stage` 새로 주입한다는 의미
- 게임이 시작하면 `Score`와 `Stage`는 항구적인 관계
  \> 따라서 `Score` 선언 시 `Stage` 주입하여 항구적 관계 생성  
  \> `stage`를 인자로 받지 않고 컨텍스트 변수로 바꿀 것!! -- `const score = this.stage.scroe(line)`  


> 객체지향 프로그래밍
> - context : instance 마다 고유하게 부여된 메모리
> - 함수와 다르게, 인자로 이 값을 가져올지, context로 가져올지 고민
> 
> 함수지향 프로그래밍 
> - 상태유지 : 자유변수 통해 유지 
> - 자유변수 유지하려면 새로운 함수 생성 필요 - 함수가 태어날 떄 자유변수 인식하기 때문


```js
const Score = class {
  constructor(listener) {
    prop(this, {listener})
  }

  clear() { this.curr = this.total = 0; }

  add(line, stage) {  
    const score = this.stage.score(line);
    this.curr += score;
    this.total =+ score;
    this.listener();
  }
} 

const Stage = class {
  // ...

  score(line) {
    return parseInt((this.curr * 5) * 2 (2 ** line));
  }
}
```

### Block : 범용 블록 정의

- 모든 블록은 row/column 지닌 2차원 배열

```js
const Block = class {
  constructor(color) {
    prop(this, {color, rotate:0});
  }

  left() {  // CCW
    if (--this.rotate < 0) this.rotate = 3;
  }

  right() { // CW
    if (++this.rotate > 3) this.rotate = 0;
  }

  getBlock() {
    throw 'override!'; // 자식들이 오버라이드 하길 바라고 throw 던짐!
  }
}

const blocks = [ class extends Block, .... ];
```
- 추상화 : 공통적인 것 카테고라이즈 하여 추출 -> 여기서는 `left()`, `right()`


이제 그렇다면, 자식들인 `blocks`를 이어서 만들어 보자
```js
const blocks = [
  class extends Block {
    constructor() {
      super('#f8cbad');  // 개별 블록 색상 지정
    }

    getBlock() {
      return this.rotate % 2 ?
        [[1],[1],[1],[1]] :
        [[1,1,1,1]]; 
    }
  }
];
```

- 부모의 `rotate`를 자식이 사용. 캡슐,은닉화 실패
- 개별 블록의 배열 정보는 정적 데이터인데, 블록이 생성될 때마다 배열 생성됨.
- 이러한 정보들은 컨텍스트 정보로 넘어와야 함
```js
const Block = class {
  constructor(color, ...blocks) {
    prop(this, {color, rotate:0, blocks, count:blocks.length-1});
  }

  left() {  // CCW
    if (--this.rotate < 0) this.rotate = count;
  }

  right() { // CW
    if (++this.rotate > count) this.rotate = 0;
  }
ssh
  getBlock() {
    return this.blocks[this.rotate];
  }
}

const blocks = [
  class extends Block {
    constructor() {
      super('#f8cbad',
        [[1],[1],[1],[1]],
        [[1,1,1,1]]  )
    }
  }
];
```

```js
const Renderer = class {
  constructor(col, row) {
    prop(this, {col, row, blocks:[]});
    while(row--) {
      this.blocks.push([]);
    }
  }

  // 내적동질성에 의해 자식이 clear 구현. 자식 하나하나 인식X 부모로 보고 싶어서 대체가능성에 의해 clear 메소드 만들어 놓음
  // 어떤 자식이 와도 clear 호출 가능하지만, 호출 시 내적동질성 의해 자식의 clear 메소드 호출됨
  clear() { throw 'override'; } 

  // render는 부모꺼를 쓰지만 내적동질성에 의해, _render는 자식 메소드를 쓰게 됨
  // 이게 템플릿 메소드 패턴
  render(data) {
    if (!(data instanceof Data)) throw 'invalid data';
    this._render(data);
  }

  _render(data) {throw 'override';}
}

const Data = class extends Array {
  constructor (row, col) { prop(this, {row, col})}
}
```

util 추가
```js
const el = el => document.createElement(el);
const back = (s,v) => s.backgroundColor = v;
```

- 적층용 렌더링 : 클릭 과정에 따라 변화 렌더링 하기 쉽지만(순서대로 구현하지 않으면  재현할 수 없음),   
  모델 렌더링 : 클릭 시 데이터 변경 후 전체 렌더링하여 언제나 모델하고 일치한 그림 그릴 수 있음!(??)

**도메인 패턴**
- 도메인 객체와 네이티브 객체를 분리하여, 네이티브 환경에 따라 도메인 객체 재활용 가능  
  (DOM, WebGL, Canvas.. )

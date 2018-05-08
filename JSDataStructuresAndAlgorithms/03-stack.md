# 3. 스택(Stack)

- 스택은 **LIFO(Last In First Out, 후입선출) 원리에 따라 정렬된 컬렉션(ordered collection)**
- 스택의 자료는 항상 동일한 종단점(end point, terminal point)에서 추가/삭제 됨
- 스택은 프로그래밍 언어의 컴파일러에서도 사용하는 자료 구조로서, 변수나 메소드 호출을 컴퓨터 메모리로 저장할 때 쓰임

## 스택 만들기
```js
// 기본적인 틀 선언
function stack() {
  // 스택의 원소 담아둘 자료 구조 배열로 선언
  var items = [];
  
  // 프로퍼티와 메서드 선언 부분  
}
```

**스택 구현 시 필요한 메서드들**
- `push()` : 스택 꼭대기에 새 원소(들) 추가함
- `pop()` : 스택 꼭대기에 있는 원소 반환 & 해당 원소 스택에서 삭제
- `peek()` : 스택 꼭대기에 있는 원소를 반환하되 스택은 변경하지 않음(원소 삭제X, 스택 참조용으로 사용됨)
- `isEmpty()` : 스택 원소 여부 반환(원소 없으면 `true`, 스택 크기 0보다 크면 `false` 반환)
- `clear()` : 스택의 모든 원소 삭제
- `size()` : 스택의 원소 개수 반환(배열의 `length`프로퍼티와 비슷)


```js
// 기본적인 틀 선언
function Stack() {
  // 스택의 원소 담아둘 자료 구조 배열로 선언
  var items = [];
  
  this.push = function(element) {
    items.push(element);
  }
  this.pop = function() {
    return items.pop();
  }
  this.peek = function() {
    return items[items.length-1];
  }
  this.isEmpty = function() {
    return items.length == 0;
  }
  this.size = function() {
    return items.length;
  }
  this.clear = function() {
    items = [];
  }
  this.print = function() {
    console.log(items.toString());
  }
}
```

## 스택 클래스 사용
```js
var stack = new Stack();
stack.isEmpty(); // true

stack.push(5); // [5]
stack.push(8); // [5,8]

stack.peek(); // 8

stack.push(11); // [5,8,11]

stack.size(); // 3
stack.isEmpty(); // false

stack.push(15); // [5,8,11,15]

stack.pop();  // [5,8,11]
stack.pop();  // [5,8]
stack.size(); // 2
stack.print(); // "5,8"
```

## 10진수에서 2진수로 변환
- 컴퓨터는 모든 것을 0과 1, 이진수로만 표시하므로, 컴퓨터 과학에서는 2진법 표시가 중요함
- 10진수를 2진수로 바꾸려면, 나눗셈 목이 0이 될 때까지 2로 나누면 됨
```js
function divideBy2(decNumber) {
  var remStack = new Stack(),
      rem,
      binaryString = "";
  
  while (decNumber > 0) { // 나눗셈 몫이 0이 아닐 때까지
    rem = Math.floor(decNumber % 2);
    remStack.push(rem); // 나머지는 stack에 밀어 넣고,
    decNumber = Math.floor(decNumber / 2);  // decNumber는 스스로를 2로 나눈 몫(정수)으로 업데이트
  }
  while ( !remStack.isEmpty() ) { // stack이 빌 때까지,
    binaryString += remStack.pop().toString();  // 원소를 문자로 연결
  }

  return binaryString;
}
```
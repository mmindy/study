# 큐(Queue)

- 큐는 **FIFO(Fisrst In First Out, 선입선출) 원리에 따라 정렬된 컬랙션**
- 새 원소는 뒤로 들어가서 앞에서 빠져나가는 구조로, 마지막에 추가된 원소는 큐의 뒷부분에서 제일 오래 기다려야 함
- 출력물 인쇄 대기, 매표소 줄서기 등과 비슷한 구조

## 큐 만들기
```js
function Queue() {
  // properties and methods
  var items = [];
}
```

**큐에서 사용되는 메서드**
- `enqueue()` : 큐의 뒤쪽에 원소 추가
- `dequeue()` : 큐의 첫 번째 원소(큐의 맨 앞에 위치한 원소) 반환하고 큐에서 삭제
- `front()` : 큐의 첫 번째 원소를 반환하되, 큐 자체 변동X (참조용)
- `isEmpty()` : 큐가 비어 있으면 `ture`, 그 외에는 `false`
- `size()` : 큐의 원소 개수 반환(= 배열의 `length`)

```js
function Queue() {
  var items = [];

  this.enqueue = function(element) {
    items.push(element);
  }
  this.dequeue = function() {
    return items.shift();
  }
  this.front = function() {
    return items[0];
  }
  this.isEmpty = function() {
    return items.length == 0;
  }
  this.size = function() {
    return items.length;
  }
  this.print = function() {
    console.log(items.toString());
  }
}
```

## Queue 클래스 사용
```js
var queue = new Queue();
queue.isEmpty(); // true

queue.enqueue("John"); // ["john"]
queue.enqueue("Jack"); // ["john", "Jack"]
queue.enqueue("Camila"); // ["john", "Jack", "Camila"]

queue.print(); // "john", "Jack", "Camila"
queue.size(); // 3
queue.isEmpty(); // false

queue.dequeue(); // ["Jack", "Camila"]
queue.dequeue(); // ["Camila"]

queue.print(); // "Camila"
```

## 우선순위 Queue(Priority Queue)
- 큐 개념은 과학뿐 아니라 일상생활에서도 많이 쓰이는 개념
- **우선순위 큐**란 원소가 우선순위에 따라 추가/삭제됨. 우선순위를 설정하여 원소를 정확한 위치에 추가하고, 우선순위에 따라 삭제됨

```js
function PriorityQueue() {
  var items = [];

  function QueueElement(element, priority) {
    this.element = element;
    this.priority = priority;
  }

  this.enqueue = function(element, priority) {
    var queueElement = new QueueElement(element, priority);

    if (this.isEmpty()) {
      items.push(queueElement);
    } else {
      var added = false;
      for (var i=0; i<items.length; i++) {
        if ( queueElement.priority < items[i].priority) {
          items.splice(i,0,queueElement);
          added = true;
          break;
        }
      }

      if (!added) {
        items.push(queueElement);
      }
    }
  };

  this.dequeue = function() {
    items.shift();
  }
  this.front = function() {
    return items[0];
  }
  this.isEmpty = function() {
    return items.length == 0;
  }
  this.size = function() {
    return items.length;
  }
  this.print = function() {
    console.log(items);
  }
}
```
```js
var priorityQueue = new PriorityQueue();
priorityQueue.enqueue("John",2);
priorityQueue.enqueue("Jack",1);
priorityQueue.enqueue("Camila",1);

priorityQueue.print();
```

## 환형 큐(Circular Queue, 뜨거운 감자 게임)
- 환형 큐는 기본 큐의 변형으로, "뜨거운 감자 게임"이 대표적인 예
- 뜨거운 감자 게임이란, 원을 그리고 서 있는 아이들이 뜨거운 감자를 옆 사람에게 빠르게 전달하다가 갑자기 모두 동작을 멈추고 그때 감자를 손에 들고 있는 아이가 벌칙으로 퇴장하는 게임으로 최후 1인이 승자가 됨

```js
function hotPotato(nameList, num) {
  var queue = new Queue();

  for (var i = 0; i < nameList.length; i++) {
    queue.enqueue(nameList[i]);
  }

  var eliminated = "";
  while ( queue.size() > 1) {
    for ( var i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue());
    }

    eliminated = queue.dequeue();
    console.log(`${eliminated} 을/를 뜨거운 감자 게임에서 퇴장시킵니다`);
  }

  return queue.dequeue();
}

var names = ["John", "Jack", "Camila", "Ingrid", "Carl"];
var winner = hotPotato(names, 7);
console.log(`승자는 ${winner}`);
```

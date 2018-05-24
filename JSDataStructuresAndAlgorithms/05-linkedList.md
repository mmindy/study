# 5. 연결 리스트(Linked List)

- 연결 리스트는 동적 자료 구조여서, 필요할 때마다 원소를 추가/삭제할 수 있음
- 배열(리스트)의 장단
  - 가장 많이 쓰는 자료 구조 / 원소에 대한 접근이 편리(대괄호에 인덱스만 넣어주면 접근 가능)
  - 프로그래밍 언어마다 구현 방식 다름 / 크기 고정 & 배열 끝, 중간에 새 원소 넣으려면 다른 원소 옮겨야 하는 복잡한 잡업 필요(JS 메서드 이면에 벌어지는 일)
- 그에 대한 대안, 연결 리스트
  - 배열처럼 차례대로 저장하지만, 원소들이 메모리상 연속적으로 위치하지 않음
  - 각 원소는 **자신과 다음 원소 가리키는 참조 정보(포인터, 링크와 같은말) 포함된 노드(node)로 구성**
  - **원소 추가/삭제 시, 다른 원소들을 이동하지 않아도 됨**
  - But, 배열은 인덱스 통해 원소로 바로 접근 가능하지만, 연결 리스트는 원소 찾을 때까지 처음(head)부터 루프 반복해야 함


## 연결리스트 만들기
```js
// linked list 의 핵심부분
function LinkedList() {
  var Node = funtion(element) {
    this.element = element;
    this.next = null;
  };

  var length = 0;
  var head = null;

  this.append = function(element) {};
  this.insert = function(position, element) {};
  this.removeAt = function(position) {};
  this.remove = function(element) {};
  this.indexOf = function(element) {};
  this.isEmpty = function() {};
  this.size = function() {};
  this.toString = function() {};
  this.print = function() {};
}
```

**LinkedList 구현 시 필요한 메서드**
- `append(원소)` : 리스트 맨 끝에 원소 추가
- `insert(위치, 원소)` : 해당 위치에 원소 삽입
- `remove(원소)` : 원소 삭제
- `indexOf(원소)` : 해당 원소의 인덱스 반환. 존재 안 할 경우 -1 반환
- `removeAt(위치)` : 해당 위치 원소 삭제
- `isEmpty()` : 원소 하나도 없으면 `true`, 그 외엔 `false`
- `size()` : 원소 개수 반환
- `toString()` : 연결 리스트는 원소를 노드에 담아두기 때문에, 값만 출력하려면 기존 객체에서 상속한 `toString`메서드 재정의해야 함

### 리스트 끝에 원소 추가하기
```js
// linked list 의 핵심부분
function LinkedList() {
  var Node = function(element) {
    this.element = element;
    this.next = null;
  };

  var length = 0;
  var head = null;
  
  ///
  this.append = function(element) {
    var node = new Node(element);
    var current;

    if (head === null) {
      head = node;
    } else {
      current = head;
      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }

    length++;
  };
  ///
  this.insert = function(position, element) {};
  this.removeAt = function(position) {};
  this.remove = function(element) {};
  this.indexOf = function(element) {};
  this.isEmpty = function() {};
  this.size = function() {};
  this.toString = function() {};
  this.print = function() {};
}
```

```js
var list = new LinkedList();
list.append(11);
list.append(15);
```

### 원소 삭제
삭제하려는 원소가 리스트의 첫번째 원소인지 아닌지에 따라 두 가지로 정의.
- 1_원소 위치 기준 삭제 / 2_원소 값 기준 삭제

#### 원소 위치 기준 삭제 `removeAt(위치)`
```js
function LinkedList() {
  var Node = function(element) {
    this.element = element;
    this.next = null;
  };

  var length = 0;
  var head = null;
  
  this.append = function(element) {
    var node = new Node(element);
    var current;

    if (head === null) {
      head = node;
    } else {
      current = head;
      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }

    length++;
  };

  ///
  this.removeAt = function(position) {
    // 범위 안의 값인지 체크
    if (position > -1 && position < length) {
      var current = head;
      var previous;
      var index = 0;

      if (position === 0) {
        head = current.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        previous.next = current.next;
      }
      
      length--;
      return current.element;

    } else {
      return null;
    }  
  };
  ///

  this.insert = function(position, element) {};
  this.remove = function(element) {};
  this.indexOf = function(element) {};
  this.isEmpty = function() {};
  this.size = function() {};
  this.toString = function() {};
  this.print = function() {};
}
```

### 임의의 위치에 원소 삽입하기
```js
function LinkedList() {
  var Node = function(element) {
    this.element = element;
    this.next = null;
  };

  var length = 0;
  var head = null;
  
  this.append = function(element) {
    var node = new Node(element);
    var current;

    if (head === null) {
      head = node;
    } else {
      current = head;
      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }

    length++;
  };

  this.removeAt = function(position) {
    // 범위 안의 값인지 체크
    if (position > -1 && position < length) {
      var current = head;
      var previous;
      var index = 0;

      if (position === 0) {
        head = current.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        previous.next = current.next;
      }
      
      length--;
      return current.element;

    } else {
      return null;
    }  
  };

  ///
  this.insert = function(position, element) {
    if (position >= 0 && position <= length) {
      var node = new Node(element);
      var current = head;
      var previous;
      var index = 0;

      if (position === 0) {
        node.next = current;
        head = node;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        node.next = current;
        previous.next = node;
      }

      length++;

      return true;
    } else {
      return false;
    }
  };
  ///
  this.remove = function(element) {};
  this.indexOf = function(element) {};
  this.isEmpty = function() {};
  this.size = function() {};
  this.toString = function() {};
  this.print = function() {};
}
```

### 그 밖의 메소드 구현
```js
function LinkedList() {
  var Node = function(element) {
    this.element = element;
    this.next = null;
  };

  var length = 0;
  var head = null;
  
  this.append = function(element) {
    var node = new Node(element);
    var current;

    if (head === null) {
      head = node;
    } else {
      current = head;
      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }

    length++;
  };

  this.removeAt = function(position) {
    // 범위 안의 값인지 체크
    if (position > -1 && position < length) {
      var current = head;
      var previous;
      var index = 0;

      if (position === 0) {
        head = current.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        previous.next = current.next;
      }
      
      length--;
      return current.element;

    } else {
      return null;
    }  
  };

  this.insert = function(position, element) {
    if (position >= 0 && position <= length) {
      var node = new Node(element);
      var current = head;
      var previous;
      var index = 0;

      if (position === 0) {
        node.next = current;
        head = node;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        node.next = current;
        previous.next = node;
      }

      length++;

      return true;
    } else {
      return false;
    }
  };
  
  ///
  this.toString = function() {
      var current = head;
      var string = "";

      while ( current ) {
        string += current.element;
        current = current.next;
      }

      return string;
  };

  this.indexOf = function(element) {
    var current = head;
    var index = -1;

    while (current) {
      if (element === current.element) {
        return index;
      }

      index++;
      current = current.next;
    }

    return -1;
  };

  this.remove = function(element) {
    var index = this.indexOf(element);
    return this.removeAt(index);
  };

  this.isEmpty = function() {
    return length === 0;
  };
  this.size = function() {
    return length;
  };
  this.getHead = function() {
    return head;
  }
  this.print = function() {};
  ///  
}
```
## 이중 연결 리스트(Doubly Linked List)

- 연결 리스트는 다음 노드의 연결 정보만 갖고 있지만, 이중 연결 리스트는 다음 노드와 이전 노드 2개의 연겨 정보를 이중으로 갖음

**이중 연결 리스트에서 달라지는 것**

```js
function DoublyLinkedList() {
  var Node = function(element) {
    this.element = element;
    this.next = null;
    this.prev = null; // NEW
  }

  var length = 0;
  var head = null;
  var tail = null; // NEW 마지막 원소

  // 메소드 서술
}
```

- 이중 연결 리스트에서는 처음에서 끝, 끝에서 처음, 양방향으로 리스트 순회가 가능함   
  (어떤 노드의 이전/이후 노드를 찾아갈 수 있음)
- 단방향인 연결 리스트(순회 시 원소 찾지 못하면 맨 처음으로 돌아가야함)와 비교하여 강점 갖음

### 임의의 위치에 원소 삽입하기

```js
///
  this.insert = function(position, element) {
    // 범위 값 확인
    if (position >= 0 && position <= length) {
      var node = new Node(element);
      var current = head;
      var previous;
      var index = 0;

      if (position === 0) { // 첫번째 위치에 추가
        if (!head) { // NEW
          head = node;
          tail = node;
        } else {
          node.next = current;
          current.prev = node; // NEW
          head = node;
        }
      } else if (position === length) { // NEW 마지막 원소
        current = tail;
        current.next = node;
        node.prev = current;
        tail = node;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        node.next = current;
        previous.next = node;
        current.prev = node; // NEW
        node.prev = previous; // NEW
      }

      length++;
    
      return true;
    
    } else {
      return false;
    }
  }
///
```

### 원소 삭제
```js
///
  this.remove = function(position) {
    // 범위 값 확인
    if ( position > -1 && position < length ) {
      var current = head;
      var previous;
      var index = 0;

      // remove first element
      if ( position === 0 ) {
        head = current.next; 

        if (length === 1) {
          tail = null;
        } else {
          head.prev = null;
        }
      } else if ( position === length - 1) {
        current = tail;
        tail = current.prev;
        tail.next = null
      } else {
        
        while ( index++ < position ) {
          previous = current; 
          current = current.next;
        }

        previous.

      }
    }
  }
///
```
# 8. 트리(tree) 

- 비순차적 자료 구조
- 계층 구조(hierarchical structure)를 추상화한 모델
- ex. 가계도, 조직도 등

## 트리 용어
![tree](./images/08_tree.jpg)
- 노드 : 트리의 원소
- 루트(Root) : 트리 내 최상위 노드
- 내부 노드 (internal node) : 자식노드가 하나 이상인 노드
- 외부 노드 (external node) : 자식노드가 없는 노드
- 서브 트리 (subtree) : 노드와 후손으로 구성된 트리
- 노드의 깊이 (depth) : 조상의 개수
- 트리의 높이 (height) : 레벨(level)로 구분하기도 하며, root = 0부터 시작하는 높이

## 이진 트리와 이진 탐색 트리
**이진트리(binary tree)**
- 노드는 좌우에 하나씩 최대 2개의 자식노드를 갖음
- 노드의 삽입, 조회, 삭제를 효과적으로 수행할 수 있어서 컴퓨터 과학에서 폭넓게 사용되고 있음

**이진 탐색 트리(binary search tree)**
- 이진 트리의 변형으로 좌측 자식 노드에는 더 작은 값을, 우측 자식 노드에는 더 큰 값을 들고 있음

### BinarySearchTree 클래스 만들기
```js
function BinarySearchTree () {
  var Node = funciton(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }

  var root = null;
}
```

**트리 구현 시 필요한 메서드**
- `insert(키)` : 새 키를 삽입
- `search(키)` : 해당 키를 가진 노드 존재 여부 반환(true/false)
- `inOrderTraverse` : 중위 순회(in-order traverse) 방식으로 트리의 전체 노드 방문
- `preOrderTraverse` : 전위 순회(pre-order traverse) 방식으로 트리의 전체 노드 방문
- `postOrderTraverse` : 후위 순회(post-order traverse) 방식으로 트리의 전체 노드 방문
- `min` : 트리의 최소 값/키 반환
- `max` : 트리의 최대 값/키 반환
- `remove(키)` : 해당 키 삭제


### 트리에 키 삽입하기
```js

function BinarySearchTree () {
  var Node = funciton(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }

  var root = null;

  var insertNode = function(node, newNode) {  // 프라이빗 헬퍼 함수
    if (newNode.key < node.key) { // key값 비교,현재 노드보다 작은 경우
      if (node.left === null) {
        node.left = newNode;
      } else {
        insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        insertNode(node.right, newNode);
      }
    }
  };
  
  this.insert = function(key) {
    var newNode = new Node(key); // Node instance 생성 및 포인터 초기화

    if (root === null) {  // 추가할 key가 해당 트리 최초의 노드일 경우 root로 세팅
      root = newNode;
    } else {  // 아닐 경우 프라이빗 헬퍼 함수 호출
      insertNode(root, newNode);
    }
  }
}

```

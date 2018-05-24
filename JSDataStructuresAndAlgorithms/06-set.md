
# 6. 집합(set) 

- **집합은 정렬되지 않은(unordered) 컬렉션으로 원소는 반복되지 않음(중복 원소x)**
- **널 집합(null set) == 공 집합(empty set)** : 원소가 하나도 없는 집합
- 종류 : 합집합(union), 교집합(intersection), 차집합(difference)

## 집합 만들기
- 집합은 ES6 `Set()`과 같은 개념

```js
function Set() {
  var items = {};
}
```

**`Set()`에서 구현할 메소드들**
- `add(원소)` : 원소 추가
- `remove(원소)` : 원소 삭제
- `has(원소)` : 특정 원소가 해당 집합에 포함되었는지 여부 반환(`true`/`false`)
- `clear()` : 모든 원소 삭제
- `size()` : 원소 개수 반환(배열 length 프로퍼티)
- `values()` : 집합의 모든 원소 배열로 반환

### has(원소) 메서드

```js
// 방법 1 
function Set() {
  var items = {};

  this.has = function(value) {
    return value in items;
  }
}

// 방법 2 
function Set() {
  var items = {};

  this.has = function(value) {
    return items.hasOwnProperty(value);
  }
}
```


### `add()` 메소드
```js
function Set() {
  var items = {};

  this.has = function(value) {
    return items.hasOwnProperty(value);
  }

  this.add = function(value) {
    if (!this.has(value)) {
      items[value] = value;
      return true;
    }
    return false;
  }
}
```
- key와 value를 같게 넣는 이유는 나중에 찾기 편하게 하기 위함


### `remove()`와 `clear()` 메소드
```js
function Set() {
  var items = {};

  this.has = function(value) {
    return items.hasOwnProperty(value);
  }

  this.add = function(value) {
    if (!this.has(value)) {
      items[value] = value;
      return true;
    }
    return false;
  }

  this.remove = function(value) {
    if (this.has(value)) {
      delete items[value];
      return true;
    }

    return false;
  }

  this.clear = function() {
    items = {};
  }
}
```

### `size()` 메소드
**`size()` 메소드 구현 방법**
1. `length` 변수로 `add()`와 `remove()` 시 값 바꿔줌
2. `Object` 클래스 내장 함수 `Object.keys()`이용   
  > `Object.keys()` : ES5이상, 객체의 모든 프로퍼티를 배열로 변환
3. `items`을 반복문으로 순회하며 개수 셈  
  ```js
  this.sizeLegacy = function() {
    var count = 0;
    for (var prop in items) {
      if ( items.hasOwnProperty(prop)) count++;
    }
    return count;
  }
  ```

```js
function Set() {
  var items = {};

  this.has = function(value) {
    return items.hasOwnProperty(value);
  }

  this.add = function(value) {
    if (!this.has(value)) {
      items[value] = value;
      return true;
    }
    return false;
  }

  this.remove = function(value) {
    if (this.has(value)) {
      delete items[value];
      return true;
    }

    return false;
  }

  this.clear = function() {
    items = {};
  }

  this.size = function() {
    return Object.keys(items).length;
  }
}
```

### `value()` 메소드

```js
function Set() {
  var items = {};

  this.has = function(value) {
    return items.hasOwnProperty(value);
  }

  this.add = function(value) {
    if (!this.has(value)) {
      items[value] = value;
      return true;
    }
    return false;
  }

  this.remove = function(value) {
    if (this.has(value)) {
      delete items[value];
      return true;
    }

    return false;
  }

  this.clear = function() {
    items = {};
  }

  this.size = function() {
    return Object.keys(items).length;
  }

  this.values = funtion() {
    return Object.keys(items);
  }
}
```

```js
this.valueLegacy  = function() {
  var keys = [];
  for (var key in items) {
    keys.push(key);
  }

  return keys;
}
```

## Set 클래스 사용
```js
var set = new Set();

set.add(1);
set.values(); // [1]
set.has(1); // true
set.size(); // 1

set.add(2);
set.values(2); // [1,2]
set.has(2); // true
set.size(); // 2

set.remove(2); 
set.remove(1);
```


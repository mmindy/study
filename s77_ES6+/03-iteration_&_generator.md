# Iteration & Generation

: js에서 loop를 구현하는 것들  

들어가기에 앞서, **Interface in JS**를 이해해 보자

## Interface
1. Interface란 사양에 맞는 값과 연결된 속성키의 세트
2. 어떤 Object라도 Interface의 정의를 충족시킬 수 있다
3. 하나의 Object는 여러개의 인터페이스를 충족시킬 수 있다

### Interface test
1. test라는 키를 갖고
2. 값으로 문자열 인자를 1개 받아 불린 결과를 반환하는 함수가 온다 
    ```js
    {
      test(str){ return true; }
    }
    ```

## Iterator Interface
아래 사항을 만족시키면 Iterator Interface에 해당, iterator 객체  
1. next라는 키를 갖고
2. 값으로 인자 받지 않고 `IteratorResultObject`를 반환하는 함수가 온다 -- `IteratorResultObject`도 interface로 정의가 필요함
3. `IteratorResultObject`는 `value`와 `done`를 갖고 있다
4. 이중 `done`은 계속 반복 할 수 있을지에 따라 불린값 반환한다
```js
{
  next() {
    return { value:1, done:false }
  }
}
```

```js
{
  data : [1,2,3,4],
  next() {
    return {
      done : this.data.length == 0,
      value : this.data.pop()
    }
  }
}
```

## Iterable Interface
: Iterator 반환

1. `Symbol.iterator`라는 키를 갖고
2. 값으로 인자를 받지 않고, `iterator Object`를 반환하는 함수가 온다

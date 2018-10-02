# Stack

## HTML Parser
```
A = <tag> BODY </tag>
B = <tag />
C = text

BODY = (A | B  | C)N

```
- 위 세 가지 현상을 바탕으로 BODY 정의. `BODY = (A | B  | C)N`이라는 결과 도출
- 현상을 바탕으로 구조적이고 재귀적인 형태로 파악. 데이터 구조 만듦

```js
const parser = input => {
  input = input.trim();
  const result = { name: 'ROOT', type: 'node', children: []};
  const stack = [ {tag: result}];
  let curr, i = 0, j = input.length;
  while ( curr = stack.pop()) { // curr 은 stack의 현재 값 --- 스택 요수 개수에 따라 동적 루프 
    while( i < j){ // input 스캔 -- 확정적인 루프
      //
    }
  }
  return result;
}
```
- `input`으로 문자열 받아 `result` 객체 반환!
- 파서는 `input` 인자로 받음. 함수 디자인시 인자와 리턴 값 설정해야 함
- 위에서 result(리턴 값)은 태그. 파서의 역할은 `result.children`을 어떻게 채울 것인가
※ 고급 루프에서는 런타임에 루프 횟수가 변함. 동적 계획. 루프를 돌면서 루프의 횟수 달라짐


```js
const parser = input => {
  input = input.trim();
  const result = {name:'ROOT', type:'node', children:[]};
  const stack = [{tag:result}];
  let curr, i = 0, j = input.length;
  while(curr = stack.pop()){
    while(i<j){
      const cursor = i;
      if (input[cursor] === '<'){
        // (2) A,B -- 태그가 온 경우 
        const idx = input.indexOf('>', cursor); // cursor위치에서 찾기 시작, 0부터 시작하게 되면 시작 태그의 닫는 괄호 찾을 수 있기 때문
        i = idx + 1;  // i는 닫는 태그 다음
      } else { 
        // (1) C -- text인 경우 
        i = textNode(input, cursor, curr); // i는 외부 변수를 갱신하는 것이기 때문에 textNode에서 리턴된 값으로 갱신!!
      }
    }
  };

  return result;
}

// (1)의 부분이지만, 함수의 역할이 독립적이기 때문에 함수로 분리
// 역할을 인식하는 즉시!! 함수로 빼내기! 
const textNode = (input, cursor, curr) => { // input, cursor, curr는 지역변수 아니니 인자로 받기
  const idx = input.indexof('<', cursor); // 여는 괄호가 나오기 전까지 텍스트 값
  curr.tag.children.push({
    type:'text', text:input.substring(cursor, idx)
  });
  return idx; // text가 끝나는 지점. 괄호가 시작되는 지점
}
```
**(1) `textNode` 함수 분리**
- (1)의 부분이지만, 함수의 역할이 독립적이기 때문에 함수로 분리

**(2) 괄호로 시작하는 태그**
- `<`로 시작되는 경우는 세 가지!   
  1. 시작 태그 : `<div>`
  2. 닫는 태그 : `</div>`
  3. 완료 태그 포함 태그 : `<img/>`

> 참고,
> - 코드는 쉬운 것부터 짜기! --> 쉬운 것이 의존성이 낮기 때문!
# Stack

## HTML Parser

### 1단계 : 구조를 잡아보자
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

### 2단계 : 작은 단위의 루프를 구성해보자

```
A = <tag> BODY </tag>
B = <tag />
C = text

BODY = (A | B  | C)N

```
#### 2-1단계. 태그와 일반 텍스트 나누기 -- 일반 텍스트(C)인 경우

```js
const parser = input => {
  input = input.trim();
  const result = {name:'ROOT', type:'node', children:[]};
  const stack = [{tag:result}];
  let curr, i = 0, j = input.length;
  while(curr = stack.pop()){

    // ************************ 여기부터

    while(i<j){
      const cursor = i;
      if (input[cursor] === '<'){
        // (2) A,B -- 태그가 온 경우 

      } else { 
        // (1) C -- text인 경우 
        // i는 외부 변수를 갱신하는 것이기 때문에 textNode에서 리턴된 값으로 갱신!!
        i = textNode(input, cursor, curr); 
      }
    }

    // ************************ 여기까지

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
**(1) C -- text인 경우 :: `textNode` 함수 분리**
- (1)의 부분이지만, 함수의 역할이 독립적이기 때문에 함수로 분리


#### 2-2단계. 태그와 일반 텍스트 나누기 -- 태그(A,B)인 경우

```js
const parser = input => {
  input = input.trim();
  const result = {name:'ROOT', type:'node', children:[]};
  const stack = [{tag:result}];
  let curr, i = 0, j = input.length;
  while(curr = stack.pop()){

    // ************************ 여기부터

    while(i<j){
      const cursor = i;
      if (input[cursor] === '<'){
        // (2) A,B -- 태그가 온 경우 
        // cursor위치에서 찾기 시작, 0부터 시작하게 되면 시작 태그의 닫는 괄호 찾을 수 있기 때문
        const idx = input.indexOf('>', cursor); 
        i = idx + 1;  // i는 닫는 태그 다음 
      } else { 
        // (1) C -- text인 경우 
        i = textNode(input, cursor, curr); 
      }
    }

    // ************************ 여기까지

  };

  return result;
}

// (1)의 부분. 텍스트가 끝나는 지점 찾기
const textNode = (input, cursor, curr) => { 
  const idx = input.indexof('<', cursor);
  curr.tag.children.push({
    type:'text', text:input.substring(cursor, idx)
  });
  return idx; 
}
```

**(2) A,B -- 태그가 온 경우 :: 괄호로 시작하는 태그**

- `<`로 시작되는 경우는 세 가지!   
  1. 시작 태그 : `<div>`
  2. 닫는 태그 : `</div>`
  3. 완료 태그 포함 태그 : `<img/>`  
  - 1,3의 공통점 : 여는 태그. 새로운 태그 생성
- A,B 경우의 공통점을 먼저 찾자!  
  **공통점을 먼저 뽑아야 후에 중복 코드를 작성하거나 수정하는 일을 줄일 수 있음!**  
  1. `<`로 시작해서 `>`로 끝남  
  2. `>`가 끝나고 난 다음에 커서가 오도록, `i = idx + 1`이 됨!  
  

**사물을 보고 데이터 에널리시스를 할 때, <u>추상화된 공통점 발견, 재귀적 로직 발견하는 것</u>!!** 이 개발자의 몫

> 참고,
> - 코드는 쉬운 것부터 짜기! --> 쉬운 것이 의존성이 낮기 때문!


떼어내서 계속 보자,  
지금까지 태그와 텍스트를 분리(1)하였고, 이후 태그인 경우((2), `<div>`,`</div>`,`<img/>`)에서 세가지의 공통점(`<` 시작, `>`끝)을 찾았다. 

```js
while(i<j){
  const cursor = i;
  if (input[cursor] === '<'){
    // (2) A,B -- 태그가 온 경우 
    // cursor위치에서 찾기 시작, 0부터 시작하게 되면 시작 태그의 닫는 괄호 찾을 수 있기 때문
    const idx = input.indexOf('>', cursor); 
    i = idx + 1;  // i는 닫는 태그 다음 

    if (input[cursor+1] === "/") { // (2-1) B

    } else {
      let name, isClose;
      if (input[idx-1] === "/"){  // (2-2) 닫는 태그
        name = input.substring(cursor+1, idx-1), isClose = true;
      } else { // 여는 태그
        name = input.substring(cursor+1, idx), isClose = false;
      }

      // 화이트 리스트 작성
      // 상단에서 필터링된 규격화된 데이터를 다룸
      const tag = {name, type:'node', children:[]};
      curr.tag.children.push(tag)

      if (!isClose) {
        stack.push({tag, back:curr}); // 돌아올 태그명 기억해둠;
        break;
      }
    }
  } else { 
    // (1) C -- text인 경우  
    i = textNode(input, cursor, curr); 
  }
}
```

- 데이터 모델링(애널리시스) >> 코드 매핑  
  : 애널리시스를 잘 해두면 매핑이 잘 된다

역할을 인식했으면 함수로 뺀다!!
```js
const parser = input => {
  input = input.trim();
  const result = {name:'ROOT', type:'node', children:[]};
  const stack = [{tag:result}];
  let curr, i = 0, j = input.length;
  while(curr = stack.pop()){
    // ************************ 
    while(i<j){
      const cursor = i;
      if (input[cursor] === '<'){
        // (2) A,B -- 태그가 온 경우 
        // cursor위치에서 찾기 시작, 0부터 시작하게 되면 시작 태그의 닫는 괄호 찾을 수 있기 때문
        const idx = input.indexOf('>', cursor); 
        i = idx + 1;  // i는 닫는 태그 다음 

        if (input[cursor+1] === "/") { 

        } else {
          // (2-1) /를 포함한 태그일 경우 -- </div> or <img />
          if (elementNod(input, cursor, idx, curr, stack)) break;
        }
      } else { 
        // (1) C -- text인 경우  
        i = textNode(input, cursor, curr); 
      }
    }
    // ************************ 
  };

  return result;
}

// (1)의 부분. 텍스트가 끝나는 지점 찾기
const textNode = (input, cursor, curr) => { 
  const idx = input.indexof('<', cursor);
  curr.tag.children.push({
    type:'text', text:input.substring(cursor, idx)
  });
  return idx; 
}

// (2-1)
const elementNode = (input, cursor, idx, curr, stack) => {
  let name, isClose;
  if (input[idx-1] === "/"){  // 닫는 태그
    name = input.substring(cursor+1, idx-1), isClose = true;
  } else { // 여는 태그
    name = input.substring(cursor+1, idx), isClose = false;
  }

  // 화이트 리스트 작성
  // 상단에서 필터링된 규격화된 데이터를 다룸
  const tag = {name, type:'node', children:[]};
  curr.tag.children.push(tag)

  if (!isClose) {
    stack.push({tag, back:curr}); // 돌아올 태그명 기억해둠;
    return true;
  }

  return false;
}
```


**코드의 가독성은 어떻게 높아질까?**
- 알고리즘, 수학적 함수, 연산 등등으로 구현된 코드는 읽기 어렵다!
- 변수명을 예쁘게, 길게 쓰는 것은 중요한 영향을 미치지 않는다
- 그렇다면 쉬운 코드는? **<u>역할에게 위임하는 코드!</u>**  
  === 적절한 역할모델로 위임돼서 각 통신과 협업만 볼 수 있는 코드


자 이제 남은 것은 닫는 태그!
- 닫는 태그는 `elementNode`에서 back에 `curr`을 넣어주었기 때문에, `curr.back`만으로 충분하다!
```js

while(i<j){
  const cursor = i;
  if (input[cursor] === '<'){
    // (2) A,B -- 태그가 온 경우 
    // cursor위치에서 찾기 시작, 0부터 시작하게 되면 시작 태그의 닫는 괄호 찾을 수 있기 때문
    const idx = input.indexOf('>', cursor); 
    i = idx + 1;  // i는 닫는 태그 다음 

    if (input[cursor+1] === "/") { 
      curr = curr.back;
    } else {
      // (2-1) /를 포함한 태그일 경우 -- </div> or <img />
      if (elementNod(input, cursor, idx, curr, stack)) break;
    }
  } else { 
    // (1) C -- text인 경우  
    i = textNode(input, cursor, curr); 
  }
}
```
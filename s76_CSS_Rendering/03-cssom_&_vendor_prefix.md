
- **Vender Prefix** : css 는 브라우저마다 지원사항이 다르고, 새로운 기능의 경우 vendor prefix를 붙였다가 안정화되고 나서 떼는 경우가 일반적
- **CSSOM** : 자바스크립트 이용하여 css 수정. 이는 DOM에 박는 게 아닌 css를 객체화 시켜 다루는 것!


# CSS Object Model

### style DOM element > sheet(css style sheet) > css rules(css rule list) > item(css rule > css style rule)
1. style dom element : `<style>` 태그
2. sheet :   
  - element 안에 sheet 들어있는데, 얘가 실체. 이거를 DOM element(`<style>`)에 삽입하여 html문서에 넣은 것.
  - tag는 컨테이너 박스 같은 래핑 객체. 실체는 태그 안에 들어 있음
3. css rules : sheet는 CSS rules라는 리스트 갖고 있음. (배열)
4. item : css rules 의 개별 요소  
  - [type / selectorText / style객체] 갖음
  - style 객체는 개별 DOM 과 rule이 갖고 있다. 
  - type : css rule 내에 들어있는 type들. css에서 구현할 수 있는 타입들(ex. 1.style_rule , 2.charset_rule, 3.import_rule, 4.media_rule ...)  
    selectorText : 선택자명


```html
<style id='s'>
  .test { background:#ff0; }
</style>
<div class="red">red</div>
<div class="blue">blue</div>
```
```js
const el = document.querySelector("#s"); // 얘는 element일 뿐.
const sheet = el.sheet; // element 안에 있는 실체. CSS style sheet 객체.
const rules = sheet.cssRules; // sheet가 갖고 있는 css rules
const rule = rules[0]; // item

console.log(rule.selectorText); // ".test"
console.log(rule.style.background); // #ff0

sheet.insertRule('.red{backgorund:red}', rules.length); // css 추가 / insertRule(속성, index) : 속성 - 속성을 알아서 파싱해서 넣어라 / index - 순서
sheet.insertRule('.blue{background:blue}', rules.length);

console.log(sheet.cssText); // 속성명 출력
```

```js
document.querySelector(".red").onclick = _=>{
  sheet.insertRule('.red{backgorund:red}', rules.length); // css 추가 / insertRule(속성, index) : 속성 - 속성을 알아서 파싱해서 넣어라 / index - 순서
  sheet.insertRule('.blue{background:blue}', rules.length);
}
document.querySelector(".blue").onclick = _=>{
  sheet.deleteRule(rules.length-1); // rules 지우기. 
}
```
**`document.styleSheets`**
- sheet 객체별로 데이터 갖고 있음
- [0]은 document가 원래 갖고 있는 속성
- 이후로 차곡차곡 쌓이게 됨(여기서도 뒤에오는 애가 앞에 있는 애보다 우선순


**css object를 다룬다는 건**
- dom 객체 다루는 거랑 다른 개념(dom은 inline스타일을 건드리는 것)
- 성능상 저하 없음
- 같은 셀렉터에 한번에 적용가능
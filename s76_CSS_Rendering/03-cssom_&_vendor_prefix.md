
**Vender Prefix** 
- css 는 브라우저마다 지원사항이 다르고, 새로운 기능의 경우 vendor prefix를 붙였다가 안정화되고 나서 떼는 경우가 일반적
**CSSOM**(CSS Object Model) 
- 자바스크립트 이용하여 css 수정. 이는 DOM에 inline style을 넣는 게 아닌 css를 객체화 시켜 다루는 것!


# CSS Object Model

### style DOM element > sheet(css style sheet) > css rules(css rule list) > item(css rule > css style rule)
1. style dom element : `<style>` 태그
2. sheet :   
  - element 안에 sheet 들어있는데, 얘가 실체. 이거를 DOM element(`<style>`)에 삽입하여 html문서에 넣은 것.
  - tag는 컨테이너 박스 같은 래핑 객체. 실체는 그  안에 들어 있음
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

## Compability library
: **prefix를 달아주는 프레임워크를 만들어보자!**


1. **Vender Prefix**  
  : run time fetch - 실행 중에 확인해 봐야 함
2. **Unsupported Property** (지원하지 않은 속성)  
  : ex. ie7에서 rgba 속성 쓰면 브라우저 다운됨  
  : graceful fail - 티 안나게 지나가기
3. **Hierarchy Optimaze** (계층구조 최적화)  
  : sheet.disabled = true;  
  : 스타일 시트가 여러개일때, 계층 별 하나의 것으로 만들어 적용, 나머지는 끄기  

**우리가 만들 것은,**
- style classes!
- 아래 화살표 순으로 의존하고 있는데, 가장 가벼운 `[style]`부터 만들 것!
```
    [Style]         <<     [Rule]      <<      [CSS]  
css Style Declare         CSS rule          Style Sheet
```

첫째로 우리에게 필요한 건,
```js
const el = document.querySelector("#s"); // 얘는 element일 뿐.
const sheet = el.sheet; // element 안에 있는 실체. CSS style sheet 객체.
const rules = sheet.cssRules; // sheet가 갖고 있는 css rules
const rule = rules[0]; // item
```
여기서 **`rule.style` 객체**!   

그렇담 시작해보자.

```js
const Style = ( _ => {
  // 필요 utilities
  const prop = new Map, // 진짜 속성과 가짜 속성 묶는 Map
        prefix = 'webkit,moz,ms,chrome,o,khtml'.split(','); // prefix 문자열. 왼쪽부터 - oo, 모질라, ie/엣지, 크롬, 오페라, 리눅스 ... 메이저한 애들만 고름 - 배열로 들고 있기
  const NONE = Symbol(); // 브라우저가 지원하지 않는 속성 나타냄 - 물어보는 대상 : Document.body.style
  const BASE = document.body.style;

  const getKey = key => {
    // 해당 브라우저가 지원하는 키 받기 
    // 표준이름 입력 > 브라우저가 지원하는 속성으로 반환 (ex. borderRadius, webkitBorderRadius, NONE)

    if (prop.has(key)) return prop.get(key); // 한번 확인하면 캐시에 등록. 캐시에 있을 경우 그대로 반환


    if (key in BASE) prop.set(key,key); // key 갖고 있음. 바로 캐시에 등록
    else if ( !prefix.some( v => {
      
      // 프리픽스를 붙인 속성은 존재하는가?
      const newKey = v + key[0].toUpperCase() + key.substr(1); // ex. webkitBorderRadius
      if (newKey in BASE) {
        prop.set(key, newKey);
        key = newKey;
        return true;
      } else return false;

    })) {
      // 프리픽스에 없을 경우,
      prop.set(key, NONE);
      key = NONE; // 프리픽스로도 안되면 없는 키
    }

    return key; // 기존 key  or  newKey  or  NONE
  }

  return class{
    constructor(style) {
      this._style = style;
    }  

    get (key) {
      key = getKey(key);
      if (key === NONE) return null;  // 조회 말고 null 반환
      return this._style[key];  // prefix 붙인 속성명 반환
    }

    set (key, val) {
      key = getKey(key);
      if (key !== NONE) this._style[key] = val; // gracefull fail
      return this;
    }
  }

})();

const el = document.querySelector("#s");
const sheet = el.sheet;
const rules = sheet.cssRules;
const rule = rules[0];
const style = new Style(rule.style);
style.set('borderRadius', '20px');
style.set('boxShadow', '0 0 0 10px red');
```
- '2. Unsupported Property' 지원 위해 `NONE` 사용   
  '1. Vender Prefix' 런타임 패치 위해 `BASE` 사용

**자 이제 다음은 Rule 만들 차례,**
```js
const Rule = class {
  constructor(rule) {
    this._rule = rule;
    this._style = new Style(rule.style);
  }

  get(key) {
    return this._style.get(key);
  }

  set(key) {
    this._style.set(key, val);
    return this;
  }
}

const el = document.querySelector("#s");
const sheet = el.sheet;
const rules = sheet.cssRules;
const rule = new Rule(rules[0]);

rule.set('borderRadius', '20px');
rule.set('boxShadow', '0 0 0 10px red');
```
- `Rule`이 있으면, `Style` 객체를 직접 다룰 필요가 없음
- 할일을 객체들에게 나눠주자(잘 하는 일만하자, 역할모델)  
  1) `getKey()`는 '그 이름이 진짜 이름이냐'  
  2) `Style` 객체는 '그 이름이 진짜이름이면 `getKey`에게 맡기고, 내가 궁금한 건 그 스타일을 쓰냐 안쓰냐'
  3) `Rule`객체는 '그 style관련된 건 `style`객체에 맡길 거고, 나는 하나의 Rule을 소유해서 rule에 있는 스타일 객체를 감싼 스타일 객체를 만들거야

**자 이제 다음은 Sheet 만들 차례,** - rule을 add / remove
```js
const Sheet = class {
  constructor (sheet) {
    this._sheet = sheet;
    this._rules = new Map;
  }

  add(selector) {
    const index = this._sheet.cssRules.length;
    this._sheet.insertRule(`${selector}{}`, index); // 빈룰 생성, index에 등록

    const cssRule = this._sheet.cssRules[index]; // 진짜 cssRule
    const rule = new Rule(cssRule);
    
    this._rules.set(selector, rule);
    return rule;
  }

  remove(selector) {
    if (!this._rules.contains(selector)) return; // 없을 때
    const rule = tihs._rules.get(selector)._rule;
    Array.from(this._sheet.cssRules).some( (cssRule, index) => {
      if (cssRule === rule._rule) {
        this._sheet.deleteRule(index);
        return true;
      }
    })
  }

  get(selector) {
    return this._rules.get(selector);
  }
}
```
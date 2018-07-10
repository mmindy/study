# Graphics System
: 점찍는 방법


**Fixed Number < Abstract Calculator < Component < Framework**

### Fixed Number
- X, Y, Width, Height, Color
- 다양한 화면, 해상도, 기기 등 다양한 환경에 대응하기에 어려움 있음(범용성있는 그래픽스 시스템 제작에 어려움)
- Screen Size, Chrome Size, Hierarchy 고려해야 함

### Abstract Calculator(추상화된 계산기)
- 원시적 숫자 계산 넘어서서 함수 사용하여 계산하는 방식으로 발전된 Graphics System
- %, Left, Block, Inline, Float 등 다른 메타포 사용하여 Fixed Number 단점 극복  
  - % : 화면, 브라우저, 부모 등 화면이 그려지는 순간, 환경 인식하여 책정 / 공식이자 함수(숫자체계X)
  - 그 외의 다른 메타포들도 %와 마찬가지로 화면이 그려지는 순간 책정되는 공식이자 함수

### Component
- 추상화된 그래픽스 시스템 체계를 이어받아 공통적으로 갖고 있는 애들을 만듦
- ex. HTML태그 하나하나

### Framework
- Component들이 일정한 규칙과 사용방법을 지키는 것
- ex. HTML태그에는 공통된 style 먹혀 있음. 따라서 HTML 전체는 하나의 framework



**항상 상대적인 관점에서 재평가할 수 있도록! 확정적이고 고정적인 개념X**


# Rendering System
: 특정 대상을 내가 원하는 모습으로 그려지는 것. 보다 구체적이고 시각적으로 변경(사람 혹은 기계가 인식하기 용이하게)   
: 어떠한 체계로 정보를 그림으로 표현해 내는가  

- 그래픽스 시스템에서 일반적으로 두 단계로 나눔  
  1. Geometry Calculate : 영역 나누기 / reflow  
  2. Fragment Fill : 조각 채우기 / repaint  


# CSS Specifications
- CSS에 나오는 속성들이 어떠한 방식으로 나와서 구현되는가

### CSS - Level 1
- opera 브라우저 제작자가 W3C에 제안
- html 내부 그림 관련된 것들 따로 빼자

### CSS - Level 2 + MODULE
- MS ie4 시절 / ie6 strict 모드 완벽 호환
- 그림에 관한 걸 하나의 스펙으로 관리하는 건 무리 / 사양 쪼개서 관심 분야별 Module 기능 넣어서 관리

### CSS - Level 2.1(include Level 3 Module)
- 여기까지의 모듈들 css 2.1 level로 불러도 OK
- 모듈별 연구 진도 다르고, 확정형/발전형으로 나뉘어짐
- 흔히 css3이라고 부르는 애들은 level 2.1에서 3으로 발전된 속성들(정확히 css3은 존재x)
  ```
  syntax 3            cascade 3
  color 3             selectors 3
  background 3        values 3
  text 3              text decor 3
  fonts 3             ui 3
  ```
### MODULE Level
- CSS 전체가 level로 함께 발전할 수 없어 모듈별로 level 지니게 됨
- 새로 생긴 애들
  ```
  transform 1
  compositing 1
  effects 1
  masking 1
  flexbox 1
  grid 1
  ```

> css 사양은 각각 발전하고 있으며 모두 다름. 모든 css 레벨 및 속성을 파악할 수 없고, 하나의 공통된 사양이 없어 브라우저가 모두 반영할 수 없다  
> 또한 브라우저 버전별로 해당 CSS module 별로 지원하는 level이 다르다


# Other Specification
- W3C는 MS 영향 多
- 구글, 애플 영향력 강화되면서 동향 변경  
  이전 : W3C 권고안 -> 브라우저 적용 및 구현  
  이후 : 브라우저별 기능 탑재 / W3C 권고안 별개로 분리  
- W3C Community and Business Groups 만들어서 개별 그룹별 드래프트 등록 함
  - 그중 유명한 애가 WICG / RICG 
  - WICG는 구글 주축으로 크롬에 먼저 반영, 후에 W3C에 등록되는 등 W3C의 영향력 낮아지고 있음

- - - 
- - - 

# Normal Flow
- 고유 명사
- css2.1 visual formatting model (positioning schemes & normal flow)
- [MDN](https://developer.mozilla.org/ko/docs/Web/Guide/CSS/Visual_formatting_model)

### Normal Flow를 그리는 공식
1. **B**lock **F**ormatting **C**ontext 
2. **I**nline **F**ormatting **C**ontext
3. Relative Position  


> ### position
> - **static** / **relative** / absolute / fixed / inherit
> - normal flow는 potision이 static / relative 에서만 적용!


### **B**lock **F**ormatting **C**ontext 
- 가로를 부모만큼 다먹음  - x는 언제나 0, width는 언제나 부모 width / y 위치만 고민하면 됨  
- 두번째 bfc요소는 첫번째 bfc요소의 높이만큼의 y에 위치

### **I**nline **F**ormatting **C**ontext
- 나의 content 크기만큼 가로 차지
- 두번째 ifc 요소는 첫번째 ifc 요소의 width만큼의 x에 위치
- 가로에 포함된 ifc 요소 중 가장 높은 애의 height가 line-height가 되어 높이

> cf. 공백이 없는 문자
> : block 안의 공백이 없는 문자는 암묵적으로 ifc 요소로 인정
> : word break 를 사용하여 break-all 속성 주면, 문자 하나당 ifc로 인식, 남용 시 브라우저 느려짐

### Relative Position
- normal flow(static)로 먼저 그리고 relative로 상대적으로 이동됨
- static / relative 섞여 있을 경우 relative가 위로 올라옴  
- 박스의 크기, 위치 변화 X

# Float
- new BFC
- Float over normal flow
- Text, Inline 요소의 guard로 작동
- line box 공식으로 그려짐  
  (normal flow에서 사용된 공식(BFC, IFC, Relative) 사용되지 않음)  

```js
<div style="width:500px;">
  <div class="box1" style="height:50px;background:red"></div>
  <div class="box2" style="width:200px;height:150px;float:left;background:rgba(0,255,0,0.5);"></div>
  Hello
  <div class="box3" style="height:50px;background:skyblue">World</div>
  !!!
</div>
```
- float는 새로운 BFC 영역을 만듦  
  : `.box2`에서 새로운 BFC영역 생성
- `Hello`가 인라인으로 동작하여 `.box2`의 guard 오른편에 그려짐   
  BUT, block요소는 guard로 작동이 안되기 때문에 그대로 그려짐


```js
<div style="width:500px;">
  <div class="box1 left" style="width:200px;height:150px;">1</div>
  <div class="box2 right" style="width:50px;height:150px;">2</div>
  <div class="box3 right" style="width:50px;height:100px;">3</div>
  <div class="box4 left" style="width:150px;height:50px;">4</div>
  <div class="box5 right" style="width:150px;height:70px;">5</div>
  <div class="box6 left" style="width:150px;height:50px;">6</div>
  <div class="box7 left" style="width:150px;height:50px;">7</div>
  <div class="box8" style="height:30px;background:red;">ABC</div>
</div>

<style>
.left { float:left; }
.right { float:right; }
</style>
```
- line box는 가용영역 내에서 float요소만 신경씀  
	(float가 잠식한 영역 외 새로운 float 요소를 넣을 수 있는 공간)
- 남아있는 line box에 새로운 float요소가 들어갈 공간이 없을 때, 그 공간은 폐기 & 하단에 바운드라인 그리고 하단 공간에 새로운 라인박스 만듦
- line box 계산에서 float:right 일 경우, 가장 왼쪽으로 나와있는 `float:right`요소보다 더 오른쪽은 없음. 그렇기에 해당 요소보다 오른쪽에 남아있는 공간은 폐기  
  : **left 보다 더 left인 공간이 없고, right보다 더 right인 공간은 없다**
	: **line box는 공간을 찾아다니는 게 아니라 공간의 경계면 봄**


# Overflow
> **Overflow**
> [ visible / hidden / scroll / inherit / auto(default) ]
> - auto == visible
> - 해당 Geometry 넘어가면 hidden / scroll
> 
> **Overflow-X , -Y**
> [ visible / hidden / scroll / clip / auto ]
> - recommandation이었다가 draft(권고안)로 바뀜  
>   : transform , border-radius 등 새로 등장한 속성들 떄문!  
>   : 영역을 어디까지 봐야 하는가!
> 
> **Text-oveflow**
> [ clip / ellipsis ]


[ visible / **hidden** / **scroll** / inherit / auto(default) ]
- css2.1 visual formatting model

- new BFC : overflow 값이 hidden/scroll 일때 새로운 BFC 생성
- first line box bound : 새로운 bfc 박스를 만들때 line box bound를 인식함 

```html
<div style="width:500px;border:3px solid #ddd;overflow:hidden;">
  <div class="box1 left" style="width:200px;height:150px;">1</div>
  <div class="box2 right" style="width:50px;height:150px;">2</div>
  <div class="box3 right" style="width:50px;height:100px;">3</div>
  <div class="box4 left" style="width:150px;height:50px;">4</div>
  <div class="box5 right" style="width:150px;height:70px;">5</div>
  <div class="box6 left" style="width:150px;height:50px;">6</div>
  <div class="box7 left" style="width:150px;height:50px;">7</div>
  <div class="box8" style="height:30px;overflow:hidden;background:red;"></div>
</div>
```
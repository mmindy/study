# Morden Box
- contents box
- padding box : box-shadow inset의 경우 padding box에 그려짐
- border box : **fragment**의 영향은 여기까지
- box-shadow : border box 바깥에 그려짐 / fragment 단계에 영향, geometry(영역 잡기)에 영향 X / border-radius 에 영향 받음
- outline : border box 바깥에 그려짐 / box-shadow와 같은 위치 / border-radius 에 영향 받지 않음
- margin

## box sizing

## box-shadow
- `box-shadow:0 0 0 10px #aa0;`이 경우 border를 준 것과 같은 효과
- box-shadow의 경우 Geometry(layout)에 영향X
- ※ position:relative; 등 z-index에 영향 미치는 애들 외 인라인 요소도 그려지는 순서가 있음
- `border-radius` 따름 (cf. `outline`의 경우 따르지 않음)

```html
<div style="background:red;">
</div><div style="background:blue;box-shadow:0 0 0 10px #aa0;"></div>

<style>
  div { display:inline-block; width:100px; height:100px; padding:10px; border:10px dashed rgba(0,0,0,0.5)}
</style>
```

※ `position:relative`의 경우 normal flow 그린 후에 그려지기 때문에 첫번째 `div`에 `position:relative;` 주었을 경우 두번째 `div`의 `box-shadow`가 아래로 가게 된다  
※ 브라우저 작동은 랜덤이 아님! Geometry 계산 > fragment 절차대로 그려짐

### box-shadow inset
- padding box 영역에 그려짐

```html
<div style="background:red;">
</div><div style="background:blue;box-shadow:inset 0 0 0 10px #aa0;"></div>

<style>
  div { display:inline-block; width:100px; height:100px; padding:10px; border:10px dashed rgba(0,0,0,0.5)}
</style>
```


**`box-shadow`의 장점은 여러개 그릴 수 있다는 것!**
```html
<div style="background:blue;
  box-shadow:
    0 0 0 10px purple,
    0 0 0 20px green,
    inset 0 0 0 10px pink,
    inset 0 0 0 20px yellow;
"></div>
```
- stack처럼 쌓여 선언한 반대 순서로 그려짐(yellow > pink > green > purple)

```html
<div style="background:red;position:relative;">
</div><div style="background:blue;border-radius:50%;animation:ani 0.5s linear alternate infinite"></div>

<style>
div { display:inline-block; width:100px; height:100px; padding:10px; border:10px dashed rgba(0,0,0,0.5)}

@keyframes ani {
  from {
    box-shadow:
      0 0 0 0 purple,
      0 0 0 0 green,
      inset 0 0 0 0 pink,
      inset 0 0 0 0 yellow;
  }
  to {
    box-shadow:
      0 0 0 10px purple,
      0 0 0 20px green,
      inset 0 0 0 10px pink,
      inset 0 0 0 20px yellow;
  }
}
</style>
```

## Outline

- stitched
  ```html
  <div style="
    background:black;
    border-radius:15px;
    outline:10px solid brown;
    border:1px dashed #fff;
    color:#fff;
    box-shadow:0 0 0 10px green;
    ">stitched</div>
  <style>
  div { display:inline-block; width:200px; height:200px; }
  </style>
  ```


# Position
: absolute | fixed

## Caret Position & Offset

### offset
- css 명령(geometry)을 모두 계산하고(브라우저의 로직) 난 나머지 px값들
- 변경 불가
- 무엇으로부터 얼만큼 떨어졌는가

- 브라우저 랜더링 정책에 기반하여 개발자가 요청한 스타일을 그리기 때문에, 정확한 수치를 아려면 `offset`으로 알아낼 수 있음  
  \> 여기서 문제가 생김!

**어떤 문제냐.**
- 브라우저는 효율적 계산위해 geometry 계산을 한번에 몰아서 함  
  - frame : 한번에 묶어서 계산하는 단위
  - flush : 변화시키려는 것을 쌓아놨다가, 쌓아놓은 큐를 한번에 계산하고 비움
- 그러나 offset을 요청하면, 요청 시점에 재계산 이루어짐
- 레이아웃을 구성하는 도중에 offset요청하게 되면 최적화 로직이 깨지게 됨   
  ex. 레이아웃 그리기 위해 offset받고, 이를 바탕으로 새로운 레이아웃 그릴 때
- offset은 **조회전용**, 이를 통해 레이아웃 그릴 때 효율성 생각해봐야 함!

### Offset Parent
: offset의 기준이 되는 요소
: DOM 상에서의 부모와 다른 개념

1. Null : offset parent 없는 경우  
    - root, html, body
    - position:fixed
    - out of DOM tree : ex) createElement로 생성한 경우, append 통해 DOM 안에 들어가야 생김

2. **Recursive Search** : offset parent 를 찾는 방법  
    - parent.position:fixed = null  : 부모가 fixed인 경우 null
    - parent.position:!static = OK : static이 아닌 부모 찾으려 계속 올라감. absolute / relative
    - body = OK
    - td, th, table = OK : spec은 이러하나 구현되는 브라우저는 없음
    - parent.parent continue

\> **static 요소들 속에서 relative로 container를 만들고 그 안에 absolute로 띄워서 위치를 잡는 것이 핵심!**


### Offset value
- offsetLeft / offsetTop  
  offsetWidth / offsetHeight : scroll이 있다면 넘친 콘텐츠 제외한 콘텐츠 크기
- offsetScrollTop / offsetScrollLeft  
  OffsetScrollWidth / offsetScrollHeight : 얘네들이 실제 콘텐츠의 크기

### 예제
- position:absolute의 기본 값은 static 값
- static은 그림 그리는 로직이 normal flow. static인 요소에 left, top 주어도 반영되지 않음
  ```html
  <div style="wdith:200px;height:200px;background:yellow;margin:100px;">
    <div style="width:100px; height:100px; position:absolute;background:red;"></div>
    <div style="width:100px; height:100px; position:absolute;background:blue;left:0;top:0;"></div>
  </div>
  ```

> cf. **float vs position 누가 더 센가?**
> `float`은 normal flow를 따르고, `position:absolute`는 normal flow의 로직을 따르지 않는 것이기 떄문에,   
> `float`을 준 요소에 `absolute`를 주면 `float`속성이 깨지게 됨



- - -

```html
<div class="star">
	<div class="inner">★</div>
</div>

<style>
div { border:25px solid red; border-radius:50%; }
.star { 
  width:200px; height:200px; 
  background:#fff;
	position:relative;
	box-shadow:0 0 50px 0 red;
}
.inner { 
  width:100px; height:100px; 
	position:absolute;
	top:25px; left:25px;
  font-size:100px; 
  line-height:70px; 
  text-align:center; 
  color:#fff;
	background:blue;
}
</style>
```

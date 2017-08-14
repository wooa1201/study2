# 04 정교한 상호작용

## 리액트의 애니메이션

* ReactCSSTransitionGroup 제공
* 컴포넌트가 DOM에 추가 또는 제거될 때 CSS트랜지션과 애니메이션을 트리거하는 방식
* 리액트에서 CSS 전환을 통합할 수 있게 해준다.

## CSS 트랜지션과 애니메이션 기초

* CSS 트랜지션은 시작 상태와 종료 상태의 두 가지 고유한 상태 간에 값을 보간하는 애니메이션 기법

    * 애니메이션 적용할 속성 이름
    * 지속 시간
    * 가속 곡선을 제어하는 타이밍 함수
    * 애니메이션을 시작하기 전 선택적 지연 시간

``` css
transition: width 0.5s ease-in 0.5s;
```

[트랜지션](https://codepen.io/DUCKHEE/pen/XaaRaG)

* CSS 키프레임 애니메이션은 시작과 종료 외에도 키프레임을 이용해 중간 단계를 제어

``` css
@keyframes pulsing-heart {
  0% { transform: none; }
  50% { transform: scale(1.4); }
  100% { transform: none; }
}
```

[애니메이션](https://codepen.io/DUCKHEE/pen/GvvmOW)

## 프로그래밍 방식으로 CSS 트랜지션과 애니메이션 시작

* CSS로는 기본적인 상호작용(트랜지션, 애니메이션)만 가능
* 유연하게 제어하려면 자바스크립트 이용
* 클래스 스와핑 기법 : 동일한 요소에 별도의 클래스를 2개 만든다.

``` css
 .sidebar {
   ...
 }

 .sidebar-transition {
   opacity:0;
 }

 .sidebar-tarnsition-active {
   opacity:1;
   transition: 0.5s; // 지속시간
 }

 <body>
    <div class="sidebar sidebar-trasition"></div> // 자바스크립트 이용해 sidebar-tarnsition-active 클래스를 추가
 </body>
```

## ReactCSSTransitionGroup

* 애니메이션에 포함할 모든 컴포넌트를 래핑하며 컴포넌트 수명주기 ( 예 : 마운팅과 언마운팅 ) 와 연관된 특정한 시점에 CSS 애니메이션과 트랜지션을 트리거하는 간단한 요소다.

`npm install --save react-addons-css-transition-group`

* transitionName(실제 애니메이션 정의를 포함하는 CSS 클래스 이름으로 매핑)
* transitionEnterTimeout(시작), transitionLeaveTimeout(종료)(밀리초 단위 지속 시간)

``` js
  <ReactCSSTransitionGroup
    transitionName="toggle"
    transitionEnterTimeout={250}
    transitionLeaveTimeout={250}
  >
    {cardDetails}
  </ReactCSSTransitionGroup>
```

* toggle-enter 추가 후 toggle-enter-active를 추가한다.

``` css
.toggle-enter {
  opacity: 0;
}

.toggle-enter.toggle-enter-active {
  opacity: 1;
  transition: 0.3s;
}
```

### 초기 마운팅 애니메이션

* 초기 항목이 처음 표실될때 `Appear` 사용

``` js
  <ReactCSSTransitionGroup
    transitionName="toggle"
    transitionEnterTimeout={250}
    transitionLeaveTimeout={250}
    //추가
    transitionAppear={true}
    transitionAppearTimeout={300}
  >
    {cardDetails}
  </ReactCSSTransitionGroup>
```

## 드래그 앤드 드롭

* DOM을 직접 조작하지 않는다.
* 단방향 데이터 흐름을 수용
* 시작점과 드롭 대상 논리를 순수 데이터로 정의할 수 있는 "리액트 방식"의 드래그 앤드 드롭 라이브러리인 리액트 DnD를 이용

`npm install --save react-dnd@2.x.x react-dnd-html5-backend@1.x.x`

## 리액트 DnD 구현 개요

* 고차 컴포넌트를 이용
  * 컴포넌트를 매개변수로 받고 여기에 기능을 추가한 향상된 버전의 컴포넌트를 반환하는 자바스크립트 함수다.
  * 컴포넌트를 input으로 하고 컴포넌트를 outpout으로 하는 함수

* ES7에서는 데코레이터 사용

### 리액트 DnD 라이브러리 3가지 고차 컴포넌트

* DragSource : "드래그 원본" 요소로 만드는 기능을 추가한 향상된 버전의 컴포넌트를 반환(드래그 되는 )
* DropTarget : 드래그 대상으로 작동할 수 있는 향상된 버전의 컴포넌트를 반환
* DragDropContext : 드래그 앤드 드롭 상호작용이 수행되는 부모 컴포넌트를 래핑하고 내부적으로 공유되는 DnD 상태를 설정

### 고차 컴포넌트를 생성하려면 세 가지 매개변수를 지정(모두 필수)

* 타입(type) : 컴포넌트 이름. 식별할 수 있어야 한다.
* 사양 객체(spec) : 향상된 컴포넌트가 DnD 이벤트에 "반응"하는 방법을 지정한다. 드래그 앤드 드롭 상호작용이 수행될 떄 호출되는 함수를 포함하는 일반 자바스크립트 객체
* 콜렉팅 함수(collect) : 리액트 DnD는 속성을 직접 컴포넌트로 주입하는 대신 주입되는 속성과 주입 방법을 콜렉팅 함수를 이용해 제어할 수 있게 해준다.

콜렉팅 함수는 속성을 주입하기 전에 전처리하거나 이름을 바꾸는 등 다양한 작업을 가능하게 해준다.

리액트 DnD 라이브러리는 드래그 앤드 드롭 상호작용 할떄 커넥터와 모니터라는 두 매개변수를 전달하고 컴포넌트에 정의된 콜렉팅 함수를 호출한다.

* 커넥터 : 컴포넌트의 render 함수에서 컴포넌트 DOM의 일부분을 구분하는 데 이용할 속성과 매핑해야 한다.
  * dragSource 컴포넌트에서 DOM의 이 부분은 드래그하는 동안 컴포넌트를 나타내는데 이용된다.
  * dropTarget 컴포넌트에서 DOM의 이 구분된 부분은 드롭영역으로 이용된다.

* 모니터 : 속성을 드래그 앤드 드롭 상태와 매핑할 수 있게 해준다.
  * 드래그 앤드 드롭은 근본적으로 상태 저장 작업이다.


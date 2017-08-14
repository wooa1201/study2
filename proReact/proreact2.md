# 프로리액트 스터디

## 2장 DOM 추상화의 내부

### 리액트의 이벤트

#### DOM 이벤트 리스너

JSX는 이벤트 API를 바람직하게 구현했다.

* 콜백 함수는 컴포넌트 스코프(앞서 살펴 본것 처럼 UI의 특정 부분에만 관여하며 일반적으로 적은 양의 마크업을 포함)
* 이벤트 위임과 자동 관리 언마운팅을 이용한다.

[이벤트 위임](https://github.com/nhnent/fe.javascript/wiki/August-22-August-26,-2016 "nh.fe")

그것은 동적으로 추가되는 엘리먼트에 매번 이벤트 리스너를 추가 하는 것에 대한 고민이었다. 10가지 이벤트가 동작하는 기능을 100번 등록하면 이벤트 리스너는 1000번을 추가해야 한다.

메모리 누수 문제도 그렇다. 애초에 매번 등록하지 않으면 메모리 누수 가능성도 줄어들고 그로 인해 매번 해제하지 않아도 될 것이다. 안타깝게도 그때 당시에는 그 고민을 해결하지 못 했다.

하지만 지금은 그에 대한 해결 방법을 알고 있다. 바로 이벤트 위임(delegation)을 하면 된다.

메뉴 아래 버튼 3개 있으면 버튼 3개 각각 이벤트 주는 대신 부모에 줘서 그 안에서 분기처리

주의점

* 낙타표기법
* 모든 브라우저와 장치에서 일관성을 유지하기 위해 여러 브라우저와 버전에 포함된 모든 변형의 하위 집합을 포함

#### 칸반 앱:DOM 이벤트 관리

``` js
// Card.js
<div className="card_title" onClick={
  () => this.setState({showDetails: !this.state.showDetails})
}>
```

이 방법은 실용적이지만 유연하지 않다.

이번에는 클래스 안에서 toggleDetails라는 새로운 메서드를 이용해 이벤트를 처리하자.

수정 코드

``` js
class Card extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      showDetails: false,
    };
  }

  toggleDetails() {
    this.setState({ showDetails: !this.state.showDetails });
  }

  render() {
    //...내용 생략
    }

    return (
      <div className="card">
        <div className="card_title" onClick={this.toggleDetails.bind(this)}>
          {this.props.title}
        </div>
        {cardDetails}
      </div>
    );
  }
}
```

### JSX 자세히 살펴보기

> JSX는 자바스크립트 코드 안에 선언적인 XML 스타일의 구문을 작성할 수 있게 해주는 리액트의 선택적 자바스크립트 구문 확장이다.

장점

* XML은 특성을 이용한 요소 트리로 UI를 표현한는 데 아주 적합하다.
* 애플리케이션의 구조를 시각화하기 쉬우며 더 간결하다.
* 일반 자바스크립트이므로 언어의 의미를 변형시키지 않는다.

#### JSX와 HTML 비교

JSX 는 HTML과 비슷하지만 자바스크립트 스타일과 구문도 준수해야 한다는 점을 잊지 않았다.

#### JSX와 HTML 차이

1. 태그 특성은 낙타 표기법으로 작성한다.
  ``` js
  // HTML
  <input text="text" maxlength="30" />>
  // JSX
  return <input type="text" maxLength="30" />
  ```
1. 모든 요소는 짝이 맞아야 한다.
  ``` html
  <br> -> <br />
  <img src=""> -> <img src="" />
  ```
1. 특성 이름이 HTML 언어 사양이 아닌 DOM API에 기반을 둔다.
  DOM API와 상호작용할 때의 태그 이름은 HTML에 이용하던 것과는 다를 수 있다.
  ``` js
  // HTML
  <div id="box" class="some-class"></div>

  // JSX
  return <div id="box" className="some-class"></div>

  // 일반 자바스크립트를 이용해 DOM조작하고 클래스 이름 변경 시
  document.getElementById("box").className = "some-other-clss"
  ```

#### JSX의 특이점

JSX에는 다루기 까다로운 측면이 있다.

#### 단일 루트 노드

리액트 컴포넌트는 단일 루트 노드만 렌더링할 수 있다. 이러한 제한이 있는 이유는 render함수의 return문을 살펴보자.

``` js
return (
  <h1>Hello World</h1>
)

// 이 return 문은 다음과 같이 변환된다.
return React.createElement("h1", null, "Hello World");
```

그러나 다음 코드는 유효하지 않다.

``` js
return (
  <h1>Hello World</h1>
  <h2>Have a nice day</h2>
)
```

이건 자바스크립트 특징이다.

return은 단일 값만 반활할 수 있지만, 이 코드는 두 개문의 문을 반환하려고 한다.(React.createElement를 두 번 호출)

**해결책은 자바스크립트와 마찬가지로 모든 반환 값을 루트 객체 하나에 래핑하면 된다.**

``` js
return (
  <div>
    <h1>Hello World</h1>
    <h2>Have a nice day</h2>
  </div>
)

// 위 코드는 아래와 같이 변환
return React.createElement("div", null,
  React.createElement("h1", null, "Hello World"),
  React.createElement("h2", null, "Have a nice day"),
)
```

단일 값을 반환하는 유요한 자바스크립트 코드다.

#### 조건절 문제점

``` js
<div className={if (condition) {className: "salutation" }}>Hello JSX</div>

//위 코드는 다음과 같이 잘못된 자바스크립트 식으로 반환
React.createElement("div", {className: if(condition) {"salutation"}}, "Hello JSX"); // 오류 발생
```

#### 조건절 해결책

JSX에 if문을 이용하지 못하고 **삼항식**을 이용한다.

리액트는 null과 정의되지 않은 값을 인식하며 JSX에서 이스케이프 처리할 경우 아무것도 출력하지 않는다.

``` js
render() {
  return (
    <div className={condition ? "salutation" : ""} >
      Hello JSX
    </div>
  )
}

// 위 코드는 다음돠 같은 유효한 자바스크립토 코드로 변환

React.createElement("div", {className: condition ? "salutation" : ""}, "Hello JSX");

// 삼항식은 조건에 따라 전체 노드를 렌더링하는 경우에도 동작한다.

<div>
  { condition ?
    <span>Hello JSX</span>
    : null }
</div>
```

#### 조건을 밖으로 이동

삼항식으로 문제를 해결할 수 없을 때는 조건절을 JSX 안쪽에서 바깥쪽으로 옮기는 방법이 있다.

``` js
render() {
  let className;
  if(condition) {
    className = "salutation";
  }
  return (
    <div className={className}>Hello JSX</div>
  )
}
```

리액트는 정의되지 않을 값을 처리하는 방법을 이해하며, 조건이 false일 경우 div 태그 안에 클래스 특성을 생성하지 않는다.

### 칸반 앱: 카드가 열려있는지 여부 확인

카드 세부 사항을 토글하는 조건을 밖으로 옮기기 위해 이 기법을 이용했다.

이번에는 조건에 따라 카드 제목에 className 하나를 추가하는 삼항식을 이용해보자.

수정코드

``` js
class Card extends Component {
  constructor() {
    //.. 내용 생략
  }

  toggleDetails() {
    //.. 내용 생략
  }

  render() {
    //.. 내용 생략
    }

    return (
      <div className="card">
        <div
          className={
            this.state.showDetails
              ? 'card_title card_title--is-open'
              : 'card_title'
          }
          onClick={this.toggleDetails.bind(this)}
        >
          {this.props.title}
        </div>
        {cardDetails}
      </div>
    );
  }
}
```

#### 공백

HTML의 경우 브라우저는 일반적으로 여러 행의 요소 간에 공백 출력

리액트의 JSX는 분명한 지시가 있을 때만 공백 출력

``` js
return (
  <a href="http://google.com">Google</a>
  <a href="http://facebook.com">facebook</a>
)
// 실행 결과 : Googlefacebook

return (
  <a href="http://google.com">Google</a>{" "}
  <a href="http://facebook.com">facebook</a>
)
// 실행 결과 : Google facebook
```

#### JSX의 주석

JSX는 HTML이 아니므로 HTML의 주석을 지원하지 않는다. 자바스크립트 주석을 이용할 수 있다.

태그의 자식 섹션 안에 주석을 넣을 때는 중괄호로 주석을 감싸야 한다. (브라우저 소스에 나오지 않는다.)

``` js
let content = {
  <Nav>
    {/* 자식 주석이므로 {}로 감싼다. */}
    <Person
      /* 다중
         행
         주석 */
      name = { window.isLoggeIn ? window.name : '' } // 행 끝 주석
    >
  </Nav>
}
```

#### 동적 HTML 렌더링

리액트에는 XSS 공격 방지 기능이 기본적으로 내장돼 있다.

즉, HTML 태그를 동적으로 생성하고 JSXdㅔ 추가하는 작업을 기본적으로 금지한다.

이 기본설정은 보안을 위해 바람직하지만 HTML을 동적으로 생성해야 하는 경우도 있다.(마크다운 렌더링)

리액트는 XSS 보호 기능을 끄고 모든 내용을 곧바로 렌더링하는 dangerouslySetInnerHTML 속성을 제공

#### 칸반 앱: 마크다운 렌더링

``` js
//Card.js

render() {
    let cardDetails;
    if (this.state.showDetails) {
      cardDetails = (
        <div className="card_details">
          <span
            dangerouslySetInnerHTML={{ __html: marked(this.props.description) }}
          />
          <CheckList cardId={this.props.id} tasks={this.props.tasks} />
        </div>
      );
    }

    return (
      //...내용 생략
    );
  }
```

### JSX를 배제하고 리액트 이용

### 인라인 스타일링

JSX로 리액트 컴포넌트를 작성하는 것은 파일 안에 UI 정의(콘텐츠 마크업)와 상호작용(자바스크립트)을 결합하는 것이다.

각 관심사에 대해 잘 캡슐화되고, 독립적이고, 재사용 가능한 컴포넌트를 이용해야 한다. 또한 사용자의 인터페이스의 스타일링을 고려해야 한다.

리액트는 자바스크립트를 이용한 인라인 스타일을 지원한다. 장점은 아래와 같다.

* 셀럭터 없이 스타일의 범위 지정 가능
* 특정성 출동이 예방됨
* 소스 순서에 관계가 없음

#### 인라인 스타일 정의

* 스타일 이름은 DOM속성과의 일관성을 위해 낙타 표기법을 적용해 지정한다.(예 : node.style.backgroundImage )
* 리액트는 자동으로 적절한 단위를 지정하므로 픽셀 단위를 따로 지정할 필요는 없다.

``` js
class Hello extends Component {
  render() {
    let divStyle = {
      width: 100,
      height: 30,
      padding: 5,
      backgroundColor: '#ee9900'
    };
    return <div style={divStyle}>Hello World</div>
  }
}
```

#### 칸반 앱: 인라인 스타일링을 이용한 카드 색상 지정

CSS(또는 Sass나 Less같은 전처리기)를 주 스타일 정의로 이용하고 리액트 컴포넌트에서 인라인 스타일링을 이용해 동적으로 상태 기반 외형을 표현하는 하이브리드 방식이 일반적이다.

1. 데이터 모델에 색상을 추가 App.js

2. 속성을 통해 Card 컴포넌트로 색상 전달. Card의 부모 컴포넌트는 List 컴포넌트.

``` js
class List extends Component {
  render() {
    var cards = this.props.cards.map(card => {
      return (
        <Card
          id={card.id}
          title={card.title}
          description={card.description}
          color={card.color} // 추가
          tasks={card.tasks}
        />
      );
    });

    //...return 문 생략
  }
}
```

3. Card 컴포넌트에서 인라인 스타일을 이용해 div를 만든다.

``` js
// Card.js
render() {
    let cardDetails;
    if (this.state.showDetails) {
      //..내용생략
    }

    let sideColor = {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: 0,
      width: 7,
      backgroundColor: this.props.color,
    };

    return (
      <div className="card">
        <div style={sideColor} />
        //..내용생략
    );
  }
```

### 폼 처리

리액트에서는 컴포넌트의 상태가 변경될 때마다 컴포넌트를 다시 렌더링해야 하므로 컴포넌트의 내부 상태를 최소한으로 유지한다.

리액트가 컴포넌트를 다시 렌더링하는 이유는 자바스크립트 코드상의 컴포넌트 상태를 정확하게 나타내고 인터페이스의 동기화를 유지하기 위해서다.

따라서 사용자가 상호작용하면 상태가 변경되는 `<input>,<textarea>,<option>`과 같은 폼 컴포넌트는 HTML과는 다르게 이용된다.

리액트는 폼을 처리하는 방식이 제어 컴포넌트와 비제어 컴포넌트을 지원한다.

#### 제어 컴포넌트

값이나 확인되는 속성을 가지는 폼 컴포넌트를 제어 컴포넌트라고 한다.

제어 컴포넌트의 요소 안에서 렌더링되는 값은 항상 속성의 값을 반영한다. 기본적으로 사용자는 이를 변경할 수 없다.

칸반 카드의 체크리스트가 이러한 제어 컴포넌트에 해당한다. 즉, 태스크의 체크박스를 클릭해도 체크박스가 바뀌지 않는다. 이 체크박스는 cardsList 배열에 하드코딩한 값을 반영하며 배열 자체를 수정해야 체크박스도 변경된다.

``` js
// Search component
class Search extends Component {
  constructor() {
    super();
    this.state = {
      serachTerm: 'React',
    };
  }

  handleChange(event) {
    this.setState({
      serachTerm: event.target.value,
    });
  }

  render() {
    return (
      <div>
        Search Term:{' '}
        <input
          type="serach"
          value={this.state.serachTerm} // 이 값을 변경할 수 있게 컴포넌트 상태로 처리 그러면 상태 값이 변경될 때마다 인터페이스에 반영 된다.
          onChange={this.handleChange.bind(this)} // 최종 사용자가 상태 값을 업데이트할 수 있게 onChange 이벤트 이용
        />
      </div>
    );
  }
}
```

제어 컴포넌트 장점

* 리액트가 컴포넌트를 다루는 방법을 준수한다. 상태가 인터페이스 바깥의 자바스크립트 코드에서 완전히 관리된다.
* 이 패턴은 사용자 상호작용에 반응하거나 유효성 검사하는 인터페이스를 구현하는 데 유리하다.

  `this.setState({serachTerm: event.target.value.substr(50)});`

#### 특수 사례

제어 폼 컴포넌트 TextArea, Select를 만들때 특수 사례가 있다.

##### TextArea

HTML에서는 자식을 이용해 값을 설정한다.

``` html
<textarea>일반적으로 자식을 이용한 값 여기</textarea>
```

하지만 리액트는 다른 폼 요소와 일관성을 유지하기 위해 value 속성을 이용해 `<textarea>` 값을 결정

``` js
<textarea value="이걸로 값을 결정" />
```

##### Select

HTML에서는 option 태그에 선택된 옵션을 설정하는 데 "selected" 특성을 이용한다.

``` js
<select value="B">
  <option value="A">Mobile</option>
  <option value="B">Work</option>
  <option value="C">Home</option>
</select>
```

#### 비제어 컴포넌트

값(value)을 제공하지 않는 모든 입력 컴포넌트가 비제어 컴포넌트이며 렌더링되는 요소의 값은 사용자의 입력에 의해 결정

``` js
return (
  <form>
    <div className="formGruop">
      Name: <input name="name" type="text" />>
    </div>
    <div className="formGruop">
      E-mail: <input name="email" type="mail" />
    </div>
    <button type="submit">Submit</button>
  </form>
)
```

이 예제는 빈 값으로 시작하는 입력 필드 두 개를 렌더링한다. 사용자가 입력을 시작하면 즉시 렌더링된 요소에 그 내용이 반영된다.

onSubmit을 이용해 비제어 컴포넌트 폼을 처리

``` js
handleSumbit(event) {
  console.log("Submitted values are: ",
    event.target.name.value,
    event.target.email.value);
  event.preventDefault();
}
render() {
  return (
    <form onSubmit = {this.handleSumbit}>
      <div className="formGruop">
        Name: <input name="name" type="text" />>
      </div>
      <div className="formGruop">
        E-mail: <input name="email" type="mail" />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
```

#### 칸반 앱: 태스트 폼 만들기

칸반 앱에 있는 태스크 체크박스는 제어 컴포넌트에 해당한다.

이번에는 새 태스크를 추가하는 데 이용할 필드를 비제어 컴포넌트로 추가해보자.

``` js
class CheckList extends Component {
  render() {
    //...내용 생략
    );
    return (
      <div className="checklist">
        <ul>
          {tasks}
        </ul>
        <input type="text" className="checklist--add-task" placehoder="Type then hit Enter to add a task" />
      </div>
    );
  }
}
```

input에 value 속성을 지정하지 않았으므로 자유롭게 텍스트 필드에 원하는 내용을 입력할 수 있다.

### 가상 DOM의 작동 방식

리액트는 업데이트가 수행될 때마다 모든 것을 다시 렌더링하는 것처럼 API가 구상됐다는 점이다.

DOM조작은 속도가 느리므로 가상 DOM을 구현한다.

실제 DOM을 업데이트 하는 대신 가상 트리를 생성한다.

가상 DOM 트리와 실제 DOM 트리를 동일하게 만드는 데 필요한 최소 변경 횟수를 알아내는 프로세스를 조정이라고 하며, 이 작업은 시간이 오래걸리고 실행 비용이 높다.

리액트는 이 작업을 조금이라도 효율적으로 할려고 애플리케이션 작동 방법에 대해 몇 가지 사항을 가정한다.

* DOM 트리의 노드를 비교할 때 노드가 다른 유형일 경우(예 : div를 span으로 변경) 리액트는 이를 서로 다른 하위 트리로 취급해 첫 번째 항목(div)을 버리고 두번째 항목(span)을 생성/삽입한다.
* 커스텀 컴포넌트에도 동일한 논리를 적용한다. 컴포넌트가 동일한 유형이 아닌 경우 리액트는 컴포넌트가 렌더링하는 내용을 비교조차 하지 않고 DOM에서 첫 번째 항목을 제거 한 후 두 번째 항목을 삽입한다.
* 노드가 같은 유형인 경우 리액트는 둘 중 한 가지 방법으로 처리한다.
    * DOM 요소의 경우(예: `<div id="before" />를 <div id="after" />`로 변경) 리액트는 특성과 스타일만 변경한다(요소 트리는 대체하지 않음)
    * 커스텀 컴포넌트의 경우(예: `<Contact details={false} />를 <Contact details={true} />`로 변경) 리액트는 컴포넌트를 대체하지 않고 새로운 속성을 현재 마운팅된 컴포넌트로 전달한다. 그러면 이 컴포넌트에서 새로 render()가 트리거되고 새로운 결과를 이용한 프로세스사 다시 시작된다.

### 정리
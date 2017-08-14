# 프로리액트 스터디

## 1장 리액트 시작하기

### 첫번째 앱 만들기

#### - 첫번째 컴포넌트 만들기

``` js
import React from 'react';
import ReactDOM from 'react-dom'; // ReactDOM 추가

class Hello extends React.Component {
  render() {
    return <h1>Hello World</h1>;
  }
};
ReactDOM.render(<Hello />, document.getElementById('root'));
```

#### - 모듈 임포트에 구조분해 할당

[구조분해 할당(비구조화 할당)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment "구조분해 할당(비구조화 할당)")

``` js
import React, { Component } from 'react'; // React 모듈 내부의 Component를 직접 접근할 수 있다.
import ReactDOM from 'react-dom'; // ReactDOM 추가

class Hello extends Component {
  render() {
    return <h1>Hello World</h1>;
  }
};
ReactDOM.render(<Hello />, document.getElementById('root'));
```

#### - 동적 값

JSX에서 중괄호({}) 안에 있는 값은 자바스크립트 식으로 계산되고 마크업 안에 렌더링된다. 로컬 변수의 값을 렌더링하려면 다음 예제와 같다.

``` js
render() {
    var place = 'World';
    return (
      <h1>
        동적값 : Hello {place}
      </h1>
    );
  }
```

### 컴포넌트 조합하기

리액트는 재사용 가능한 간단한 컴포넌트를 중첩하고 조합해 복잡한 UI를 만드는 방식을 권장한다.

#### - 속성

부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 메커니즘이다.
속성은 자식 컴포넌트 안에서 변경할 수 없으면 부모 컴포넌트가 전달하고 "소유"한다.

``` js
// 부모 컴포넌트
class GroceryList extends Component {
  render() {
    return (
      <ul>
        <ListItem quantity="1">열기태그</ListItem>
        <ListItem quantity="6">가운데내용</ListItem>
        <ListItem quantity="2">닫기태그</ListItem>
      </ul>
    );
  }
}

// 자식 컴포넌트
class ListItem extends Component {
  render() {
    return (
      <li>
        {this.props.quantity} x {this.props.children}
      </li>
    );
  }
}
```

`this.props.children`은 열기 태그와 닫기 태그 사이에 내용을 참조한다.

#### - 칸반 보드 앱 소개

#### - 컴포넌트 계층 정의

1. 컴포넌트는 단일 관심사를 가져야 하며 작아야 한다. **즉 컴포넌트는 한 가지 일만 해야 한다.** 컴포넌트가 더 성장하는 경우 작은 하위 컴포넌트로 분할해야 한다.
1. 프로젝트의 와이어프레임과 레이아웃을 분석하면 컴포넌트 계층에 대한 많은 힌트를 얻을 수 있다.
1. 데이터 모델에 주목한다. 인터페이스와 데이터 모델은 동일한 정보 아키텍처를 따르는 예가 많기 떄문에 UI를 컴포넌트로 분리하는 작업도 쉽게 해결되는 경우가 많다. **즉, 데이터 모델의 한 조각을 나타내는 컴포넌트로 분리할 수 있다.**

#### - 속성의 중요성

#### - 컴포넌트 만들기

컴포넌트를 만드는 데는 하향식과 상향식의 두 가지 기본적인 접근법이 있다.

* 계층 위쪽에 있는 컴포넌트(ex : App)를 먼저 만들거나 아래쪽에 있는 컴포넌트(ex : CheckList)를 먼저 만들 수 있다.
* 여기서는 속성이 하위 컴포넌트로 전달되는 방법과 자식 컴포넌트에서 이용되는 방법을 이해하는데 도움이 되도록 하향식으로 한다.

#### - 앱 모듈(App.js)

#### - KanbanBoard 컴포넌트(KanbanBoard.js)

KanbanBoard 컴포넌트는 데이터를 속성을 통해 받고 상태를 필터링해 List 컴포넌트 세 개("To do", "In Progress", "Done")를 만드는 역할을 한다.

cards를 받아 card.status가 todo인것만 filter하여 cards에 할당
[Array - filter](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter "Array filter")

``` js
<List id="todo" title="To do" cards={
          this.props.cards.filter((card) => card.status === "todo")
        } />
```

전체 코드

``` js
import React, { Component } from 'react';
import List from './List';

class KanbanBoard extends Component {
  render() {
    return (
      <div className="app">
        <List
          id="todo"
          title="To do"
          cards={this.props.cards.filter(card => card.status === 'todo')}
        />
        <List
          id="todo"
          title="in-progress"
          cards={this.props.cards.filter(card => card.status === 'in-progress')}
        />
        <List
          id="todo"
          title="Done"
          cards={this.props.cards.filter(card => card.status === 'Done')}
        />
      </div>
    );
  }
}
```

#### - List 컴포넌트(List.js)

List컴포넌트는 목록의 이름을 표시하고 그 안에 들어 있는 모든 Card 컴포넌트를 렌더링한다. List컴포넌트는 속성을 통해 cards 배열을 받은 제목이나 설명과 같은 개별 정보를 다시 속성을 통해 Card 컴포넌트에 전달한다.
map을 이용해 cards배열 정보들을 Card 컴포넌트로 전달

전체 코드

``` js
import React, { Component } from 'react';
import Card from './Card';

class List extends Component {
  render() {
    var cards = this.props.cards.map(card => {
      return (
        <Card
          id={card.id}
          title={card.title}
          description={card.description}
          tasks={card.tasks}
        />
      );
    });

    retun(
      <div className="list">
        <h1>
          {this.props.title}
        </h1>
        {cards}
      </div>
    );
  }
}

export default List;
```

#### - Card 컴포넌트(Card.js)

Card는 사용자 상호작용이 주로 수행하는 컴포넌트.

전체 코드

``` js
import React, { Component } from 'react';
import CheckList from './CheckList';

class Card extends Component {
  render() {
    return (
      <div className="card">
        <div className="card_title">
          {this.props.title}
        </div>
        <div className="card_details">
          {this.props.description}
          <CheckList cardId={this.props.id} tasks={this.props.tasks} />
        </div>
      </div>
    );
  }
}

export default Card;

```

#### - Checklist 컴포넌트(CheckList.js)

마지막으로 카드 밑 부분에 표시되는 체크리스트에 해당하는 Checklist 컴포넌트가 있다.

전체코드

``` js
import React, { Component } from 'react';

class Checklist extends Component {
  render() {
    let tasks = this.props.task.map(task =>
      <li className="checklist_task">
        <input type="checkbox" defaultChecked={task.done} />
        {task.name}
        <a href="#" className="checklist_task--remove" />
      </li>
    );
    return (
      <div className="checklist">
        <ul>
          {tasks}
        </ul>
      </div>
    );
  }
}

export default Checklist;
```

#### - 마무리작업

style.css

### 상태 소개

속성은 컴포넌트로 전달되며 변경 불가였다. 즉, 정적 컴포넌트를 위한것이었다.

컴포넌트가 동작과 상호작용을 수행할 수 있으려면 현재 상태를 나타는 쓰기 가능데이터가 필요하다.

**리액트의 컴포넌트는 `this.state`안에 여러 데이터를 가질 수 있다. `this.state`는 특정 컴포넌트 전용이며, `this.setState()`를 호출해 변경할 수 있다.**

**상태가 업데이트되면 컴포넌트의 반응형 렌더링이 트리거되고 해당 컴포넌트와 그 자식이 다시 렌더링 된다.**

#### 칸반 앱: 토글되는 카드

컴포넌트의 상태를 이용해 칸반 앱에 새로운 기능을 추가해보자. 즉, 카드를 토글 가능하게 만들어 사용자가 카드 세부 사항을 표시하거나 숨길 수 있게 만들어보자.

* 언제든지 새로운 상태를 설정할 수 있지만 **컴포넌트가 초기 상태를 갖게 하려면 클래스 생성자에서 상태를 설정**해야 한다.
* Card 컴포넌트에는 아직 생성저가 없고 render 메서드 하나만 있다.
* showDeatils라는 새로운 키를 컴포넌트의 상태로 정의하는 생성자 함수를 추가해보자

``` js
import React, { Component } from 'react';
import CheckList from './CheckList';

class Card extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      showDetails: false,
    };
  }
  render() {
    let cardDetails;
    if (this.state.showDetails) {
      cardDetails = (
        <div className="card_details">
          {this.props.description}
          <CheckList cardId={this.props.id} tasks={this.props.tasks} />
        </div>
      );
    }

    return (
      <div className="card">
        <div
          className="card_title"
          onClick={() =>
            this.setState({ showDetails: !this.state.showDetails })}
        >
          {this.props.title}
        </div>
        {cardDetails}
      </div>
    );
  }
}

export default Card;
```

showDetails 상태 속성이 true일 때만 카드 세부 사항을 렌더링하게 했다.
이를 위해 cardDetails라는 로컬 변수를 선언하고, 현재 shoDetails 상태가 true일때만 실제 데이터를 할당한다.

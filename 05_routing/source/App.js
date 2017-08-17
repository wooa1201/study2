import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // ReactDOM 추가

import { Router, Route, Link } from 'react-router';

import About from './About';
import Home from './Home';
import Repos from './Repos';

class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      route: window.location.hash.substr(1),
    };
  }

  render() {
    return (
      <div>
        <header>App</header>
        <menu>
          <ul>
            <li>
              <Link to="#/about">About</Link>
            </li>
            <li>
              <Link to="#/repos">repos</Link>
            </li>
          </ul>
        </menu>
        {this.props.children}
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <Route path="about" componet={About} />
      <Route path="repos" compoent={Repos} />
    </Route>
  </Router>,
  document.getElementById('root')
);

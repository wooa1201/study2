import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update'
import KanbanBoard from './KanbanBoard';
import {throttle} from './utils';

import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'any-string-you-like'
};

class KanbanBoardContainer extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cards: [],
    };
    this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this),500);
  }

  componentDidMount() {
    fetch(API_URL+'/cards', {headers: API_HEADERS}).then((response) => response.json()).then((responseData) => {
      console.log(responseData);
      this.setState({cards: responseData});
    }).catch((error) => {
      console.log('Error fetching and parsing data', error);
    });

  }

  addTask(cardId, taskName) {
    let cardIndex = this.state.cards.findIndex((card)=>card.id === cardId);
    let newTask = {id:Date.now(), name:taskName, done:false};
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {$push: [newTask]}
      }
    });

    let prevState = this.state;
    this.setState({cards:nextState});
    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask)
    })
    .then((response) => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Server response wasn't OK")
      }
    })
    .then((responseData) => {
      newTask.id=responseData.id
      this.setState({cards:nextState});
    })
    .catch((error) => {
      this.setState(prevState);
    });
  }

  deleteTask(cardId, taskId, taskIndex) {
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {$splice: [[taskIndex,1]]}
      }
    });
    let prevState = this.state;
    this.setState({ cards: nextState });
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS
    })
    .then((response) => {
      if(!response.ok){
        throw new Error("Server response wasn't OK")
      }
    })
    .catch((error) => {
      console.error("Fetch error:",error)
      this.setState(prevState);
    });
  }

  toggleTask(cardId, taskId, taskIndex) {
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
    let newDoneValue;
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        task: {
          [taskIndex]: {
            done: { $apply: (done) => {
              newDoneValue = !done
              return newDoneValue;
            }}
          }
        }
      }
    });

    let prevState = this.state;

    this.setState({nextState});

    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({done: newDoneValue})
    }).then((response) => {
      if(!response.ok){
        throw new Error("Server response wasn't OK")
      }
    })
    .catch((error) => {
      console.error("Fetch error:",error)
      this.setState(prevState);
    });;
  }

  updateCardStatus(cardId, listId) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
    let card = this.state.cards[cardIndex];
    if(card.status !== listId) {
      this.setState(update(this.state, {
        cards: {
          [cardIndex]: {
            status: { $set: listId }
          }
        }
      }));
    }
  }

  updateCardPosition(cardId, afterId) {
    if(cardId !== afterId) {
      let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
      let card = this.state.cards[cardIndex];
      let afterIndex = this.state.cards.findIndex((card)=>card.id == afterId);
      this.setState(update(this.state, {
        cards: {
          $splice: [
            [cardIndex, 1],
            [afterIndex, 0, card]
          ]
        }
      }));
    }
  }

  render() {
    return <KanbanBoard cards={this.state.cards}
          taskCallbacks={{
            toggle: this.toggleTask.bind(this),
            delete: this.deleteTask.bind(this),
            add: this.addTask.bind(this)
          }}
          cardCallbacks = {{
            updateStatus: this.updateCardStatus,
            updatePosition: this.updateCardPosition
          }}
    />
  }
}

export default KanbanBoardContainer;

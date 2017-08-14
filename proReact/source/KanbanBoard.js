import React, { Component } from 'react';
import List from './List';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class KanbanBoard extends Component {
  render() {
    return (
      <div className="app">
        <List
          id="todo"
          title="To do"
          taskCallbacks={this.props.taskCallbacks}
          cardCallbacks={this.props.cardCallbacks}
          cards={this.props.cards.filter(card => card.status === 'todo')}
        />
        <List
          id="todo"
          title="in-progress"
          taskCallbacks={this.props.taskCallbacks}
          cardCallbacks={this.props.cardCallbacks}
          cards={this.props.cards.filter(card => card.status === 'in-progress')}
        />
        <List
          id="todo"
          title="Done"
          taskCallbacks={this.props.taskCallbacks}
          cardCallbacks={this.props.cardCallbacks}
          cards={this.props.cards.filter(card => card.status === 'Done')}
        />
      </div>
    );
  }
}
KanbanBoard.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object,
  cardCallbacks: PropTypes.object
}
export default DragDropContext(HTML5Backend)(KanbanBoard);

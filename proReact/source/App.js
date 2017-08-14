import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // ReactDOM 추가
import KanbanBoardContainer from './KanbanBoardContainer';

let cardsList = [
  {
    id: 1,
    title: 'Read the book',
    description: 'I should read the whole book',
    color: '#bd8d31',
    status: 'in-progress',
    tasks: [],
  },
  {
    id: 2,
    title: 'Write some code',
    description:
      'Code along with the samples in the book [github](https://github.com)',
    color: '#3a7e28',
    status: 'todo',
    tasks: [
      {
        id: 1,
        name: 'ContactList Example',
        done: true,
      },
      {
        id: 2,
        name: 'Kanban Example',
        done: false,
      },
      {
        id: 3,
        name: 'My own experiments',
        done: false,
      },
    ],
  },
];

ReactDOM.render(
  <KanbanBoardContainer cards={cardsList} />,
  document.getElementById('root')
);

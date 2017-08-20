import React from 'react';
import { Container } from 'flux/utils';

import BankActions from './BankActions';

class App extends React.Component {
  constructor() {
    super(...arguments);
    BankActions.createAccount();
  }

  deposit() {
    BankActions.depositIntoAccount(Number(this.refs.amount.value));
    this.refs.amount.value = '';
  }

  withdraw() {
    BankActions.withdrawFromAccount(Number(this.refs.amount.value));
    this.refs.amount.value = '';
  }

  render() {
    return (
      <div>
        <header>FluxTrust Bank</header>
        <h1>Your Balance is ${this.state.balance.toFixed(2)}</h1>
        <h2>Your Points Rewards Tier is {this.state.rewardsTier}</h2>
        <div className="atm">
          <input type="text" placeholder="Enter Amount" ref="amount" />
          <br />
          <button onClick={this.withdraw.bind(this)}>withdraw</button>
          <button onClick={this.deposit.bind(this)}>deposit</button>
        </div>
      </div>
    );
  }
}

export default App;

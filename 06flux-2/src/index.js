import React from 'react';
import { Container } from 'flux/utils';
import ReactDOM from 'react-dom';
import BankBalanceStore from './components/BankBalanceStore';
import BankRewardsStore from './components/BankRewardsStore';
import App from './components/App';

App.getStores = () => [BankBalanceStore, BankRewardsStore];
App.calculateState = prevState => ({
  balance: BankBalanceStore.getState(),
  rewardsTier: BankRewardsStore.getState(),
});

const AppContainer = Container.create(App);

const rootElement = document.getElementById('root');
ReactDOM.render(<AppContainer />, rootElement);

import AppDispatcher from './AppDispatcher';
import { ReduceStore } from 'flux/utils';
import bankConstants from './constants';

let balance = 0;

class BankBalanceStore extends ReduceStore {
  getInitialState() {
    return 0;
  }

  reduce(state, action) {
    switch (action.type) {
      case bankConstants.CREATED_ACCOUNT:
        return 0;

      case bankConstants.DEPOSITED_INTO_ACCOUNT:
        return state + action.amount;

      case bankConstants.WITHDREW_FROM_ACCOUNT:
        return state - action.amount;

        deafult: return state;
    }
  }
}

export default new BankBalanceStore(AppDispatcher);

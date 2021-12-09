import * as  types from '../actions/types';

const initialState = {
    account: ""
}

function mysteryReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case types.SET_ACCOUNT:
        return {
          ...state,
          account: payload
        };
      default:
        return state;
    }
  }
  
  export default mysteryReducer;
  
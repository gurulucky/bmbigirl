import { SET_ACCOUNT } from './types';

export const setAccount = (account) => dispatch => {
    dispatch({
        type: SET_ACCOUNT,
        payload: account
    })
}
import {Map} from 'immutable';
import {combineReducers} from 'redux';

const authState = new Map({
  token: '',
  errorMessage: '',
  isLoading: false,
});

function authorization(state = authState, action) {
  switch (action.type) {
  case 'GET_TOKEN':
    return action.token ? state.set('token', action.token) : state;

  case 'LOGIN':
  case 'REGISTER':
    return state
    .set('isLoading', true)
    .set('errorMessage', '');

  case 'LOGIN_SUCCESS':
  case 'REGISTER_SUCCESS':
    return state
    .set('isLoading', false)
    .set('token', action.token);

  case 'LOGIN_ERROR':
  case 'REGISTER_ERROR':
    return state
    .set('isLoading', false)
    .set('errorMessage', action.errorMessage);

  case 'LOGOUT':
    return state.set('token', '');

  default:
    return state;
  }
}

export default combineReducers({
  authorization,
});

import {Map} from 'immutable';

const authState = new Map({
  token: '',
  errorMessage: '',
  isLoading: false,
  missingData: false,
});

export default function authorization(state = authState, action) {
  switch (action.type) {
  case 'GET_TOKEN':
    return action.token ? state.set('token', action.token) : state;

  case 'AUTH':
    return state
    .set('isLoading', true)
    .set('errorMessage', '');

  case 'AUTH_SUCCESS':
    return state
    .set('isLoading', false)
    .set('token', action.token);

  case 'AUTH_ERROR':
    return state
    .set('isLoading', false)
    .set('errorMessage', action.errorMessage);

  case 'LOGOUT':
    return state.set('token', '');

  default:
    return state;
  }
}

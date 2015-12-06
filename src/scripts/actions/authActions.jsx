import {authRequest} from '../apiService';

export function getTokenFromStorage() {
  const token = localStorage.getItem('token');
  return {type: 'GET_TOKEN', token};
}

function authSuccess(token) {
  localStorage.setItem('token', token);
  return {type: 'AUTH_SUCCESS', token};
}

function authError(errorMessage) {
  return {type: 'AUTH_ERROR', errorMessage};
}

function auth(action, email, password) {
  return dispatch => {
    dispatch({type: 'AUTH'});
    return authRequest(action, email, password)
    .then(response => dispatch(authSuccess(response.data.token)))
    .catch(response => dispatch(authError(response.data ? response.data.message : response.message)));
  };
}

export function login(email, password) {
  return auth('login', email, password);
}

export function register(email, password) {
  return auth('register', email, password);
}

export function logout() {
  localStorage.removeItem('token');
  return {type: 'LOGOUT'};
}

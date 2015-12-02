import {post} from 'axios';

export function getTokenFromStorage() {
  const token = localStorage.getItem('token');
  return {type: 'GET_TOKEN', token};
}

function loginSuccess(token) {
  localStorage.setItem('token', token);
  return {type: 'LOGIN_SUCCESS', token};
}

function loginError(errorMessage) {
  return {type: 'LOGIN_ERROR', errorMessage};
}

export function login(email, password) {
  return dispatch => {
    dispatch({type: 'LOGIN'});
    return post('../api', {email, password}, {
      params: {
        action: 'login',
      },
    })
    .then(response => dispatch(loginSuccess(response.data.token)))
    .catch(response => dispatch(loginError(response.data.message)));
  };
}

function registerSuccess(token) {
  return {type: 'REGISTER_SUCCESS', token};
}

function registerError(errorMessage) {
  return {type: 'REGISTER_ERROR', errorMessage};
}

export function register(email, password) {
  return dispatch => {
    dispatch({type: 'REGISTER'});
    return post('../api', {email, password}, {
      params: {
        action: 'register',
      },
    })
    .then(response => dispatch(registerSuccess(response.data.token)))
    .catch(response => dispatch(registerError(response.data.message)));
  };
}

export function logout() {
  localStorage.removeItem('token');
  return {type: 'LOGOUT'};
}

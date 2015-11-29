import {post} from 'axios';
import {bindActionCreators} from 'redux';

export function getTokenFromStorage() {
  const token = localStorage.getItem('token');
  return {type: 'GET_TOKEN', token};
}

function loginSuccess(response) {
  return {type: 'LOGIN_SUCCESS', token: response.data.token};
}

function loginError(response) {
  return {type: 'LOGIN_ERROR', errorMessage: response.data.message};
}

export function login(email, password) {
  return dispatch => {
    const {boundLoginSuccess, boundLoginError} = bindActionCreators({loginSuccess, loginError}, dispatch);
    dispatch({type: 'LOGIN'});
    return post('/api', {email, password}, {
      params: {
        action: 'test',
      },
    })
    .then(boundLoginSuccess)
    .catch(boundLoginError);
  };
}

function registerSuccess(response) {
  return {type: 'REGISTER_SUCCESS', token: response.data.token};
}

function registerError(response) {
  return {type: 'REGISTER_ERROR', errorMessage: response.data.message};
}

export function register(email, password) {
  return dispatch => {
    const {boundRegisterSuccess, boundRegisterError} = bindActionCreators({registerSuccess, registerError}, dispatch);
    dispatch({type: 'REGISTER'});
    return post('/api', {email, password}, {
      params: {
        action: 'test',
      },
    })
    .then(boundRegisterSuccess)
    .catch(boundRegisterError);
  };
}

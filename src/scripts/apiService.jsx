import {get, post} from 'axios';

function createOptions(params, token = '') {
  const options = {params};
  if (token) {
    options.headers = {Authorization: `Bearer ${token}`};
  }
  return options;
}

export function authRequest(action, email, password) {
  return post('../api', {email, password}, createOptions({action}));
}

export function getProfileRequest(token) {
  return get('../api', createOptions({action: 'profile'}, token));
}

export function setProfileRequest(token, profile) {
  return post('../api', {...profile}, createOptions({action: 'profile'}, token));
}

export function getRandomProfileRequest(token) {
  return get('../api', createOptions({action: 'randomProfile'}, token));
}

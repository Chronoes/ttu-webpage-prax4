import {get, post} from 'axios';

function createOptions(action, token = '', params = {}) {
  const options = {params: {action, ...params}};
  if (token) {
    options.headers = {Authorization: `Bearer ${token}`};
  }
  return options;
}

export function authRequest(action, email, password) {
  return post('../api', {email, password}, createOptions(action));
}

export function getProfileRequest(token) {
  return get('../api', createOptions('profile', token));
}

export function setProfileRequest(token, profile) {
  return post('../api', {...profile}, createOptions('profile', token));
}

export function getRandomProfileRequest(token) {
  return get('../api', createOptions('randomProfile', token));
}

export function addLikeRequest(token, id) {
  return post('../api', {id}, createOptions('addLike', token));
}

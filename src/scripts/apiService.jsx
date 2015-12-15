import {get, post, put} from 'axios';

function createOptions(action, token = '', params = {}) {
  const options = {params: {action, ...params}};
  if (token) {
    options.headers = {Authorization: `Bearer ${token}`};
  }
  return options;
}

export function authRequest(action, email, password) {
  return post('../api/index.php', {email, password}, createOptions(action));
}

export function getProfileRequest(token) {
  return get('../api/index.php', createOptions('profile', token));
}

export function setProfileRequest(token, profile) {
  return put('../api/index.php', {...profile}, createOptions('profile', token));
}

export function getRandomProfileRequest(token, currentId) {
  return get('../api/index.php', createOptions('randomProfile', token, currentId ? {currentId} : {}));
}

export function addLikeRequest(token, id) {
  return post('../api/index.php', {id}, createOptions('addLike', token));
}

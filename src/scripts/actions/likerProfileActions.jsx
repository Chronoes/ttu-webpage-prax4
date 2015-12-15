import {getRandomProfileRequest, addLikeRequest} from '../apiService';

function getProfileSuccess(profile) {
  return {type: 'GET_LIKER_PROFILE_SUCCESS', profile};
}

function getProfileError(errorMessage) {
  return {type: 'GET_LIKER_PROFILE_ERROR', errorMessage};
}

export function getLikerProfile(token, currentId) {
  return dispatch => {
    dispatch({type: 'GET_LIKER_PROFILE'});
    return getRandomProfileRequest(token, currentId)
    .then(response => dispatch(getProfileSuccess(response.data.profile)))
    .catch(response => dispatch(getProfileError(response.data ? response.data.message : response.message)));
  };
}

export function addLike(token, id) {
  addLikeRequest(token, id);
  return {type: 'ADD_LIKE'};
}

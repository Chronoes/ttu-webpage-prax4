import {getRandomProfileRequest} from '../apiService';

function getProfileSuccess(profile) {
  return {type: 'GET_LIKER_PROFILE_SUCCESS', profile};
}

function getProfileError(errorMessage) {
  return {type: 'GET_LIKER_PROFILE_ERROR', errorMessage};
}

export function getLikerProfile(token) {
  return dispatch => {
    dispatch({type: 'GET_LIKER_PROFILE'});
    return getRandomProfileRequest(token)
    .then(response => dispatch(getProfileSuccess(response.data.profile)))
    .catch(response => dispatch(getProfileError(response.data ? response.data.message : response.message)));
  };
}

import {getProfileRequest, setProfileRequest} from '../apiService';

function getProfileSuccess(profile) {
  return {type: 'GET_PROFILE_SUCCESS', profile};
}

function getProfileError(errorMessage) {
  return {type: 'GET_PROFILE_ERROR', errorMessage};
}

export function getProfile(token) {
  return dispatch => {
    dispatch({type: 'GET_PROFILE'});
    return getProfileRequest(token)
    .then(response => dispatch(getProfileSuccess(response.data.profile)))
    .catch(response => dispatch(getProfileError(response.data ? response.data.message : response.message)));
  };
}

function setProfileSuccess(profile) {
  return {type: 'SET_PROFILE_SUCCESS', profile};
}

function setProfileError(errorMessage) {
  return {type: 'SET_PROFILE_ERROR', errorMessage};
}

export function setProfile(token, profile) {
  return dispatch => {
    dispatch({type: 'SET_PROFILE'});
    return setProfileRequest(token, profile)
    .then(response => dispatch(setProfileSuccess(response.data.profile)))
    .catch(response => dispatch(setProfileError(response.data ? response.data.message : response.message)));
  };
}

export function changeProfile() {
  return {type: 'CHANGE_PROFILE'};
}

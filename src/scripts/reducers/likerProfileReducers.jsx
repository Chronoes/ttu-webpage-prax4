import {Map} from 'immutable';

const likerProfileState = new Map({
  errorMessage: '',
  isLoading: false,
  displayName: '',
  fullName: '',
  gender: '',
  imageURI: '',
  description: '',
});

export default function likerProfile(state = likerProfileState, action) {
  switch (action.type) {
  case 'GET_LIKER_PROFILE':
    return state
    .set('errorMessage', '')
    .set('isLoading', true);

  case 'GET_LIKER_PROFILE_SUCCESS':
    return state
    .set('isLoading', false)
    .merge(action.profile);

  case 'GET_LIKER_PROFILE_ERROR':
    return state
    .set('isLoading', false)
    .set('errorMessage', action.errorMessage);

  default:
    return state;
  }
}

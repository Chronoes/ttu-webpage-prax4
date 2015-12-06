import {Map} from 'immutable';

const profileState = new Map({
  errorMessage: '',
  isLoading: false,
  displayName: '',
  fullName: '',
  gender: '',
  imageURI: '',
  description: '',
});

export default function profile(state = profileState, action) {
  switch (action.type) {
  case 'GET_PROFILE':
  case 'SET_PROFILE':
    return state
    .set('errorMessage', '')
    .set('isLoading', true);

  case 'GET_PROFILE_SUCCESS':
  case 'SET_PROFILE_SUCCESS':
    return state
    .set('isLoading', false)
    .merge(action.profile);

  case 'GET_PROFILE_ERROR':
  case 'SET_PROFILE_ERROR':
    return state
    .set('isLoading', false)
    .set('errorMessage', action.errorMessage);

  default:
    return state;
  }
}

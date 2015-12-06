import {combineReducers} from 'redux';
import authorization from './reducers/authReducers';
import profile from './reducers/profileReducers';
import likerProfile from './reducers/likerProfileReducers';

export default combineReducers({
  authorization,
  profile,
  likerProfile,
});

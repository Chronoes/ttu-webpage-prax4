import {combineReducers} from 'redux';
import authorization from './reducers/authReducers';
import profile from './reducers/profileReducers';

export default combineReducers({
  authorization,
  profile,
});

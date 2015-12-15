import React, {PropTypes as Types} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {decode} from 'jsonwebtoken';

import UserProfile from '../components/UserProfile';
import Liker from '../components/Liker';
import {logout} from '../actions/authActions';
import {setProfile, changeProfile} from '../actions/profileActions';
import {getLikerProfile, addLike} from '../actions/likerProfileActions';

const MainPage = ({token, profile, likerProfile, dispatch}) => {
  const {email} = decode(token);
  const changeProfileRequest = profile.get('changeProfile');
  return (
    <div className="container-fluid">
      <div className="row text-center">
        <div className="btn-group">
          <button className={'btn ' + (changeProfileRequest ? 'btn-primary' : 'btn-secondary')} onClick={() => dispatch(changeProfile())}>Settings</button>
          <button className="btn btn-secondary" onClick={() => dispatch(logout())}>Logout</button>
        </div>
      </div>
      <div className="row">
        {!(profile.get('fullName') && profile.get('displayName') && profile.get('imageURI')) || changeProfileRequest ?
          <UserProfile
            profile={profile}
            email={email}
            setProfile={newProfile => dispatch(setProfile(token, newProfile))} /> :
          <Liker
            getProfile={currentId => dispatch(getLikerProfile(token, currentId))}
            giveLike={() => dispatch(addLike(token, likerProfile.get('id')))}
            profile={likerProfile} />}
      </div>
    </div>
  );
};

MainPage.displayName = 'MainPage';
MainPage.propTypes = {
  dispatch: Types.func.isRequired,
  token: Types.string.isRequired,
  profile: Types.instanceOf(Map).isRequired,
  likerProfile: Types.instanceOf(Map).isRequired,
};

export default connect(({profile, likerProfile}) => {
  return {profile, likerProfile};
})(MainPage);

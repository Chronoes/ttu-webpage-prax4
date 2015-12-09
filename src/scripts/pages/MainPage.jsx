import React, {PropTypes as Types} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {decode} from 'jsonwebtoken';

import UserProfile from '../components/UserProfile';
import Liker from '../components/Liker';
import {logout} from '../actions/authActions';
import {setProfile} from '../actions/profileActions';
import {getLikerProfile, addLike} from '../actions/likerProfileActions';

const MainPage = ({token, profile, likerProfile, dispatch}) => {
  const {email} = decode(token);
  return (
    <div className="container-fluid">
      {!(profile.get('fullName') && profile.get('displayName') && profile.get('imageURI')) ?
        <UserProfile
          profile={profile}
          email={email}
          setProfile={newProfile => dispatch(setProfile(token, newProfile))} /> :
        <Liker
          getProfile={() => dispatch(getLikerProfile(token))}
          giveLike={() => dispatch(addLike(token, likerProfile.get('id')))}
          profile={likerProfile} />}
      <button onClick={() => dispatch(logout())}>Logout</button>
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

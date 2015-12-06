import React, {Component, PropTypes as Types} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {decode} from 'jsonwebtoken';

import UserProfile from '../components/UserProfile';
import Liker from '../components/Liker';
import {logout} from '../actions/authActions';
import {getProfile, setProfile} from '../actions/profileActions';
import {getLikerProfile} from '../actions/likerProfileActions';

class MainPage extends Component {
  static displayName = 'MainPage';
  static propTypes = {
    dispatch: Types.func.isRequired,
    token: Types.string.isRequired,
    profile: Types.instanceOf(Map).isRequired,
    likerProfile: Types.instanceOf(Map).isRequired,
  };

  componentWillMount() {
    this.props.dispatch(getProfile(this.props.token));
  }

  render() {
    const {token, profile, likerProfile, dispatch} = this.props;
    const {email} = decode(token);
    return (
      <div className="container-fluid">
        {!(profile.get('fullName') && profile.get('displayName') && profile.get('imageURI')) ?
          <UserProfile
            profile={profile}
            email={email}
            setProfile={newProfile => dispatch(setProfile(token, newProfile))} /> :
          <Liker getProfile={() => dispatch(getLikerProfile(token))} profile={likerProfile} />}
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    );
  }
}

export default connect(({authorization, ...profiles}) => {
  return {
    token: authorization.get('token'),
    ...profiles,
  };
})(MainPage);

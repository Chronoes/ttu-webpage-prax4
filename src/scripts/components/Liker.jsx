import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

class Liker extends Component {
  static displayName = 'Liker';
  static propTypes = {
    profile: Types.instanceOf(Map).isRequired,
    getProfile: Types.func.isRequired,
  };

  componentWillMount() {
    this.props.getProfile();
  }

  render() {
    const {profile, getProfile} = this.props;
    const description = profile.get('description');
    return (
      <div className="liker-container">
        <div className="liker">
          <button className="liker__button btn-danger" onClick={getProfile}>Nope</button>
          <div className="liker__profile">
            <img src={profile.get('imageURI')} alt="Profile image" />
            <div className="card-block">
              <h5 className="card-title">{profile.get('displayName')}</h5>
              <p className="card-text">{description ? description : <i>This user has not provided a description.</i>}</p>
            </div>
          </div>
          <button className="liker__button btn-success" onClick={getProfile}>Ayup</button>
        </div>
      </div>
    );
  }
}

export default Liker;

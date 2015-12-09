import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

class Liker extends Component {
  static displayName = 'Liker';
  static propTypes = {
    profile: Types.instanceOf(Map).isRequired,
    getProfile: Types.func.isRequired,
    giveLike: Types.func.isRequired,
  };

  componentWillMount() {
    this.props.getProfile();
  }

  render() {
    const {profile, getProfile, giveLike} = this.props;
    const description = profile.get('description');
    const fullName = profile.get('fullName');
    const userLiked = profile.get('userLiked');
    return (
      <div className="liker-container">
        <div className="liker">
          <button className={'liker__button ' + (userLiked ? '--inactive' : '--danger')} onClick={getProfile}>Nope</button>
          <div className="liker__profile">
            <img src={profile.get('imageURI')} alt="Profile image" />
            <div className="card-block">
              <h5 className="card-title">{profile.get('displayName')} {fullName && userLiked ? <small className="text-muted">{fullName}</small> : ''}</h5>
              {userLiked ? <div className="text-right"><mark className="card-text">This user has liked you!</mark></div> : ''}
              <p className="card-text">{description ? description : <em>This user has not provided a description.</em>}</p>
            </div>
          </div>
          {userLiked ?
            <button className="liker__button --primary" onClick={() => getProfile()}>Next</button> :
            <button className="liker__button --success" onClick={() => {giveLike(); getProfile();}}>Ayup</button>}
        </div>
      </div>
    );
  }
}

export default Liker;

import React, {Component, PropTypes as Types} from 'react';
import {Map} from 'immutable';

import Preloader from './Preloader';
import FileUpload from './FileUpload';

class UserProfile extends Component {
  static displayName = 'UserProfile';
  static propTypes = {
    email: Types.string.isRequired,
    profile: Types.instanceOf(Map).isRequired,
    setProfile: Types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      imageURI: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({errorMessage: nextProps.profile.get('errorMessage')});
  }

  onSubmit(event) {
    event.preventDefault();
    const displayName = this.refs.displayName.value.trim();
    const fullName = this.refs.fullName.value.trim();
    const description = this.refs.description.value.trim();
    const {imageURI} = this.state;
    const errorMessages = [];

    if (!displayName) {
      errorMessages.push('Please enter a display name');
    }

    if (!fullName) {
      errorMessages.push('Please enter your full name');
    }

    if (!imageURI) {
      errorMessages.push('Please select a profile image');
    }

    if (errorMessages.length) {
      this.setState({errorMessage: errorMessages.shift()});
    } else {
      this.props.setProfile({displayName, fullName, description, imageURI});
      this.setState({errorMessage: ''});
    }
  }

  saveImage(data) {
    this.setState({imageURI: data.target.result});
  }

  render() {
    const {email, profile} = this.props;
    const {errorMessage, imageURI} = this.state;
    return (
      <div className="form-container">
        <div className="card">
          <form className="card-block" onSubmit={this.onSubmit.bind(this)}>
            <h4 className="card-title">Welcome {email}!</h4>
            <p className="card-text">To continue, please supply the additional info below:</p>
            <div className="form-group">
              <input
                type="text"
                ref="displayName"
                className="form-control"
                placeholder="Display name"
                required />
            </div>
            <div className="form-group">
              <input
                type="text"
                ref="fullName"
                className="form-control"
                placeholder="Full name"
                required />
            </div>
            <div className="form-group">
              <label className="radio-inline">
                <input type="radio" value="M" name="gender" required /> Male
              </label>
              <label className="radio-inline">
                <input type="radio" value="F" name="gender" /> Female
              </label>
            </div>
            <div className="form-group">
              <FileUpload ref="image" handleFile={this.saveImage.bind(this)} />
              {imageURI ? <img className="img-thumbnail img-responsive" src={imageURI} /> : <small className="text-muted">Insert your profile image here</small>}
            </div>
            <div className="form-group">
              <textarea
                ref="description"
                className="form-control"
                placeholder="Enter your description here"
                rows="3" />
            </div>
            {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : ''}
            <div className="form-group btn-form">
            {profile.get('isLoading') ?
              <Preloader /> :
              <input
                type="submit"
                value="submit"
                className="btn btn-primary btn-block"
                id="SubmitButton" />}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default UserProfile;

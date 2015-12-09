import React, {Component, PropTypes as Types} from 'react';
import {connect} from 'react-redux';

import {getTokenFromStorage} from './actions/authActions';
import {getProfile} from './actions/profileActions';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

class App extends Component {
  static displayName = 'App';
  static propTypes = {
    token: Types.string.isRequired,
    dispatch: Types.func.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(getTokenFromStorage());
  }

  componentWillReceiveProps(nextProps) {
    const {token} = nextProps;
    if (token) {
      nextProps.dispatch(getProfile(token));
    }
  }

  render() {
    const {token} = this.props;
    return (
      <div>
        {token.length === 0 || token === 'undefined' ?
          <LoginPage /> :
          <MainPage token={token} />}
      </div>
    );
  }
}

export default connect(({authorization}) => {
  return {token: authorization.get('token')};
})(App);

import React, {PropTypes as Types} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {login, register} from '../actions/authActions';
import LoginForm from '../components/LoginForm';

const LoginPage = ({dispatch, ...otherProps}) => (
  <div className="container-fluid">
    <div className="row">
      <LoginForm {...otherProps} {...bindActionCreators({login, register}, dispatch)} />
    </div>
  </div>
);

LoginPage.displayName = 'LoginPage';
LoginPage.propTypes = {
  dispatch: Types.func.isRequired,
  errorMessage: Types.string,
  isLoading: Types.bool,
};

export default connect(state => {
  return {
    errorMessage: state.authorization.get('errorMessage'),
    isLoading: state.authorization.get('isLoading'),
  };
})(LoginPage);

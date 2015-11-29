import React, {PropTypes as Types} from 'react';
import {connect} from 'react-redux';

import {logout} from '../actions';

const MainPage = ({token, dispatch}) => {
  return (
    <div className="container-fluid">
      {token}
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

MainPage.displayName = 'MainPage';
MainPage.propTypes = {
  dispatch: Types.func.isRequired,
  token: Types.string.isRequired,
};

export default connect(state => {
  return {token: state.authorization.get('token')};
})(MainPage);

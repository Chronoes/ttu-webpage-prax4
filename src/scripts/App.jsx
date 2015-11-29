import React, {Component, PropTypes as Types} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {getTokenFromStorage, login, register} from './actions';
import LoginForm from './components/LoginForm';

class App extends Component {
  static displayName = 'App';
  static propTypes = {
    authorization: Types.instanceOf(Map).isRequired,
    dispatch: Types.func.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(getTokenFromStorage());
  }

  render() {
    const {dispatch, authorization} = this.props;
    return (
      <div>
        {authorization.get('token').length === 0 ?
          <LoginForm
          errorMessage={authorization.get('errorMessage')}
          isLoading={authorization.get('isLoading')}
          {...bindActionCreators({login, register}, dispatch)} /> :
          <div></div>
        }
      </div>
    );
  }
}

export default connect(state => state)(App);

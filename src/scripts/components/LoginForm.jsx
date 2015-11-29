import React, {Component, PropTypes as Types} from 'react';

import Preloader from './Preloader';

class LoginForm extends Component {
  static displayName = 'LoginForm';
  static propTypes = {
    login: Types.func.isRequired,
    register: Types.func.isRequired,
    errorMessage: Types.string,
    isLoading: Types.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      registration: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({errorMessage: nextProps.errorMessage});
  }

  componentWillUnmount() {
    this.setState({errorMessage: '', registration: false});
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value.trim();
    const password = this.refs.password.value;

    const errorMessages = this.validate(email, password);

    const {registration} = this.state;

    if (registration) {
      const passwordTwice = this.refs.passwordTwice.value;
      if (password !== passwordTwice) {
        errorMessages.push('Passwords don\'t match');
      }
    }

    if (errorMessages.length) {
      this.setState({errorMessage: errorMessages.shift()});
    } else {
      if (registration) {
        this.props.register(email, password);
      } else {
        this.props.login(email, password);
      }
      this.setState({errorMessage: ''});
    }
  }

  static MINIMUM_PASSWORD_LENGTH = 8;

  validate(email, password) {
    const errorMessages = [];

    if (email.length === 0) {
      errorMessages.push('Please input an email.');
    }

    if (password.length < LoginForm.MINIMUM_PASSWORD_LENGTH) {
      errorMessages.push('Please input a password of at least 8 characters.');
    }
    return errorMessages;
  }

  render() {
    const {isLoading} = this.props;
    const {errorMessage, registration} = this.state;
    return (
      <div className="form-container">
        <div className="card">
          <form className="card-block" onSubmit={this.onSubmit.bind(this)}>
            <h4 className="card-title">{registration ? 'Register' : 'Login'}</h4>
            <div className="form-group">
              <input
                type="email"
                ref="email"
                className="form-control"
                placeholder="e-mail" />
            </div>
            <div className="form-group">
              <input
                type="password"
                ref="password"
                className="form-control"
                placeholder="password" />
            </div>
           {registration ?
            <div className="form-group">
              <input
                type="password"
                ref="passwordTwice"
                className="form-control"
                placeholder="password again" />
            </div> : ''}
            {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : ''}
            <div className="form-group btn-form">
              {isLoading ?
                <Preloader /> :
                <input
                  type="submit"
                  value={registration ? 'register' : 'login'}
                  className="btn btn-primary btn-block"
                  id="LoginButton" />}
            </div>
            {registration ?
              <button className="btn btn-secondary btn-block" onClick={() => this.setState({registration: false, errorMessage: ''})} >cancel</button> :
              <a onClick={() => this.setState({registration: true, errorMessage: ''})}>Don't have an account yet? Click here!</a>}
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;

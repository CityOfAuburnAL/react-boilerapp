import React from 'react';
import { connect } from 'react-redux';

import { userActions } from '../redux/actions/';

class Login extends React.Component {
    componentDidMount() {
        //BUG: On first sign on it routes to adfs and then back here but user has to click login again to redirect to home
        //TODO: Probably have to rework to have sepeare login and logout components so we can auto login
        if (this.props.loggingIn) {
            this.props.dispatch(userActions.login());
        } else {
            // reset login status
            this.props.dispatch(userActions.logout());
        }
    }

    handleLogin() {
        return () => this.props.dispatch(userActions.login());
    }

    render() {
        return (
            <div>
                <button onClick={this.handleLogin()}>Log in</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(Login);
export { connectedLoginPage as Login }; 
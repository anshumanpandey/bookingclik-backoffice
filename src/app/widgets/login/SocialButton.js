import React from 'react'
// @ts-ignore
import SocialLogin from 'react-social-login'

class SocialButton extends React.Component {

    render() {
        return (
            <a href="#" className="btn btn-primary kt-btn" onClick={this.props.triggerLogin}>
                <i className="fab fa-facebook-f" />
            Facebook
            </a>
        );
    }
}

export default SocialLogin(SocialButton);
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

export default class EnforceLogin extends Component {
    render() {
        let isLoggedIn = true;
        if (!this.props.isLoggedIn) {
            isLoggedIn = false;
        }
        if (!this.props.desiredType.includes(this.props.type)) {
            isLoggedIn = false;
        }

        if (!isLoggedIn) {
            return <Redirect to="/auth/login" />;
        } else {
            if (this.props.hasProps) {
                return <Route to={this.props.path} render={
                    (props) => this.props.component
                } />;
            } else {
                return <Route to={this.props.path} exact component={this.props.component}/>
            }
        }
    }
}
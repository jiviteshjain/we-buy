import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import conf from '../config';

export default class EnforceLogout extends Component {
    render() {
        let isLoggedIn = true;
        if (!this.props.isLoggedIn) {
            isLoggedIn = false;
        }
        if (!this.props.desiredType.includes(this.props.type)) {
            isLoggedIn = false;
        }
        if (isLoggedIn) {
            if (this.props.type === conf.USER_TYPE_CUST) {
                return <Redirect to="/customer/dashboard" />;
            } else {
                return <Redirect to="/vendor/dashboard" />;
            }
        } else {
            if (this.props.hasProps) {
                return <Route to={this.props.path} render={
                    (props) => this.props.component
                } />;
            } else {
                return <Route to={this.props.path} exact component={this.props.component} />
            }
        }
    }
}
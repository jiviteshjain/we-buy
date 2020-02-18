import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

export default class StatusBar extends Component {
    render() {
        if (this.props.backPath && this.props.userName) {
            return (
                <div className="container status-bar">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between">
                            <Link to={this.props.backPath}>&#8592; BACK</Link>
                            <div className="d-flex justify-content-right">
                                <p className="mr-3">Hi {this.props.userName}</p>
                                <Link to={this.props.logoutPath}><b>LOGOUT</b></Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.props.backPath) {
            return (
                <div className="container status-bar">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-start">
                            <Link to={this.props.backPath}>&#8592; BACK</Link>
                        </div>
                    </div>
                </div>
            );
        } else if (this.props.userName) {
            return (
                <div className="container status-bar">
                    <div className="row">                          
                        <div className="col-12 d-flex justify-content-end">
                            <p className="mr-3">Hi {this.props.userName}</p>
                            <Link to={this.props.logoutPath}><b>LOGOUT</b></Link>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
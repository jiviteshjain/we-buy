import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {},
            isError: false,
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        const formData = Object.assign({}, this.state.formData);
        formData[e.target.id] = e.target.value;
        this.setState({ formData: formData });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state.formData);
        axios({
            method: "POST",
            url: "/auth/login",
            data: this.state.formData,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log(response)
            if (response.data.success){
                this.props.attemptLogin(response.data.token);
            }
        }).catch(error => {
            if (error) {
                console.log(error);
                this.setState({ isError: true });
                this.setState({ errors: error.response.data });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <StatusBar backPath='/' />
                <PageTitle bold="Log" normal=" in" />
                <div className="container">
                    <form>
                        <div className="form-group row">
                            <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" id="email" placeholder="someone@example.com" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.email}</p>
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                                <input type="password" className="form-control" id="password" placeholder="secret" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.password}</p>
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-12 text-center">
                                <input type="button" className="btn light-grey shadow-move" onClick={this.handleSubmit} value="Log in" />
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

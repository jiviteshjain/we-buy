import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';

export default class RegisterVendor extends Component {
    constructor() {
        super();

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
            url: "/auth/register/vendor",
            data: this.state.formData,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Welcome! We have you successfully registered.");
            window.location.replace("http://localhost:3000/auth/login");
        }).catch(error => {
            if (error) {
                console.log(error.response);
                this.setState({ isError: true });
                this.setState({ errors: error.response.data });
            }
        });
    }


    render() {
        return (
            <React.Fragment>
                <StatusBar backPath='/' />
                <PageTitle bold="Register" normal=" as vendor" />
                <div className="container">
                    <form>
                        <div className="form-group row">
                            <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="name" placeholder="John Doe" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.name}</p>
                                }
                            </div>
                        </div>
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
                            <label htmlFor="address" className="col-sm-2 col-form-label">Address</label>
                            <div className="col-sm-10">
                                <textarea className="form-control" id="address" placeholder="221B Baker Street" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.address}</p>
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
                            <label htmlFor="password2" className="col-sm-2 col-form-label">Confirm Password</label>
                            <div className="col-sm-10">
                                <input type="password" className="form-control" id="password2" placeholder="secret" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.password2}</p>
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-12 text-center">
                                <input type="button" className="btn muave shadow-move" onClick={this.handleSubmit} value="Register" />
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>

        )
    }
}
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

import landingPic from '../assets/img/landing.svg'

export default class Landing extends Component {
    render() {
        return (
    
            <div className="container mt-5">
                
                <div className="row">
                    <div className="col-12 text-center">
                        <img src={landingPic} height="200"></img>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h1 className="big-text text-center mb-0">Bulk.</h1>
                    </div>
                </div>
                <div className="row mt-0">
                    <div className="col-12">
                        <h1 className="text-center small-text">Cheaper. For Everyone.</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p className="text-center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex flex-column flex-md-row justify-content-center">
                        <Link to="/auth/register/customer" className="shadow-move btn red mx-md-2 my-2 my-md-0">Register as Customer</Link>
                        <Link to="/auth/register/vendor" className="shadow-move btn muave mx-md-2 my-2 my-md-0">Register as Vendor</Link>
                        <Link to="/auth/login" className="shadow-move btn light-grey mx-md-2 my-2 my-md-0">Login</Link>
                    </div>
                </div>
    
            </div>
        )
    }
}
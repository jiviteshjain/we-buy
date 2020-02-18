import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';
import dashboardPic from '../assets/img/customer-dashboard.svg';
import addPic from '../assets/img/customer-add.svg';
import listPic from '../assets/img/customer-list.svg';

export default class CustomerDashboard extends Component {
    render() {
        return (
            <React.Fragment>
                <StatusBar userName={this.props.userName} logoutPath='/auth/logout' />
                <PageTitle bold="At a" normal=" glance" />
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <img src={dashboardPic} height="150" />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-12 w-md-75">
                            <div className="card shadow-move">
                                <div className="row mx-2">
                                    <div className="col-3 d-none d-md-flex text-center align-items-center justify-content-center">
                                        <img src={addPic} className="mx-2 card-pic" width="100%" />
                                    </div>
                                    <div className="card-body col-md-9 col-12">
                                        <h4 className="card-title">Order a product</h4>
                                        <p className="card-text">Specify the quantity you want. The vendor will ship when they have enough orders. That way, you get it cheaper!</p>
                                        <Link to="/customer/product/list" className="btn red shadow-move">Order Now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-12 w-md-75">
                            <div className="card shadow-move">
                                <div className="row mx-2">
                                    <div className="col-3 d-none d-md-flex text-center align-items-center justify-content-center">
                                        <img src={listPic} className="mx-2 card-pic" width="100%" />
                                    </div>
                                    <div className="card-body col-md-9 col-12">
                                        <h4 className="card-title">Your orders</h4>
                                        <p className="card-text">View all your past orders here.</p>
                                        <Link to="/customer/order/list" className="btn red shadow-move">View Orders</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
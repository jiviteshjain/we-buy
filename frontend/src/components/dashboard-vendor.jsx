import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';
import dashboardPic from '../assets/img/vendor-dashboard.svg';
import addPic from '../assets/img/vendor-add.svg';

export default class VendorDashboard extends Component {
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
                                        <img src={addPic} className="mx-2 card-pic" width="100%"/>
                                    </div>
                                    <div className="card-body col-md-9 col-12">
                                        <h4 className="card-title">Add a product</h4>
                                        <p className="card-text">Specify a minimum dispatch quantity as per your logistical requirements to keep costs at a minimum!</p>
                                        <Link to="/vendor/product/add" className="btn muave shadow-move">Add Product</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-6 mb-4">
                            <div className="card shadow-move">
                                <div className="card-body">
                                    <h4 className="card-title">View all products</h4>
                                    <p className="card-text">View and manage all your products here.</p>
                                    <Link to="/vendor/product/list/all" className="btn muave shadow-move">View All Products</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <div className="card shadow-move">
                                <div className="card-body">
                                    <h4 className="card-title">View waiting products</h4>
                                    <p className="card-text">View and manage your waiting products here.</p>
                                    <Link to="/vendor/product/list/wait" className="btn muave shadow-move">View Waiting Products</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <div className="card shadow-move">
                                <div className="card-body">
                                    <h4 className="card-title">View ready products</h4>
                                    <p className="card-text">View and manage your ready products here.</p>
                                    <Link to="/vendor/product/list/ready" className="btn muave shadow-move">View Ready Products</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <div className="card shadow-move">
                                <div className="card-body">
                                    <h4 className="card-title">View dispatched products</h4>
                                    <p className="card-text">View and manage your dispatched products here.</p>
                                    <Link to="/vendor/product/list/dispatch" className="btn muave shadow-move">View Dispatched Products</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
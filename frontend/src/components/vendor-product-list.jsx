import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import conf from '../config';

import PageTitle from './page-title';
import StatusBar from './status-bar';
import VendorProductCard from './vendor-product-card';

export default class VendorProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            error: null,
            isLoaded: false
        };
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        axios({
            method: "GET",
            url: "/vendor/product/list",
        }).then((response) => {
            this.setState({
                products: response.data,
                error: null,
                isLoaded: true
            });
        }).catch(error => {
            if (error) {
                console.log(error);
                this.setState({ error: error.response.data });
            }
        });
    }
    handleClick(e) {
        e.preventDefault();
        // redirect to product page
    }
    render() {
        if (!this.state.isLoaded) {
            return <h1>Loading...</h1>;
        }
        if (this.state.error) {
            return <h1>Error</h1>
        }
        let prodList = null;
        if (this.props.filter == "all") {
            console.log(this.state.products)
            prodList = this.state.products.map((product) => 
                <div className="row mb-4">
                    <div className="col-12">
                        <VendorProductCard product={product} onClick={this.handleClick} backPath="all" />
                    </div>
                </div>
            );
            console.log(prodList);
        } else {
            let backPath = null;
            if (this.props.filter == conf.PROD_TYPE_WAIT) {
                backPath = "wait"
            } else if (this.props.filter == conf.PROD_TYPE_PLACE) {
                backPath = "ready"
            } else if (this.props.filter == conf.PROD_TYPE_DISPATCH) {
                backPath = "dispatch"
            }
            prodList = this.state.products.filter(prod => prod.state == this.props.filter).map((product) =>
                <div className="row mb-4">
                    <div className="col-12">
                        <VendorProductCard product={product} onClick={this.handleClick} backPath={backPath} />
                    </div>
                </div>
            );
        }
        return (
            <React.Fragment>
                <StatusBar backPath='/vendor/dashboard' userName={this.props.userName} logoutPath='/auth/logout' />
                <PageTitle bold={this.props.what} normal=' products' />
                <div className="container">
                    {prodList}
                </div>
            </React.Fragment>
        );
    }
}

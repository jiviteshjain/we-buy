import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';
import ProductCard from './product-card';

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
            console.log(response);
            let products;
            if (this.props.filter) {
                products = response.data.filter(curr => curr.state === this.props.filter);
            } else {
                products = response.data;
            }
            this.setState({
                products: products,
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
        const prodList = this.state.products.map((product) => 
            <div className="row mb-4">
                <div className="col-12">
                    <ProductCard product={product} onClick={this.handleClick} />
                </div>
            </div>
        );
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

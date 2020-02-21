import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';
import CustomerProductCard from './customer-product-card';

export default class CustomerSearchProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            products: [],
            error: null,
            isLoaded: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sort = this.sort.bind(this);
    }

    componentDidMount() {
        axios({
            method: "POST",
            url: "/customer/product/list",
        }).then((response) => {
            console.log(response);
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

    sort(e) {
        e.preventDefault();
        const products = this.state.products;
        products.sort(function (a, b) {
            if (e.target.id != "rating")
                return a[e.target.id] - b[e.target.id];
            else
                return b[e.target.id] - a[e.target.id];
        });
        this.setState({products: products});
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ search: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();

        axios({
            method: "POST",
            data: {search: this.state.search},
            url: "/customer/product/list",
        }).then((response) => {
            console.log(response);
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

    render() {
        if (!this.state.isLoaded) {
            return <h1>Loading...</h1>
        }
        if (this.state.error) {
            return <h1>Error</h1>
        }
        const prodList = this.state.products.map((product) =>
            <div className="row mb-4">
                <div className="col-12">
                    <CustomerProductCard product={product} onClick={this.handleClick} />
                </div>
            </div>
        );
        return(
            <React.Fragment>
                <StatusBar backPath="/customer/dashboard" userName={this.props.userName} logoutPath="/auth/logout" />
                <PageTitle bold="Browse" normal=" products" />

                <div className="container mb-2">
                    <div className="row">
                        <div className="col-12 w-75">
                            <form className="has-search">
                                <div className="input-group">
                                    <input className="form-control" onChange={this.handleChange} placeholder="Search" id="search" type="text" />
                                    <div className="input-group-append">
                                        <button className="btn btn-default" type="submit" onClick={this.handleSubmit}>
                                            <i className="material-icons">search</i></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-4 mb-2">
                            <button className="btn shadow-move red w-100" id="price" onClick={this.sort}>Sort by price</button> 
                        </div>
                        <div className="col-12 col-md-4 mb-2">
                            <button className="btn shadow-move red w-100" id="remQuan" onClick={this.sort}>Sort by quantity</button>
                        </div>
                        <div className="col-12 col-md-4 mb-2">
                            <button className="btn shadow-move red w-100" id="rating" onClick={this.sort}>Sort by rating</button>
                        </div>
                    </div>
                </div>
                <div className="container">
                    {prodList}
                </div>
            </React.Fragment>
        )
    }


}
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';
import conf from '../config';

export default class CustomerViewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null,
            isLoaded: false,
            fetchErrors: {},

            quantity: null,
            quantityFormErrors: {},

            vendorRating:null,
            vendorRatingFormErrors: {},

            productRating: null,
            productReview: "",
            productRatingFormErrors: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleQuantitySubmit = this.handleQuantitySubmit.bind(this);
        this.handleVendorRatingSubmit = this.handleVendorRatingSubmit.bind(this);
        this.handleProductRatingSubmit = this.handleProductRatingSubmit.bind(this);
    }

    componentDidMount() {
        const data = {
            orderId: this.props.orderId
        };
        axios({
            method: "POST",
            data: data,
            url: "/customer/order/list",
        }).then((response) => {
            console.log(response);
            this.setState({
                order: response.data,
                fetchErrors: null,
                isLoaded: true
            });
        }).catch(error => {
            if (error) {
                console.log(error);
                this.setState({ fetchErrors: error });
            }
        });
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ [e.target.id]: e.target.value });
    }

    handleQuantitySubmit(e) {
        e.preventDefault();
        const data = {
            quantity: this.state.quantity,
            orderId: this.state.order._id
        };
        axios({
            method: "POST",
            url: "/customer/order/edit",
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Your order has been edited.");
            window.location.replace("http://localhost:3000/customer/dashboard");
        }).catch(error => {
            if (error) {
                console.log(error.response.data);
                this.setState({ quantityFormErrors: error.response.data });
                console.log(this.state);
            }
        });
    }

    handleVendorRatingSubmit(e) {
        const data = {
            vendorId: this.state.order.productId.vendorId._id,
            rating: this.state.vendorRating
        }
        axios({
            method: "POST",
            url: "/customer/order/rate/vendor",
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Thank you for your review");
            window.location.replace("http://localhost:3000/customer/dashboard");
        }).catch(error => {
            if (error) {
                console.log(error.response.data);
                this.setState({ vendorRatingFormErrors: error.response.data });
                console.log(this.state);
            }
        });

    }

    handleProductRatingSubmit(e) {
        const data = {
            orderId: this.state.order._id,
            productRating: this.state.productRating,
            productReview: this.state.productReview

        }
        axios({
            method: "POST",
            url: "/customer/order/rate/product",
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Thank you for your review");
            window.location.replace("http://localhost:3000/customer/dashboard");
        }).catch(error => {
            if (error) {
                console.log(error.response.data);
                this.setState({ productRatingFormErrors: error.response.data });
                console.log(this.state);
            }
        });

    }

    render() {
        if (!this.state.isLoaded) {
            return <h1>Loading...</h1>
        }
        if (this.state.fetchErrors) {
            return <h1>Error</h1>
        }
        
        return (
            <React.Fragment>
                <StatusBar backPath='/customer/order/list' userName={this.props.userName} logoutPath="/auth/logout" />
                <PageTitle bold="Order" normal=" details" />

                <div className="container mb-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow">
                                <div className="card-body">
                                    <h4 className="card-title">{this.state.order.productId.name}</h4>
                                    <p className="card-text">
                                        <b>Vendor: </b>{this.state.order.productId.vendorId.name}<br />
                                        <b>Price: </b>{this.state.order.productId.price}<br />
                                        <b>Order Quantity: </b>{this.state.order.quantity}<br />
                                        <b>Status: </b>{
                                            (() => {
                                                if (this.state.order.productId.state == conf.PROD_TYPE_WAIT)
                                                    return <React.Fragment>Waiting</React.Fragment>
                                                else if (this.state.order.productId.state == conf.PROD_TYPE_PLACE)
                                                    return <React.Fragment>Ready</React.Fragment>
                                                else if (this.state.order.productId.state == conf.PROD_TYPE_DISPATCH)
                                                    return <React.Fragment>Dispatched</React.Fragment>
                                                else if (this.state.order.productId.state == conf.PROD_TYPE_CANCEL)
                                                    return <React.Fragment>Cancelled</React.Fragment>
                                            })()
                                        }<br />
                                        {(() => {
                                            if (this.state.order.productId.state === conf.PROD_TYPE_WAIT)
                                                return (<React.Fragment><b>Remaining Quantity: </b> {this.state.order.remQuan}<br /></React.Fragment>)
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                {(() => {
                    if (this.state.order.productId.state == conf.PROD_TYPE_WAIT) {
                        return (
                            <div className="container mb-4">
                                <form>
                                    <div className="form-group row">
                                        <label htmlFor="quantity" className="col-sm-2 col-form-label">Quantity</label>
                                        <div className="col-sm-10">
                                            <input type="number" min="1" max={this.state.order.remQuan + this.state.order} step="1" className="form-control" id="quantity" placeholder={this.state.order.quantity} required onChange={this.handleChange} />
                                            {
                                                this.state.quantityFormErrors.quantity &&
                                                <p className="form-error">{this.state.quantityFormErrors.quantity}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-12 text-center">
                                            <input type="submit" className="btn red shadow-move" onClick={this.handleQuantitySubmit} value="Edit Order" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        );
                    }
                })()}

                {(() => {
                    if (this.state.order.productId.state == conf.PROD_TYPE_PLACE) {
                        return (
                            <div className="container mb-4">
                                <form>
                                    <div className="form-group row">
                                        <label htmlFor="vendorRating" className="col-sm-2 col-form-label">Rate the vendor</label>
                                        <div className="col-sm-10">
                                            <input type="number" min="0" max="5" step="1" className="form-control" id="vendorRating" placeholder="1 (awful) to 5 (awesome)" required onChange={this.handleChange} />
                                            {
                                                this.state.vendorRatingFormErrors.length > 0 &&
                                                <p className="form-error">{this.state.vendorRatingFormErrors.vendorRating}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-12 text-center">
                                            <input type="button" className="btn red shadow-move" onClick={this.handleVendorRatingSubmit} value="Rate Vendor" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        );
                    }
                })()}

                {(() => {
                    if (this.state.order.productId.state == conf.PROD_TYPE_DISPATCH) {
                        return (
                            <div className="container mb-4">
                                <form>
                                    <div className="form-group row">
                                        <label htmlFor="productRating" className="col-sm-2 col-form-label">Rate the product</label>
                                        <div className="col-sm-10">
                                            <input type="number" min="0" max="5" step="1" className="form-control" id="productRating" placeholder="1 (awful) to 5 (awesome)" required onChange={this.handleChange} />
                                            {
                                                this.state.productRatingFormErrors.length > 0 &&
                                                <p className="form-error">{this.state.productRatingFormErrors.productRating}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="productReview" className="col-sm-2 col-form-label">Review this product</label>
                                        <div className="col-sm-10">
                                            <textarea className="form-control" id="productReview" placeholder="T'was awesome :)" required onChange={this.handleChange} />
                                            {
                                                this.state.productRatingFormErrors.length > 0 &&
                                                <p className="form-error">{this.state.productRatingFormErrors.productReview}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-12 text-center">
                                            <input type="button" className="btn red shadow-move" onClick={this.handleProductRatingSubmit} value="Rate Product" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        );
                    }
                })()}
            </React.Fragment>
        );
    }
}
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
            fetchErrors: null,

            quantity: null,
            quantityFormErrors: null,

            vendorRating: null,
            vendorRatingFormErrors: null,

            productRating: null,
            productReview: "",
            productRatingFormErrors: null
        }
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

    render() {
        if (!this.state.isLoaded) {
            return <h1>Loading...</h1>
        }
        if (this.state.error) {
            return <h1>Error</h1>
        }
        
        return (
            <React.Fragment>
                <StatusBar backPath='/customer/order/list' userName={this.props.userName} logoutPath="/auth/logout" />
                <PageTitle bold="Order" normal=" details" />

                <div className="container">
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
            </React.Fragment>
        );
    }
}
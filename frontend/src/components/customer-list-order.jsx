import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';
import CustomerOrderCard from './customer-order-card';

export default class CustomerListOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            isLoaded: false,
            error: null
        };
    }
    
    componentDidMount() {
        axios({
            method: "POST",
            url: "/customer/order/list",
        }).then((response) => {
            console.log(response);
            this.setState({
                orders: response.data,
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

        const orderList = this.state.orders.map((order) =>
            <div className="row mb-4">
                <div className="col-12">
                    <CustomerOrderCard order={order} />
                </div>
            </div>
        );

        return (
            <React.Fragment>
                <StatusBar backPath="/customer/dashboard" userName={this.props.userName} logoutPath="/auth/logout" />
                <PageTitle bold="Past" normal=" orders" />
                <div className="container">
                    {orderList}
                </div>
            </React.Fragment>
        );
    }
}
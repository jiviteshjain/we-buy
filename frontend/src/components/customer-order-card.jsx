import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import conf from '../config';

export default class CustomerOrderCard extends Component {
    render() {
        return (
            <div className="card shadow-move">
                <div className="card-body">
                    <h4 className="card-title">{this.props.order.productId.name}</h4>
                    <p className="card-text">
                        <b>Vendor: </b>{this.props.order.productId.vendorId.name}<br />
                        <b>Price: </b>{this.props.order.productId.price}<br />
                        <b>Order Quantity: </b>{this.props.order.quantity}<br />
                        <b>Status: </b>{
                            (() => {
                                if (this.props.order.productId.state == conf.PROD_TYPE_WAIT)
                                    return <React.Fragment>Waiting</React.Fragment>
                                else if (this.props.order.productId.state == conf.PROD_TYPE_PLACE)
                                    return <React.Fragment>Ready</React.Fragment>
                                else if (this.props.order.productId.state == conf.PROD_TYPE_DISPATCH)
                                    return <React.Fragment>Dispatched</React.Fragment>
                                else if (this.props.order.productId.state == conf.PROD_TYPE_CANCEL)
                                    return <React.Fragment>Cancelled</React.Fragment>
                            })()
                        }<br />
                        {/* Remaining quantity shown in product details */}
                        {/* {(() => {
                            if (this.props.order.productId.state === conf.PROD_TYPE_WAIT)
                                return (<React.Fragment><b>Remaining Quantity: </b> {this.props.order.remQuan}<br /></React.Fragment>)
                        })()} */}
                    </p>
                    <Link className="btn red shadow-move" id={this.props.order._id} to={
                        {
                            pathname: "/customer/order/details",
                            state: {
                                orderId: this.props.order._id
                            }
                        }
                    }>View</Link>
                </div>
            </div>
        );
    }
}
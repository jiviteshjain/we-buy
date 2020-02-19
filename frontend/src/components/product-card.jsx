import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import addPic from '../assets/img/vendor-add.svg';
import conf from '../config';

export default class ProductCard extends Component {
    render() {
        return (
            <div className="card shadow-move">
                <div className="row mx-2">
                    <div className="col-3 d-none d-md-flex text-center align-items-center justify-content-center">
                        <img src={addPic} className="mx-2 card-pic" width="100%" />
                    </div>
                    <div className="card-body col-md-9 col-12">
                        <h4 className="card-title">{this.props.product.name}</h4>
                        <p className="card-text">
                            <b>Price: </b>{this.props.product.price}<br />
                            <b>Dispatch Quantity: </b>{this.props.product.quantity}<br />
                            <b>Status: </b>{(() => {
                                if (this.props.product.state === conf.PROD_TYPE_WAIT)
                                    return <span>Waiting</span>
                                else if (this.props.product.state === conf.PROD_TYPE_PLACE)
                                    return <span>Placed</span>
                                else if (this.props.product.state === conf.PROD_TYPE_DISPATCH)
                                    return <span>Dispatched</span>
                                else
                                    return <span>Cancelled</span>
                            })()}
                            <br />
                            {(() => {
                                if (this.props.product.state === conf.PROD_TYPE_WAIT)
                                    return (<React.Fragment><b>Remaining Quantity: </b> {this.props.product.remQuan}<br /></React.Fragment>)
                            })()}
                            <b>Rating: </b>{this.props.product.rating}<br />
                        </p>
                        <button className="btn muave shadow-move" id={this.props.product._id} onClick={this.props.onClick}>View</button>
                    </div>
                </div>
            </div>
        );
    }
}
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';
import conf from '../config';
import addPic from '../assets/img/vendor-add.svg';

export default class VendorViewProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            product: null
        };
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDispatch = this.handleDispatch.bind(this);
    }

    componentDidMount() {
        const data = {
            productId: this.props.productId
        };
        axios({
            method: "POST",
            data: data,
            url: "/customer/product/details",
        }).then((response) => {
            console.log(response);
            this.setState({
                product: response.data,
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

    handleCancel(e) {
        e.preventDefault();
        const data = {
            productId: this.state.product._id,
        }
        axios({
            method: "POST",
            url: "/vendor/product/cancel",
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log(response)
            if (response.status == 200) {
                alert("The product has been cancelled!");
                window.location.replace("http://localhost:3000/vendor/dashboard")
            }
        }).catch(error => {
            if (error) {
                console.log(error);
            }
        });
    }
    handleDispatch(e) {
        e.preventDefault();
        const data = {
            productId: this.state.product._id,
        }
        axios({
            method: "POST",
            url: "/vendor/product/dispatch",
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log(response)
            if (response.status == 200) {
                alert("The product has been dispatched!");
                window.location.replace("http://localhost:3000/vendor/dashboard")
            }
        }).catch(error => {
            if (error) {
                console.log(error);
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
        const revList = this.state.product.orders.filter(prod => prod.rating != 0).map((order) =>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            {order.rating}/5.0
                        </div>
                        <div className="card-body">
                            <blockquote className="blockquote mb-0">
                                <p>{order.review}</p>
                                <footer class="blockquote-footer">{order.customerId.name}</footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        );
        const backpath = `/vendor/product/list/${this.props.backPath}`
        return (
            <React.Fragment>
                <StatusBar backPath={backpath} userName={this.props.userName} logoutPath="/auth/logout" />
                <PageTitle bold={this.state.product.name} normal=" details" />
                <div className="container mb-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="card shadow">
                                <div className="row mx-2">
                                    <div className="col-3 d-flex text-center align-items-center justify-content-center">
                                        <img src={addPic} className="mx-2 card-pic" width="100%" />
                                    </div>
                                    <div className="card-body col-md-9 col-12">
                                        <h4 className="card-title">{this.state.product.name}</h4>
                                        <p className="card-text">
                                            <b>Vendor: </b>{this.state.product.vendorId.name}<br />
                                            <b>Vendor Rating: </b>{this.state.product.vendorId.currentRating}<br />
                                            <b>Price: </b>{this.state.product.price}<br />
                                            {(() => {
                                                if (this.state.product.state === conf.PROD_TYPE_WAIT)
                                                    return (<React.Fragment><b>Remaining Quantity: </b> {this.state.product.remQuan}<br /></React.Fragment>)
                                            })()}
                                            <b>Rating: </b>{this.state.product.rating}<br />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mb-4">
                    {revList}
                </div>
                {(()=>{
                    if (this.state.product.state == conf.PROD_TYPE_WAIT) {
                        return (<div className="container mb-4">
                            <form>
                                <div className="form-group row">
                                    <div className="col-12 text-center">
                                        <input type="button" className="btn muave shadow-move" onClick={this.handleCancel} value="Cancel Product" />
                                    </div>
                                </div>
                            </form>
                        </div>);
                    }
                })()}
                {(() => {
                    if (this.state.product.state == conf.PROD_TYPE_PLACE) {
                        return (<div className="container mb-4">
                            <form>
                                <div className="form-group row">
                                    <div className="col-12 text-center">
                                        <input type="button" className="btn muave shadow-move" onClick={this.handleDispatch} value="Dispatch Product" />
                                    </div>
                                </div>
                            </form>
                        </div>);
                    }
                })()}
                
            </React.Fragment>
        ); 
    }
}
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

import PageTitle from './page-title';
import StatusBar from './status-bar';

export default class AddProduct extends Component {
    constructor() {
        super();

        this.state = {
            formData: {},
            isError: false,
            errors: {},
            img: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {

        if (e.target.type == "file") {
            var self = this;
            var reader = new FileReader();
            var file = e.target.files[0];

            reader.onload = function(upload) {
                const formData = Object.assign({}, self.state.formData);
                formData.img = upload.target.result;
                self.setState({ formData: formData });
            }
            reader.readAsDataURL(file);
        }

        e.preventDefault();
        const formData = Object.assign({}, this.state.formData);
        formData[e.target.id] = e.target.value;
        this.setState({ formData: formData });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state.formData);
        axios({
            method: "POST",
            url: "/vendor/product/add",
            data: this.state.formData,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            alert("Your product has been added.");
            window.location.replace("http://localhost:3000/vendor/dashboard");
        }).catch(error => {
            if (error) {
                console.log(error.response);
                this.setState({ isError: true });
                this.setState({ errors: error.response.data });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <StatusBar backPath="/vendor/dashboard" userName={this.props.userName} logoutPath='/auth/logout' />
                <PageTitle bold="Add" normal=" a product" />
                <div className="container">
                    <form>
                        <div className="form-group row">
                            <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="name" placeholder="Hershey's Kisses" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.name}</p>
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="price" className="col-sm-2 col-form-label">Price per piece (Rs.)</label>
                            <div className="col-sm-10">
                                <input type="number" min="0" step="any" className="form-control" id="price" placeholder="100" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.price}</p>
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="quantity" className="col-sm-2 col-form-label">Dispatch Quantity</label>
                            <div className="col-sm-10">
                                <input type="number" min="0" step="1" className="form-control" id="quantity" placeholder="50" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.quantity}</p>
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="img" className="col-sm-2 col-form-label">Image</label>
                            <div className="col-sm-10">
                                <input type="file" className="form-control" id="img" required onChange={this.handleChange} />
                                {
                                    this.state.isError &&
                                    <p className="form-error">{this.state.errors.img}</p>
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-12 text-center">
                                <input type="button" className="btn muave shadow-move" onClick={this.handleSubmit} value="Add Product" />
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>

        )
    }
}
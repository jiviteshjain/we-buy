import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link , Switch} from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import conf from './config';
import './App.css';

import setAuthToken from './set-auth-token';
import Navbar from './components/navbar'
import Landing from './components/landing'
import RegisterCustomer from './components/register-customer';
import RegisterVendor from './components/register-vendor';
import Login from './components/login';
import AddProduct from './components/add-product';
import EnforceLogin from './components/enforce-login';
import EnforceLogout from './components/enforce-logout';
import VendorDashboard from './components/dashboard-vendor';
import CustomerDashboard from './components/dashboard-customer';

class App extends Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: false,
			userName: null,
			userId: null,
			userType: null,
			token: null
		};
		this.attemptLogin = this.attemptLogin.bind(this);
	}

	attemptLogin(token) {
		localStorage.setItem("weBuyToken", token);
		setAuthToken(token);
		const decoded = jwt_decode(token);
		this.setState({
			isLoggedIn: true,
			userName: decoded.name,
			userId: decoded.id,
			userType: decoded.type,
			token: token
		});
	}
	componentWillMount() {
		if (localStorage && localStorage.weBuyToken) {
			this.attemptLogin(localStorage.weBuyToken);
		}
	}
  	render() {
		
		return (
			<Router>
				<Navbar/>
				<Route exact path="/" component={Landing} />
				
				<Route exact path = "/auth/register/customer"
				render = {
						(props) => <EnforceLogout {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType={[conf.USER_TYPE_CUST, conf.USER_TYPE_VEND]}
						path='/auth/register/customer'
						hasProps={false}
						component={RegisterCustomer}
						/>} />
				{/* <Route exact path="/auth/register/customer" component={RegisterCustomer} /> */}
				
				<Route exact path = "/auth/register/vendor"
				render = {
						(props) => <EnforceLogout {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType={[conf.USER_TYPE_VEND, conf.USER_TYPE_CUST]}
						path='/auth/register/vendor'
						hasProps={false}
						component={RegisterCustomer}
						/>} />
				{/* <Route exact path="/auth/register/vendor" component={RegisterVendor} /> */}
				
				
				<Route exact path = "/auth/login"
				render = {
						(props) => <EnforceLogout {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType={[conf.USER_TYPE_VEND, conf.USER_TYPE_CUST]}
						path='/auth/login'
						hasProps={true}
						component={<Login attemptLogin={this.attemptLogin}/>}
						/>} />
				{/* <Route exact path = "/auth/login"
				render = {
						(props) => < Login {
							...props
						}
						attemptLogin = {
							this.attemptLogin
						}
						/>} /> */}
				<Route exact path = "/vendor/dashboard"
				render = {
						(props) => <EnforceLogin {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType={[conf.USER_TYPE_VEND]}
						path='/vendor/dashboard'
						hasProps={true}
						component={<VendorDashboard userName={this.state.userName}/>}
						/>} />
				<Route exact path = "/vendor/product/add"
				render = {
						(props) => <EnforceLogin {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType={[conf.USER_TYPE_VEND]}
						path='/vendor/product/add'
						hasProps={true}
						component={<AddProduct userName={this.state.userName}/>}
						/>} />

				<Route exact path = "/customer/dashboard"
				render = {
						(props) => <EnforceLogin {...props}
						isLoggedIn={this.state.isLoggedIn}
						type={this.state.userType}
						desiredType={[conf.USER_TYPE_CUST]}
						path='/customer/dashboard'
						hasProps={true}
						component={<CustomerDashboard userName={this.state.userName}/>}
						/>} />
				
			</Router>
		);
	}
}

export default App;

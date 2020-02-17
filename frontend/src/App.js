import React from 'react';
import { BrowserRouter as Router, Route, Link , Switch} from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './App.css';

import Navbar from './components/navbar'
import Landing from './components/landing'
import RegisterCustomer from './components/register-customer';
import RegisterVendor from './components/register-vendor';

function App() {
  return (
	<Router>
		<Navbar/>
		<Route exact path="/" component={Landing} />
		<Route exact path="/auth/register/customer" component={RegisterCustomer} />
		<Route exact path="/auth/register/vendor" component={RegisterVendor} />
	</Router>
  );
}

export default App;

import React, { Component } from 'react';

export default class PageTitle extends Component {
    render() {
        return (
            <div className="container my-5">
                <div className="row my-5">
                    <div className="col-12 text-center text-md-right">
                        <h1 className="page-title">
                            <b>{this.props.bold}</b>{this.props.normal}
                        </h1>
                    </div>
                </div>
            </div>
        )
    }
}
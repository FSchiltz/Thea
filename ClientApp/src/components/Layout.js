import React, { Component } from 'react';

export class Layout extends Component {
	render() {
		return (
			<div className="container is-fluid mt-5">
				{this.props.children}
			</div>
		);
	}
}

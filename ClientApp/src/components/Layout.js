import React, { Component } from 'react';

export class Layout extends Component {
	render() {
		return (
			<section className="section">
				<div className="container is-fluid">
					{this.props.children}
				</div>
			</section>
		);
	}
}

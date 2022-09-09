import React, { Component } from 'react';

export class NavBar extends Component {
    constructor(props) {
        super(props);

        this.onAddClick = this.onAddClick.bind(this);
    }

    onAddClick() {
        if (this.props.onAddClick)
            this.props.onAddClick();
    }

    render() {
        return (
            <nav className="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <div className="navbar-item">
                        <img src="/logo.png" alt="Thea"/>                   
                        <p className='ml-2 is-size-4'>Thea</p>
                    </div>
                    <div className="navbar-item ml-4">
                        <div className="buttons">
                            <div className='button has-background-primary' onClick={this.onAddClick}>
                                <span className="icon">
                                    <svg className="feather">
                                        <use href="/feather-sprite.svg#plus" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
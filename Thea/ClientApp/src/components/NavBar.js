import React, { Component } from "react";
import { askNotifyPermission } from "../helpers/Notify";
import "./NavBar.css";

export class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = { collapsed: true };

        this.handleChange = this.handleChange.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    onAddClick() {
        if (this.props.onAddClick)
            this.props.onAddClick();
    }

    handleChange(e) {
        if (e.target.checked)
            askNotifyPermission();
        if (this.props.onNotifyChanged)
            this.props.onNotifyChanged(e.target.checked);
    }

    render() {
        return (
            <div>
                <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <div className="navbar-item">
                            <img src="/logo.png" alt="Thea" />
                            <p className="ml-2 is-size-3">Thea</p>
                        </div>

                        <div className="navbar-item ml-4">
                            <div className="buttons">
                                <div className="button has-background-primary" onClick={this.onAddClick}>
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
                <div className="bottom-menu m-2">
                    <div className="dropdown is-hoverable is-right">
                        <div className="dropdown-trigger m-0 p-0 is-clickable" onClick={this.handleToggle}>
                            <svg className="feather m-3" width="30" height="30">
                                <use href="/feather-sprite.svg#settings" />
                            </svg>
                        </div>

                        <div className="dropdown-menu">
                            <div className="dropdown-content">
                                <div className="dropdown-item">
                                    <label className="checkbox m-4">
                                        <input className="m-1" type="checkbox" checked={this.props.notify} onChange={this.handleChange} />
                                        <span className="is-size-6 ml-2">Notify</span>
                                    </label>
                                </div>
                                <div className="dropdown-item">
                                    <a className="button is-text" href="https://github.com/FSchiltz/Thea/issues" target="_blank" rel="noreferrer">
                                        <svg className="feather">
                                            <use href="/feather-sprite.svg#external-link" />
                                        </svg>
                                        <span className="ml-2">Report bug</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
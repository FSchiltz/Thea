import React, { Component } from "react";
import { askNotifyPermission } from "../helpers/Notify";
import "./NavBar.css";
import { Settings } from "./Settings";

export class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = { collapsed: true };

        this.handleChange = this.handleChange.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
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
                        <div className="navbar-item">
                            <div className="level">
                                <div className="level-left">
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
                                <div className="level-right">

                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="bottom-menu m-2">
                    <Settings notify={this.props.notify} handleChange={this.handleChange} />
                </div>
            </div>
        );
    }
}


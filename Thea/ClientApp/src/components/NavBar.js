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
        this.onFilterChanged = this.onFilterChanged.bind(this)
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

    onFilterChanged(e) {
        if (this.props.onFilterChanged)
            this.props.onFilterChanged(e.target.value);
    }

    render() {
        return (
            <div>
                <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand navbar-center">
                        <div className="navbar-item">
                            <img src="/logo.png" alt="Thea" />
                            <p className="ml-2 is-size-3">Thea</p>
                        </div>

                        <div className="level is-mobile navbar-center  px-4">
                            <div className="level-left">
                                <div className="buttons">
                                    <div className="button is-primary" onClick={this.onAddClick}>
                                        <span className="icon">
                                            <svg className="feather">
                                                <use href="/feather-sprite.svg#plus" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="level-item is-hidden-mobile">
                                <p className="control has-icons-left">
                                    <input type="text" className="input is-primary filter-input" placeholder="filter" value={this.props.filter} onChange={this.onFilterChanged} />
                                    <span className="icon is-left">
                                        <svg className="feather" width="25" height="25">
                                            <use href="/feather-sprite.svg#search" />
                                        </svg>
                                    </span>
                                </p>

                            </div>

                            <div className="level-right">
                                <Settings notify={this.props.notify} handleChange={this.handleChange} />
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}


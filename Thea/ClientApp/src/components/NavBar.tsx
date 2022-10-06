import React, { ChangeEvent, Component } from "react";
import { askNotifyPermission } from "../helpers/Notify";
import "./NavBar.css";
import { Settings } from "./Settings";

interface NavBarProps {
    onAddClick: () => void;
    onImportClick: () => void;
    onNotifyChanged: (event: boolean) => void;
    onDisableChanged: (event: boolean) => void;
    onFilterChanged: (event: string) => void;
    notify: boolean;
    filter: string;
    disable: boolean;
}

export class NavBar extends Component<NavBarProps> {
    constructor(props: NavBarProps | Readonly<NavBarProps>) {
        super(props);

        this.state = { collapsed: true };

        this.handleChange = this.handleChange.bind(this);
        this.handleDisableChange = this.handleDisableChange.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
        this.onImportClick = this.onImportClick.bind(this);
        this.onFilterChanged = this.onFilterChanged.bind(this)
    }

    onAddClick() {
        if (this.props.onAddClick)
            this.props.onAddClick();
    }

    onImportClick() {
        if(this.props.onImportClick)
            this.props.onImportClick();
    }

    handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.checked)
            askNotifyPermission();
        if (this.props.onNotifyChanged)
            this.props.onNotifyChanged(e.target.checked);
    }

    handleDisableChange(e: ChangeEvent<HTMLInputElement>) {
        if (this.props.onDisableChanged)
            this.props.onDisableChanged(e.target.checked);
    }

    onFilterChanged(e: ChangeEvent<HTMLInputElement>) {
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
                                    <div className="button is-primary" onClick={this.onImportClick}>
                                        <span className="icon">
                                            <svg className="feather">
                                                <use href="/feather-sprite.svg#upload" />
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
                                <Settings notify={this.props.notify} handleChange={this.handleChange} disable={this.props.disable}
                                    handleDisableChange={this.handleDisableChange} />
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}


import React,{ useState } from "react";

interface SettingsProps {
    notify: any;
    handleChange: any;
    disable: any;
    handleDisableChange: any;
}

export const Settings = ({ notify, handleChange, disable, handleDisableChange }: SettingsProps) => {
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!toggle);
    }

    return <div className="dropdown is-hoverable is-right">
        <div className="dropdown-trigger is-flex is-clickable" onClick={handleToggle}>
            <svg className="feather" width="30" height="30">
                <use href="/feather-sprite.svg#settings" />
            </svg>
        </div>

        <div className="dropdown-menu">
            <div className="dropdown-content">
                <div className="dropdown-item">
                    <label className="checkbox m-4">
                        <input className="m-1" type="checkbox" checked={disable} onChange={handleDisableChange} />
                        <span className="is-size-6 ml-2">Show disabled</span>
                    </label>
                </div>
                <div className="dropdown-item">
                    <label className="checkbox m-4">
                        <input className="m-1" type="checkbox" checked={notify} onChange={handleChange} />
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
}
import React, { CSSProperties } from "react";
import Tea from "../../model/Tea";

interface TeaCardMenuProps {
    tea: Tea;
    openEditPopup: React.MouseEventHandler<HTMLDivElement>;
    enableTea: React.MouseEventHandler<HTMLDivElement>;
    disableTea: React.MouseEventHandler<HTMLDivElement>;
    deleteTea: React.MouseEventHandler<HTMLDivElement>;
    favoriteTea: React.MouseEventHandler<HTMLDivElement>;
}

export default function TeaCardMenu({ tea, openEditPopup, enableTea, disableTea, deleteTea, favoriteTea }: TeaCardMenuProps) {

    let menuStyle: CSSProperties = {};
    menuStyle.background = 'transparent';
    
    return <div className="dropdown is-hoverable">
        <div className="dropdown-trigger">
            <button className="button is-white mx-1 p-0" style={menuStyle} aria-haspopup="true" aria-controls="dropdown-menu4">
                <svg className="feather" width="20" height="20">
                    <use href="/feather-sprite.svg#more-vertical" />
                </svg>
            </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu4" role="menu">
            <div className="dropdown-content">
                <div className={"dropdown-item" + (tea.isDisabled ? " is-hidden" : "")}>
                    <div className="button is-primary is-inverted" onClick={openEditPopup}>
                        <span className="icon">
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#edit" />
                            </svg>
                        </span>
                        <span>Edit</span>
                    </div>
                </div> <div className={"dropdown-item" + (tea.isDisabled ? " is-hidden" : "")}>
                    <div className="button is-primary is-inverted" onClick={favoriteTea}>
                        <span className="icon">
                            <svg className={"feather" + (tea.isFavorite ? "" : " is-filled")} width="20" height="20">
                                <use href="/feather-sprite.svg#heart" />
                            </svg>
                        </span>
                        <span> {(tea.isFavorite ? "Unset" : "Set") + " favorite"}</span>
                    </div>
                </div>
                <div className={"dropdown-item" + (tea.isDisabled ? "" : " is-hidden")}>
                    <div className="button is-primary is-inverted" onClick={enableTea}>
                        <span className="icon">
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#eye" />
                            </svg>
                        </span>
                        <span>Enable</span>
                    </div>
                </div>
                <div className={"dropdown-item" + (tea.isDisabled ? " is-hidden" : "")}>
                    <div className="button is-warning is-light is-inverted" onClick={disableTea}>
                        <span className="icon">
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#eye-off" />
                            </svg>
                        </span>
                        <span>Disable</span>
                    </div>
                </div>
                <hr className="dropdown-divider"></hr>
                <div className="dropdown-item">
                    <div className="button is-danger is-inverted" onClick={deleteTea}>
                        <span className="icon">
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#trash" />
                            </svg>
                        </span>
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};

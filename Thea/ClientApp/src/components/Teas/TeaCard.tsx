import React, { CSSProperties, useState } from "react";

import { formatDuration } from "../../helpers/Format";
import Tea from "../../model/Tea";
import TeaCardMenu from "./TeaCardMenu";

interface TeaCardProps {
    tea: Tea;
    handleEnableTea?: (id: string) => void;
    handleDisableTea?: (id: string) => void;
    handleDeleteClick?: (id: string) => void;
    handleFavoriteTea?: (id: Tea) => void;
    handleClick?: (id: string) => void;
    openEditPopup?: (id: string) => void;
}

export default function TeaCard({ tea, handleEnableTea, handleDisableTea, handleDeleteClick, handleFavoriteTea, handleClick, openEditPopup }: TeaCardProps) {
    let style = 'card card-small card-justify m-1';

    if (tea.isDisabled) {
        // disabled card are light grey and no click
        style += ' has-text-grey-light';
    }

    let click = () => { };
    let menu = <></>;
    if (tea.id) {
        const id = tea.id;

        if (!tea.isDisabled)
            click = () => handleClick?.(id);

        menu = <TeaCardMenu tea={tea} openEditPopup={e => openEditPopup?.(id)} enableTea={() => handleEnableTea?.(id)}
            disableTea={() => handleDisableTea?.(id)}
            deleteTea={() => handleDeleteClick?.(id)} favoriteTea={() => handleFavoriteTea?.(tea)} />
    }

    let color: CSSProperties = {};
    let leftColor = 'white';
    let rightColor = 'white';
    if (tea.color) {
        // use the custom color if any
        leftColor = tea.color;
        color.borderBottom = `${leftColor} solid 8px`;
    }

    const [expanded, setExpanded] = useState(false);
    const toggleCardState = () => {
        setExpanded(!expanded);
    }
    let collapseStyle: CSSProperties = {};
    collapseStyle.background = 'transparent';


    // else use the tea level
    switch (tea.level) {
        case 0:
        default:
            break;
        case 1:
            // no tea
            rightColor = '#2ca02c80';
            break;
        case 2:
            rightColor = '#FFEE0080';
            break;
        case 3:
            rightColor = '#FF9A0080';
            break;
        case 4:
            rightColor = '#FF000080';
            break;
    }

    color.background = rightColor;

    const hasDescription = !(tea.description === undefined || tea.description === null || tea.description === '');

    return <div className={style} key={tea.id} style={color}>
        <div className='card-content px-3 py-2'>

            <div className="level is-mobile m-0">
                <p className='mb-1 is-size-4 ellipsis no-wrap'>{tea.name}</p>

                {menu}
            </div>

            <div className='level is-mobile has-text-grey mb-2'>
                <div className='level-left'>
                    <div className="level-item">
                        <button className="button py-1 px-2 is-primary is-inverted" style={collapseStyle} disabled={tea.isDisabled} onClick={click}>
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#play" />
                            </svg>
                        </button>
                    </div>
                    <div className='level-item'>
                        <div className='box icon-text p-1'>
                            <span className="icon">
                                <svg className="feather" width="16" height="16">
                                    <use href="/feather-sprite.svg#thermometer" />
                                </svg>
                            </span>
                            <span>{tea.temperature} °C</span>
                        </div>
                    </div>
                    <div className='level-item'>
                        <div className='box icon-text p-1'>
                            <span className="icon">
                                <svg className="feather" width="16" height="16">
                                    <use href="/feather-sprite.svg#clock" />
                                </svg>
                            </span>
                            <span>{formatDuration(tea.duration)}</span>
                        </div>
                    </div>
                    <div className='level-item'>
                        {tea.isFavorite ? <svg className="feather is-filled has-text-danger" width="20" height="20">
                            <use href="/feather-sprite.svg#heart" />
                        </svg> : null}
                    </div>
                    <div className='level-right' onClick={toggleCardState}>
                        <div className={"button is-white collapse-header-icon" + (!expanded ? '' : '-collapse') + (hasDescription ? '' : ' is-hidden')}
                            style={collapseStyle}>
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#chevron-up" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="collapse-content" hidden={!expanded}>
                <div className="content ellipsis">
                    {tea.description}
                </div>
            </div>
        </div>
    </div>;
}

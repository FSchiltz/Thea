import { Component } from "react";
import { deleteTea, disableTea, enableTea, getTea } from "../api/TeaApi";
import { setTimer, stopTimer } from "../api/TimerApi";
import { deconstructDuration, formatDuration } from "../helpers/Format";
import { askNotifyPermission } from "../helpers/Notify";
import Confirm from "./Confirm";
import TimerModal from "./TimerModal";

const TeaCardMenu = ({ tea, openEditPopup, enableTea, disableTea, deleteTea }) => {
    return <div className="dropdown is-hoverable">
        <div className="dropdown-trigger">
            <button className="button is-inverted is-primary mx-1 p-0" aria-haspopup="true" aria-controls="dropdown-menu4">
                <svg className="feather" width="20" height="20">
                    <use href="/feather-sprite.svg#more-vertical" />
                </svg>
            </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu4" role="menu">
            <div className="dropdown-content">
                <div className={"dropdown-item" + (tea.isDisabled? " is-hidden":"")}>
                    <div className="button is-primary is-inverted" onClick={openEditPopup}>
                        <span className="icon">
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#edit" />
                            </svg>
                        </span>
                        <span>Edit</span>
                    </div>
                </div>
                <div className={"dropdown-item" + (tea.isDisabled? "":" is-hidden")}>
                    <div className="button is-primary is-inverted" onClick={enableTea}>
                        <span className="icon">
                            <svg className="feather" width="20" height="20">
                                <use href="/feather-sprite.svg#eye" />
                            </svg>
                        </span>
                        <span>Enable</span>
                    </div>
                </div>
                <div className={"dropdown-item" + (tea.isDisabled? " is-hidden":"")}>
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
    </div>
}

export class TeasTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: null,
            tea: null,
            timerOn: false,
            timerId: null,
            delete: null,
        };

        // This binding is necessary to make `this` work in the callback 
        this.handleClick = this.handleClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.notifyDone = this.notifyDone.bind(this);
        this.openEditPopup = this.props.openEditPopup.bind(this);
        this.deleteTea = this.deleteTea.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEnableTea = this.handleEnableTea.bind(this);
        this.handleDisableTea = this.handleDisableTea.bind(this);
    }

    handleClick(e) {
        // if the user wants notification we ask before the timer is done
        if (this.props.notify)
            askNotifyPermission();
        this.selectTea(e);
    }

    handleClose() {
        this.setState({ delete: null });
    }

    handleDeleteClick(e, tea) {
        e.preventDefault();

        this.setState({ delete: tea.id, isDisabled: tea.isDisabled })
    }

    closePopup() {
        this.closeTimer();
    }

    notifyDone() {
        if (this.props.notify) {
            // if so, create a notification
            new Notification("Tea ready !");
        }
    }

    async handleDisableTea(id) {
        await disableTea(id);
        this.props.dataChanged();
    }

    async handleEnableTea(id) {
        await enableTea(id);
        this.props.dataChanged();
    };

    async deleteTea() {
        await deleteTea(this.state.delete);

        console.log('Tea deleted');

        this.setState({ delete: null });

        await this.props.dataChanged();
    }

    async selectTea(teaId) {
        const data = await getTea(teaId);

        const [minutes, seconds] = deconstructDuration(data.duration);

        const duration = new Date();
        duration.setSeconds((minutes * 60) + seconds + duration.getSeconds());

        console.log('Timer started');

        const timerId = await setTimer(teaId);
        console.log('Server timer started');

        this.setState({ duration: duration, tea: data, timerOn: true, timerId: timerId });
    }

    async closeTimer() {
        console.log('Timer stopped');

        const timerId = this.state.timerId;

        if (timerId) {
            await stopTimer(timerId);
            console.log('Server timer stopped');
        }

        this.setState({ duration: null, tea: null, timerOn: false, timerId: null });
    }

    render() {
        let images;
        let noImages;
        if (this.props.teas.length > 0) {
            images = this.props.teas.map(tea => {
                let style = 'card card-small card-justify m-1';

                if (tea.isDisabled) {
                    // disabled card are light grey and no click
                    style += ' has-text-grey-light';
                }

                return (
                    <div className={style} key={tea.id} >
                        <div className='card-content px-3 py-2'>
                            <div className="level m-0">
                                <p className='mb-1 is-size-4 ellipsis no-wrap'>{tea.name}</p>
                                <TeaCardMenu tea={tea} openEditPopup={(e) => this.props.openEditPopup(e, tea.id)}
                                    enableTea={() => this.handleEnableTea(tea.id)}
                                    disableTea={() => this.handleDisableTea(tea.id)}
                                    deleteTea={(e) => this.handleDeleteClick(e, tea)} />
                            </div>
                            <div className='level is-mobile has-text-grey mb-2'>
                                <div className='level-left'>
                                    <div className="level-item" >
                                        <div className="button py-1 px-2 is-primary is-inverted" disabled={(tea.isDisabled)} onClick={(tea.isDisabled ? () => { } : () => this.handleClick(tea.id))}>
                                            <svg className="feather" width="20" height="20">
                                                <use href="/feather-sprite.svg#play" />
                                            </svg>
                                        </div>
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
                                </div>
                            </div>

                            <div className='content ellipsis'>{tea.description}</div>
                        </div>
                    </div>
                )
            });
        } else {
            noImages = <div className='block is-size-1 is-align-self-flex-end' key="1">No teas</div>;
        }

        return (
            <div className='is-flex is-flex-direction-row is-flex-wrap-wrap'>
                {images}

                {noImages}
                <Confirm handleSubmit={this.deleteTea} handleClose={this.handleClose} text="Are you sure you ?" isOpen={this.state.delete} />
                <TimerModal duration={this.state.duration} notifyDone={this.notifyDone} closePopup={this.closePopup} tea={this.state.tea} timerOn={this.state.timerOn} />
            </div>
        );
    }
}

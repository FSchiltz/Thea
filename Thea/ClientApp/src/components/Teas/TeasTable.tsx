import React, { Component } from "react";
import { deleteTea, disableTea, enableTea, favoriteTea, getTea, unFavoriteTea } from "../../api/TeaApi";
import { setTimer, stopTimer } from "../../api/TimerApi";
import { askNotifyPermission } from "../../helpers/Notify";
import Confirm from "../Confirm";
import TeaCard from "./TeaCard";
import TimerModal from "../Timer/TimerModal";
import Tea from "../../model/Tea";
import { deconstructDuration } from "../../helpers/Time";

interface TeasTableProps {
    notify: boolean;
    dataChanged: () => void;
    teas: Tea[];
    openEditPopup: (id: string) => void;
}

class TeasTableState {
    delete?: string;
    isDisabled: boolean = false;
    duration?: Date;
    tea?: Tea;
    timerOn: boolean = false;
    timerId?: string;
}

export class TeasTable extends Component<TeasTableProps, TeasTableState> {
    openEditPopup: (id: string) => void;

    constructor(props: TeasTableProps | Readonly<TeasTableProps>) {
        super(props);
        this.state = {
            duration: undefined,
            tea: undefined,
            timerOn: false,
            timerId: undefined,
            delete: undefined,
            isDisabled: false,
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
        this.handleFavoriteTea = this.handleFavoriteTea.bind(this);
    }

    handleClick(id: string) {
        // if the user wants notification we ask before the timer is done
        if (this.props.notify)
            askNotifyPermission();
        this.selectTea(id);
    }

    handleClose() {
        this.setState({ delete: undefined });
    }

    handleDeleteClick(id: string) {
        this.setState({ delete: id })
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

    async handleDisableTea(id: string) {
        await disableTea(id);
        this.props.dataChanged();
    }

    async handleEnableTea(id: string) {
        await enableTea(id);
        this.props.dataChanged();
    };

    async handleFavoriteTea(tea: Tea) {
        if (!tea.id)
            return;

        if (tea.isFavorite) {
            await unFavoriteTea(tea.id);
        } else {
            await favoriteTea(tea.id);
        }
        this.props.dataChanged();
    }

    async deleteTea() {
        if (!this.state.delete)
            return;

        await deleteTea(this.state.delete);

        console.log('Tea deleted');

        this.setState({ delete: undefined });

        await this.props.dataChanged();
    }

    async selectTea(teaId: string) {
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

        this.setState({ duration: undefined, tea: undefined, timerOn: false, timerId: undefined });
    }

    render() {
        let images;
        let noImages;
        if (this.props.teas.length > 0) {
            images = this.props.teas.map((tea: Tea) => {
                return (
                    <TeaCard key={tea.id} tea={tea} openEditPopup={this.props.openEditPopup}
                        handleEnableTea={this.handleEnableTea} handleDisableTea={this.handleDisableTea}
                        handleDeleteClick={this.handleDeleteClick} handleFavoriteTea={this.handleFavoriteTea} handleClick={this.handleClick} />
                )
            });
        } else {
            noImages = <div className='block is-size-1 is-align-self-flex-end' key="1">No teas</div>;
        }

        return (
            <div className='is-flex is-flex-direction-row is-flex-wrap-wrap'>
                {images}

                {noImages}
                <Confirm handleSubmit={this.deleteTea} handleClose={this.handleClose} text="Are you sure you ?" isOpen={this.state.delete !== undefined} />
                <TimerModal duration={this.state.duration} notifyDone={this.notifyDone}
                    closePopup={this.closePopup} tea={this.state.tea} timerOn={this.state.timerOn} />
            </div>
        );
    }
}

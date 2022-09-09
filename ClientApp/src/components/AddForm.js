import React, { Component } from 'react';

export class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            name: this.props.name ?? '',
            description: this.props.description ?? '',
            temperature: this.props.temperature ?? '',
            durationMinutes: this.props.durationMinutes ?? '',
            durationSeconds: this.props.durationSeconds ?? '',
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
        this.handleMinutesChange = this.handleMinutesChange.bind(this);
        this.handleSecondsChange = this.handleSecondsChange.bind(this);
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value }, () => this.changed());
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value }, () => this.changed());
    }

    handleTemperatureChange(event) {
        this.setState({ temperature: event.target.value }, () => this.changed());
    }

    handleMinutesChange(event) {
        this.setState({ durationMinutes: event.target.value }, () => this.changed());
    }

    handleSecondsChange(event) {
        this.setState({ durationSeconds: event.target.value }, () => this.changed());
    }

    changed() {
        if (this.props.onChange) {
            this.props.onChange(this.state);
            console.log(this.state);
        }
    }

    render() {
        return (
            <form>
                <div className="field">
                    <label className='label' >Name</label>
                    <input className='input' type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                </div>

                <div className="field">
                    <label className='label'>Description</label>
                    <input className='input' type="text" name="description" placeholder="Description" value={this.state.description} onChange={this.handleDescriptionChange} />
                </div>

                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label">Duration</label>
                    </div>

                    <div className="field-body">
                        <div className='field'>
                            <label className='label' >Minutes</label>
                            <input className='input' type="number" name="durationMinutes" placeholder="2" value={this.state.durationMinutes} onChange={this.handleMinutesChange} />
                        </div>
                        <div className='field'>
                            <label className='label'>Seconds</label>
                            <input className='input' type="number" name="durationSeconds" placeholder="0" value={this.state.durationSeconds} onChange={this.handleSecondsChange} />
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label className='label'>Temperature</label>
                    <input className='input' type="number" name="temperature" placeholder="90" value={this.state.temperature} onChange={this.handleTemperatureChange} />
                </div>
            </form>
        );
    }
}
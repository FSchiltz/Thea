import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Col } from 'reactstrap';

export class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            description: this.props.description,
            temperature: this.props.temperature,
            durationMinutes: this.props.durationMinutes,
            durationSeconds: this.props.durationSeconds,
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
        this.handleMinutesChange = this.handleMinutesChange.bind(this);
        this.handleSecondsChange = this.handleSecondsChange.bind(this);
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value });
        this.changed();
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
        this.changed();
    }

    handleTemperatureChange(event) {
        this.setState({ temperature: event.target.value });
        this.changed();
    }

    handleMinutesChange(event) {
        this.setState({ durationMinutes: event.target.value });
        this.changed();
    }

    handleSecondsChange(event) {
        this.setState({ durationSeconds: event.target.value });
        this.changed();
    }

    changed() {
        if (this.props.onChange)
            this.props.onChange(this.state);
    }

    render() {
        return (
            <Form>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                </FormGroup>

                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input type="text" name="description" id="description" placeholder="Description" value={this.state.description} onChange={this.handleDescriptionChange} />
                </FormGroup>

                <FormGroup row>
                    <Label>Duration</Label>
                    <Col>
                        <Label for="durationMinutes">Minutes</Label>
                        <Input type="number" name="durationMinutes" id="durationMinutes" placeholder="2" value={this.state.durationMinutes} onChange={this.handleMinutesChange} />
                    </Col>
                    <Col>
                        <Label for="durationSeconds">Seconds</Label>
                        <Input type="number" name="durationSeconds" id="durationSeconds" placeholder="0" value={this.state.durationSeconds} onChange={this.handleSecondsChange} />
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Label for="temperature">Temperature</Label>
                    <Input type="number" name="temperature" id="temperature" placeholder="90" value={this.state.temperature} onChange={this.handleTemperatureChange} />
                </FormGroup>
            </Form>
        );
    }
}
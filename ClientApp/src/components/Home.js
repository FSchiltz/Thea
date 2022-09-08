import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle, Card, CardText, CardGroup, CardSubtitle, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import CountdownTimer from './CountdownTimer';
import { getTime } from '../hooks/useCountdown';
import './Home.css';

export class Home extends Component {
	static displayName = Home.name;

	constructor(props) {
		super(props);
		this.state = { teas: [], loading: true, duration: null, tea: null, timerOn: false };

		// This binding is necessary to make `this` work in the callback 
		this.handleClick = this.handleClick.bind(this);
		this.openSavePopup = this.openSavePopup.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.closeAddPopup = this.closeAddPopup.bind(this);
		this.saveNewTea = this.saveNewTea.bind(this);
	}

	componentDidMount() {
		this.populateteasData();
	}

	handleClick() {
		this.selectTea();
	}

	closePopup() {
		this.closeTimer();
	}

	openSavePopup() {
		this.setState({ edit: true });
	}

	closeAddPopup() {
		this.setState({ edit: false });
	}

	async selectTea() {
		// Changing state
		const teaId = this.state.teas[0].id;

		const response = await fetch('/api/tea/' + teaId);
		const data = await response.json();

		var date = data.duration.split(':');
		const minutes = parseInt(date[1]);
		const seconds = parseInt(date[2]);

		const duration = new Date();
		duration.setSeconds((minutes * 60) + seconds + duration.getSeconds());

		console.log('Timer started');

		var timerResponse = await fetch('/api/timer/' + teaId, { method: 'POST' });
		const timerId = await timerResponse.json();
		console.log('Server timer started');

		this.setState({ duration: duration, tea: data, timerOn: true, timerId: timerId });
	}

	async closeTimer() {
		// TODO cancel le timer coté serveur
		console.log('Timer stopped');

		const timerId = this.state.timerId;

		if (timerId) {
			await fetch('/api/timer/' + timerId, { method: 'DELETE' });
			console.log('Server timer stopped');
		}

		this.setState({ duration: null, tea: null, timerOn: false, timerId: null });
	}

	async saveNewTea() {
		console.log("New tea saved");

		const tea = { name: this.state.newName };
		await fetch('/api/tea/', {
			method: 'POST',
			body: JSON.stringify(tea),
		})
		this.closeAddPopup();
	}

	renderAddForm() {
		if (this.state.edit) {
			return <Modal isOpen={this.state.edit} className={this.props.className}>
				<ModalHeader>Add</ModalHeader>
				<ModalBody>
					<Form onSubmit={this.saveNewTea}>
						<FormGroup>
							<Label for="name">Name</Label>
							<Input type="text" name="name" id="name" placeholder="Name" value={this.state.newName} />
						</FormGroup>

						<FormGroup>
							<Label for="description">Description</Label>
							<Input type="text" name="description" id="description" placeholder="Description" />
						</FormGroup>

						<FormGroup row>
							<Label>Duration</Label>
							<Col>
								<Label for="durationMinutes">Minutes</Label>
								<Input type="number" name="durationMinutes" id="durationMinutes" placeholder="2" />
							</Col>
							<Col>
								<Label for="durationSeconds">Seconds</Label>
								<Input type="number" name="durationSeconds" id="durationSeconds" placeholder="0" />
							</Col>
						</FormGroup>

						<FormGroup>
							<Label for="temperature">Temperature</Label>
							<Input type="number" name="temperature" id="temperature" placeholder="90" />
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.closeAddPopup}>Cancel</Button>
					<Button color="primary" onClick={this.saveNewTea}>Save</Button>
				</ModalFooter>
			</Modal>
		}
	}

	renderTimer(duration) {
		if (duration) {
			return <Modal isOpen={this.state.timerOn} className={this.props.className}>
				<ModalHeader>{this.state.tea.name}</ModalHeader>
				<ModalBody>
					<div><CountdownTimer targetDate={duration} total={getTime(new Date(duration))} /></div>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.closePopup}>Cancel</Button>
				</ModalFooter>
			</Modal>;
		}
	}

	renderteasTable(teas) {
		let images;
		let noImages;
		// map variables to each item in fetched image array and return image component
		if (teas.length > 0) {
			images = teas.map(tea =>
			(
				<Card key={tea.id} onClick={this.handleClick} style={{ cursor: "pointer" }}>
					<CardBody>
						<CardTitle tag="h3">{tea.name}</CardTitle>
						<CardSubtitle tag="h5">{tea.temperature} C</CardSubtitle>
						<CardText>{tea.description}</CardText>
					</CardBody>
				</Card>
			));
		} else {
			noImages = <p>No teas</p>; // return 'not found' component if no images fetched
		}

		return (
			<div className='teas-container'>
				<CardGroup>{images}</CardGroup>
				{noImages}
			</div>
		);
	}

	render() {
		let contents;

		if (this.state.loading)
			contents = <p><em>Loading...</em></p>
		else {
			contents =
				<div>
					{this.renderAddForm()}
					{this.renderTimer(this.state.duration, this.state.tea)}
					{this.renderteasTable(this.state.teas)}
				</div>;
		}

		return (
			<div>
				<h1 id="tabelLabel" >Teas</h1> <Button outline color="primary" onClick={this.openSavePopup}>Add</Button>
				{contents}
			</div>
		);
	}

	async populateteasData() {
		const response = await fetch('api/tea');
		const data = await response.json();
		this.setState({ teas: data, loading: false });
	}
}

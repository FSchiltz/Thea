import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle, Card, CardText, CardSubtitle, CardDeck, CardGroup, Row, Col } from 'reactstrap';
import CountdownTimer from './CountdownTimer';
import { getTime } from '../hooks/useCountdown';
import './Home.css';
import { AddForm } from './AddForm';

export class Home extends Component {
	static displayName = Home.name;

	constructor(props) {
		super(props);
		this.state = { teas: [], loading: true, duration: null, tea: null, timerOn: false, newTea: {} };

		// This binding is necessary to make `this` work in the callback 
		this.handleClick = this.handleClick.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.openSavePopup = this.openSavePopup.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.closeAddPopup = this.closeAddPopup.bind(this);
		this.saveNewTea = this.saveNewTea.bind(this);
		this.formChanged = this.formChanged.bind(this);
	}

	componentDidMount() {
		this.populateteasData();
	}

	handleClick(e) {
		this.selectTea(e);
	}

	handleDeleteClick(e, id) {
		e.preventDefault();
		this.deleteTea(id);
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

	formChanged(event) {
		this.setState({ newTea: event });
	}

	async deleteTea(teaId) {
		await fetch('/api/tea/' + teaId, { method: 'DELETE' });

		console.log('Tea deleted');

		await this.populateteasData();
	}

	async selectTea(teaId) {
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

		let minutes = this.state.newTea.durationMinutes;
		if (!minutes)
			minutes = 0;

		let seconds = this.state.newTea.durationSeconds;
		if (!seconds)
			seconds = 0;

		const tea = {
			name: this.state.newTea.name,
			description: this.state.newTea.description,
			temperature: this.state.newTea.temperature,
			duration: `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
		};

		await fetch('/api/tea/', {
			method: 'POST',
			body: JSON.stringify(tea),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		this.closeAddPopup();
		await this.populateteasData();
	}

	renderAddForm() {
		if (this.state.edit) {
			return <Modal isOpen={this.state.edit} className={this.props.className}>
				<ModalHeader>Add</ModalHeader>
				<ModalBody>
					<AddForm onChange={this.formChanged} name={this.state.newTea.name} description={this.state.newTea.description}></AddForm>
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
			(// TODO fix arrow function
				<Col>
					<Card key={tea.id} onClick={() => this.handleClick(tea.id)} style={{ cursor: "pointer" }}>
						<CardBody>
							<CardTitle tag="h3">{tea.name}</CardTitle>
							<CardSubtitle tag="h5">{tea.temperature} C - {tea.duration}</CardSubtitle>
							<CardText>{tea.description}</CardText>
							<Button color="danger" onClick={(e) => this.handleDeleteClick(e, tea.id)}>Del</Button>
						</CardBody>
					</Card>
				</Col>
			));
		} else {
			noImages = (<Card>
				<CardBody>
					<CardText>No teas</CardText>
				</CardBody>
			</Card>); 
			// return 'not found' component if no images fetched
		}

		return (
			<div className='teas-container'>
				<Row className='row-cols-1 row-cols-md-4 row-cols-lg-8 g-1'>
					<Col>
						<Card color="primary" onClick={this.openSavePopup} style={{ cursor: "pointer" }}>
							<CardBody>
								<CardText>Add</CardText>
							</CardBody>
						</Card>
					</Col>
					{images}

					{noImages}
				</Row>

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

import React, { Component } from 'react';
import CountdownTimer from './CountdownTimer';
import { getTime } from '../hooks/useCountdown';
import { AddForm } from './AddForm';
import { NavBar } from './NavBar';

export class Home extends Component {
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
		console.log('Form updated');
		console.log(event);
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
			const active = this.state.edit ? "is-active" : "";

			return <div className={`modal ${active}`}>
				<div className="modal-background"></div>
				<div className='modal-content'>
					<div className='modal-card'>
						<header className="modal-card-head">
							<p className="modal-card-title">Add</p>
						</header>
					</div>
					<section className="modal-card-body">
						<AddForm onChange={this.formChanged} name={this.state.newTea.name} description={this.state.newTea.description}
							temperature={this.state.newTea.temperature} durationMinutes={this.state.newTea.durationMinutes}
							durationSeconds={this.state.newTea.durationSeconds}></AddForm>
					</section>
					<footer className="modal-card-foot">
						<button className="button is-success" onClick={this.saveNewTea}>Save changes</button>
						<button className="button" onClick={this.closeAddPopup}>Cancel</button>
					</footer>
				</div>
			</div>
		}
	}

	renderTimer(duration) {
		if (duration) {
			const active = this.state.timerOn ? "is-active" : "";

			return <div className={`modal ${active}`}>
				<div className="modal-background"></div>
				<div className='modal-content'>
					<div className='modal-card'>
						<header className="modal-card-head">
							<p className="modal-card-title">{this.state.tea.name}</p>
						</header>
					</div>
					<section className="modal-card-body">
						<div className='content'>
							<CountdownTimer targetDate={duration} total={getTime(new Date(duration))} />
						</div>
					</section>
					<footer className="modal-card-foot">
						<button className="button" onClick={this.closePopup}>Cancel</button>
					</footer>
				</div>
			</div>;
		}
	}

	renderteasTable(teas) {
		let images;
		let noImages;
		// map variables to each item in fetched image array and return image component
		if (teas.length > 0) {
			images = teas.map(tea =>
			(// TODO fix arrow function
				<div className='card m-1' key={tea.id} >
					<div className='card-content is-clickable' onClick={() => this.handleClick(tea.id)}>
						<p className='title'>{tea.name}</p>
						<p className='subtitle'>{tea.temperature} C - {tea.duration}</p>
						<div className='content'>{tea.description}</div>
					</div>
					<footer className="card-footer">
						<a className="card-footer-item has-text-primary" href="#">
							<svg className="feather">
								<use href="/feather-sprite.svg#edit" />
							</svg>
						</a>
						<a className="card-footer-item has-text-danger" href="#" onClick={(e) => this.handleDeleteClick(e, tea.id)}>
							<span className="icon">
								<svg className="feather">
									<use href="/feather-sprite.svg#trash" />
								</svg>
							</span>
						</a>
					</footer>
				</div>
			));
		} else {
			noImages = <div className='block is-size-1 is-align-self-flex-end' key="1">No teas</div>;
		}

		return (
			<div className='is-flex is-flex-direction-row is-flex-wrap-wrap'>
				{images}

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
				<div className='container'>
					{this.renderAddForm()}
					{this.renderTimer(this.state.duration, this.state.tea)}
					{this.renderteasTable(this.state.teas)}
				</div>;
		}

		return (
			<div>
				<NavBar onAddClick={this.openSavePopup}></NavBar>
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

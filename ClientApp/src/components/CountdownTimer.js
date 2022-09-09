import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate, total, callback }) => {

	const [minutes, seconds, percent] = useCountdown(targetDate, total);

	if (minutes + seconds <= 0) {
		if (callback)
			callback();
		return <ExpiredNotice />;
	} else {
		const isDanger = minutes + seconds <= 10;
		return (
			<ShowCounter
				minutes={minutes}
				seconds={seconds}
				percent={percent}
				isDanger={isDanger}
			/>
		);
	}
};

const ExpiredNotice = () => {
	return (
		<div className="expired-notice">
			<span>Tea ready</span>
		</div>
	);
};

const ShowCounter = ({ minutes, seconds, percent, isDanger }) => {
	return (
		<div>
			<div className="countdown-link">
				<DateTimeDisplay value={minutes} isDanger={isDanger} />
				<span>:</span>
				<DateTimeDisplay value={seconds} isDanger={isDanger} />
			</div>
			<progress className={isDanger ? 'progress is-danger' : 'progress is-primary'} max="100" value={percent}></progress>
		</div>
	);
};


const DateTimeDisplay = ({ value, isDanger }) => {
	return (
		<span className={isDanger ? 'countdown danger' : 'countdown'}>
			{value}
		</span>
	);
};


export default CountdownTimer;
import React from 'react';
import { useCountdown, getTime } from '../hooks/useCountdown';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate, total }) => {

	const [minutes, seconds, percent] = useCountdown(targetDate, total);

	if (minutes + seconds <= 0) {
		return <ExpiredNotice />;
	} else {
		return (
			<ShowCounter
				minutes={minutes}
				seconds={seconds}
				percent={percent}
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

const ShowCounter = ({ minutes, seconds, percent }) => {
	return (
		<div>
			<div className="countdown-link">			
				<DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
				<p>:</p>
				<DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
			</div>
			<progress  className="progress" max="100" value={percent}></progress>
		</div>		
	);
};


const DateTimeDisplay = ({ value, type, isDanger }) => {
	return (
		<div className={isDanger ? 'countdown danger' : 'countdown'}>
			<p>{value}</p>
			<span>{type}</span>
		</div>
	);
};


export default CountdownTimer;
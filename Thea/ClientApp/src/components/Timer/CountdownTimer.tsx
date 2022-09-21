import React, { useEffect, useState } from 'react';
import useCountdown from '../../hooks/useCountdown';
import './CountdownTimer.css';
import DateTimeDisplay from './DateTimeDisplay';

interface CountdownTimerProps {
	targetDate: Date;
	total: number;
	callback: () => void;
}

const CountdownTimer = ({ targetDate, total, callback }: CountdownTimerProps) => {
	const [callbackCalled, setCallbackCalled] = useState(false);

	const [minutes, seconds, percent] = useCountdown(targetDate, total);
	const time = minutes * 60 + seconds;

	useEffect(() => {
		if (callbackCalled && callback)
			callback();
	}, [callbackCalled, callback]);

	if (time <= 0) {
		if (!callbackCalled) {
			// Callback only once
			setCallbackCalled(true);
		}

		return <ExpiredNotice />;
	} else {
		const isDanger = time <= 10;
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
	}
};

const ExpiredNotice = () => {
	return (
		<div className="expired-notice">
			<span>Tea ready</span>
		</div>
	);
};

export default CountdownTimer;
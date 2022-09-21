import React, { useEffect, useState } from 'react';
import useCountdown from '../../hooks/useCountdown';
import './CountdownTimer.css';
import DateTimeDisplay from './DateTimeDisplay';

interface CountdownTimerProps {
	targetDate: Date;
	total: number;
	callback: any;
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
					<DateTimeDisplay value={String(minutes).padStart(2, '0')} isDanger={isDanger} />
					<span>:</span>
					<DateTimeDisplay value={String(seconds).padStart(2, '0')} isDanger={isDanger} />
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
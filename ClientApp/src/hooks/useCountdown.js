import { useEffect, useState } from 'react';

const useCountdown = (targetDate, total) => {
	const countDownDate = new Date(targetDate);

	const [countDown, setCountDown] = useState(
		getTime(countDownDate)
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountDown(getTime(countDownDate));
		}, 1000);

		return () => clearInterval(interval);
	}, [countDownDate]);

	return getReturnValues(countDown, total);
};

const getReturnValues = (countDown, total) => {
	// calculate time left
	const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

	return [minutes, seconds, (countDown / total * 100)];
};

const getTime = (targetDate) => {
	return targetDate.getTime() - new Date().getTime()
};

export { useCountdown , getTime};
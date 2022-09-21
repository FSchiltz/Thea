import { useEffect, useMemo, useState } from 'react';
import { getTime } from '../helpers/Time';

const useCountdown = (targetDate: Date, total: number) => {
	const countDownDate = useMemo(() => {
		return new Date(targetDate);
	}, [targetDate]);

	const [countDown, setCountDown] = useState(
		getTime(countDownDate)
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountDown(getTime(countDownDate));
		}, 50);

		return () => clearInterval(interval);
	}, [countDownDate]);

	return getReturnValues(countDown, total);
};

const getReturnValues = (countDown: number, total: number) => {
	if (countDown < 0)
		return [0, 0, 0];

	// calculate time left
	const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

	const percent = (countDown / total * 100);

	return [minutes, seconds, percent];
};

export default useCountdown;
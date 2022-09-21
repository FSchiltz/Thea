import React from 'react';

interface DateTimeDisplayProps {
	value: any;
	isDanger: boolean;
}

export default function DateTimeDisplay({ value, isDanger }: DateTimeDisplayProps) {
	return (
		<span className={isDanger ? 'countdown danger' : 'countdown'}>
			{value}
		</span>
	);
};

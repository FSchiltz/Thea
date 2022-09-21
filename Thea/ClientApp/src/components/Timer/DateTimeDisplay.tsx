import React from 'react';

interface DateTimeDisplayProps {
	value: number;
	isDanger: boolean;
}

export default function DateTimeDisplay({ value, isDanger }: DateTimeDisplayProps) {
	return (
		<span className={isDanger ? 'countdown danger' : 'countdown'}>
			{String(value).padStart(2, '0')}
		</span>
	);
};

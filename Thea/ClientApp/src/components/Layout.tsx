import React from 'react';

export default function Layout(props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal; }) {
	return <div className="container is-fluid mt-5">
		{props.children}
	</div>;
};

import React from 'react';
import FilterBar from '../navbars/FilterBar';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen">
			<FilterBar />
			<main className="flex-1 ml-64 flex flex-col gap-2 px-10 pb-8 items-center">
				{children}
			</main>
		</div>
	);
};

export default PageWrapper;

import React from 'react';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen">
			<main className="flex-1 flex flex-col gap-2 px-20 pb-8 pt-20 items-center">{children}</main>
		</div>
	);
};

export default PageWrapper;

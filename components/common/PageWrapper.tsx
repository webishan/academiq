import React from 'react';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex min-h-screen flex-col flex-1 gap-2 px-10 pt-20 pb-8 items-center">{children}</div>;
};

export default PageWrapper;

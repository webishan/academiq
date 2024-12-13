import React from 'react';

const FilterBar = () => {
	return (
		<aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border p-4 flex flex-col gap-4 overflow-y-auto">
			{/* Header Section */}
			<div className="pb-4 border-b">
				<h2 className="font-semibold text-lg">Filters</h2>
			</div>
		</aside>
	);
};

export default FilterBar;

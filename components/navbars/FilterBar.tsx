import React from 'react'

const FilterBar = () => {
	return (
		<aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border p-4 flex flex-col gap-4">
			{/* Header Section */}
			<div className="pb-4 border-b">
				<h2 className="font-semibold text-lg">Filters</h2>
			</div>

			{/* Filter Sections - Add your filter components here */}
			<div className="flex flex-col gap-6">
				{/* Example Filter Section */}
				<div className="space-y-2">
					<h3 className="text-sm font-medium">Category</h3>
					{/* Add your category filter components */}
				</div>

				{/* Example Filter Section */}
				<div className="space-y-2">
					<h3 className="text-sm font-medium">Date Range</h3>
					{/* Add your date range filter components */}
				</div>

				{/* Example Filter Section */}
				<div className="space-y-2">
					<h3 className="text-sm font-medium">Status</h3>
					{/* Add your status filter components */}
				</div>
			</div>

			{/* Bottom Actions */}
			<div className="mt-auto pt-4 border-t">
				<button className="w-full bg-primary text-primary-foreground rounded-md py-2">
					Apply Filters
				</button>
			</div>
		</aside>
	)
}

export default FilterBar